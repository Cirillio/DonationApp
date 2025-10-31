import { defineStore } from 'pinia'
import { ref, computed, ComputedRef, reactive, toRaw } from 'vue'
import type { BlankFormValues, PaymentFormValues, DonationStatus } from '@/lib/types'
import {
  MAX_STEPS,
  STATUS_TO_STEP,
  STEP_TO_STATUS,
  DEFAULT_BLANK_FORM,
  DEFAULT_PAY_FORM,
} from '@/lib/constants'
import { getPhoneSpec } from '@/lib/utils'
import { type ZodError, z } from 'zod'
import { blankFormSchema, paymentFormSchema } from '@/lib/validations'

/**
 * Нормализует значение для сравнения (пустая строка = undefined = null)
 */
function normalizeValue(value: unknown): unknown {
  return value === '' || value === null ? undefined : value
}

/**
 * Извлекает список optional полей из Zod схемы
 */
function getOptionalKeys(schema: z.ZodObject<any>): string[] {
  // Используем toRaw чтобы получить реальную схему без прокси
  const rawSchema = toRaw(schema)
  const shape = rawSchema.shape
  const optionalKeys: string[] = []

  for (const [key, fieldSchema] of Object.entries(shape)) {
    // Используем toRaw для каждого поля схемы
    const rawFieldSchema = toRaw(fieldSchema)
    if (rawFieldSchema instanceof z.ZodOptional) {
      optionalKeys.push(key)
    }
  }

  return optionalKeys
}

/**
 * Проверяет, есть ли изменения в форме по сравнению с дефолтными значениями
 */
function hasFormChanges<T extends Record<string, unknown>>(
  formData: T,
  defaultData: T,
  schema: z.ZodObject<any>,
  additionalIgnoreKeys: string[] = []
): boolean {
  const optionalKeys = getOptionalKeys(schema)
  const ignoreKeys = [...optionalKeys, ...additionalIgnoreKeys]

  return Object.entries(formData).some(([key, value]) => {
    if (ignoreKeys.includes(key)) return false

    const defaultValue = defaultData[key as keyof T]
    const normalizedValue = normalizeValue(value)
    const normalizedDefault = normalizeValue(defaultValue)

    return normalizedValue !== normalizedDefault
  })
}

function formatZodErrors(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.issues.forEach((err) => {
    const field = err.path[0]?.toString()
    if (field) {
      formatted[field] = err.message
    }
  })
  return formatted
}

export const useDonationStore = defineStore('donation', () => {
  const formData = reactive<{
    blank: BlankFormValues
    payment: PaymentFormValues
  }>({
    blank: { ...DEFAULT_BLANK_FORM },
    payment: { ...DEFAULT_PAY_FORM },
  })

  // Схемы валидации - не храним в reactive, так как Zod схемы не должны быть проксированы
  const getBlankSchema = () =>
    blankFormSchema({
      getPhone: () => getPhoneSpec(formData.blank.phoneCountry).code || '',
    })

  const getPaymentSchema = () => paymentFormSchema

  // Для совместимости с существующим кодом создаем объект с геттерами
  const formSchemas = {
    get blank() {
      return getBlankSchema()
    },
    get payment() {
      return getPaymentSchema()
    },
  }

  const fieldErrors = reactive<{
    blank: Record<string, string>
    payment: Record<string, string>
  }>({
    blank: {},
    payment: {},
  })

  const formValid = reactive<{
    blank: boolean
    payment: boolean
  }>({
    blank: false,
    payment: false,
  })

  const paymentResult = ref<{ success: boolean; paymentId?: string } | null>(null)
  const paymentCompleted = ref(false)
  const transitionDirection = ref<'forward' | 'backward'>('forward')
  const isInitialLoad = ref(true)

  const validateForm = (formName: keyof typeof formSchemas) => {
    try {
      const result = formSchemas[formName].safeParse(formData[formName])

      if (!result.success) {
        fieldErrors[formName] = formatZodErrors(result.error)
        formValid[formName] = false
        return false
      }

      fieldErrors[formName] = {}
      formValid[formName] = true
      return true
    } catch (error) {
      console.error('Validation error:', error, ' | ', formName)
      formValid[formName] = false
      return false
    }
  }

  const clearFieldError = (formName: keyof typeof formSchemas, fieldName: string) => {
    delete fieldErrors[formName][fieldName]
  }

  const currentStep = ref<number>(1)
  const currentStatus = computed<DonationStatus>(() => STEP_TO_STATUS[currentStep.value])

  const stepsValidity: ComputedRef<Record<number, boolean>> = computed(() => ({
    1: formValid.blank,
    2: formValid.payment,
    3: paymentCompleted.value,
  }))

  function isCurrentStep(step: DonationStatus): boolean {
    return currentStep.value === STATUS_TO_STEP[step]
  }

  function nextStep() {
    isInitialLoad.value = false
    transitionDirection.value = 'forward'
    if (currentStep.value < MAX_STEPS) {
      currentStep.value++
    }
  }

  function prevStep() {
    isInitialLoad.value = false
    transitionDirection.value = 'backward'
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= MAX_STEPS) {
      currentStep.value = step
    }
  }

  function finish(result?: { success: boolean; paymentId?: string }) {
    if (result) {
      paymentResult.value = result
    }
    currentStep.value = 3
  }

  /**
   * Проверяет наличие платежного токена и переходит на страницу результата
   * @param paymentToken - токен платежа из URL параметров
   */
  const checkPaymentToken = (paymentToken: string | null) => {
    if (paymentToken) {
      // Переходим на шаг с результатом
      goToStep(3)

      // TODO: В будущем здесь будет запрос на сервер для получения данных платежа
      // const paymentData = await fetchPaymentByToken(paymentToken)
      // donationStore.setPaymentResult(paymentData)
    }
  }
  function setPaymentResult(result: { success: boolean; paymentId?: string }) {
    paymentResult.value = result
    if (result.success) {
      paymentCompleted.value = true
    }
  }

  function resetForm() {
    isInitialLoad.value = true
    transitionDirection.value = 'backward'
    currentStep.value = 1
    Object.assign(formData.blank, { ...DEFAULT_BLANK_FORM })
    Object.assign(formData.payment, { ...DEFAULT_PAY_FORM })
    formValid.blank = false
    formValid.payment = false
    fieldErrors.blank = {}
    fieldErrors.payment = {}
    paymentResult.value = null
    paymentCompleted.value = false
  }

  // Computed свойства для проверки заполненности форм (для подтверждения ухода)
  const hasUnsavedBlankForm = computed(() => {
    return hasFormChanges(
      formData.blank,
      DEFAULT_BLANK_FORM,
      formSchemas.blank,
      ['phoneCountry', 'isGroup'] // Игнорируем служебные поля
    )
  })

  const hasUnsavedPaymentForm = computed(() => {
    return hasFormChanges(formData.payment, DEFAULT_PAY_FORM, formSchemas.payment)
  })

  // Общее computed свойство - есть ли несохраненные данные
  const hasUnsavedData = computed(() => {
    // Не проверяем на шаге результата или если платеж успешен
    if (currentStep.value >= 3 || paymentResult.value?.success) {
      return false
    }

    return hasUnsavedBlankForm.value || hasUnsavedPaymentForm.value
  })

  return {
    formData,
    fieldErrors,
    formValid,
    paymentResult,
    currentStep,
    currentStatus,
    stepsValidity,
    transitionDirection,
    isInitialLoad,
    isCurrentStep,
    validateForm,
    clearFieldError,
    nextStep,
    prevStep,
    goToStep,
    finish,
    checkPaymentToken,
    setPaymentResult,
    resetForm,
    // Новые computed для проверки заполненности
    hasUnsavedBlankForm,
    hasUnsavedPaymentForm,
    hasUnsavedData,
  }
})
