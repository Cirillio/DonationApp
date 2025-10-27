import { defineStore } from 'pinia'
import { ref, computed, ComputedRef, reactive } from 'vue'
import type { BlankFormValues, PaymentFormValues, DonationStatus } from '@/lib/types'
import {
  MAX_STEPS,
  STATUS_TO_STEP,
  STEP_TO_STATUS,
  DEFAULT_BLANK_FORM,
  DEFAULT_PAY_FORM,
} from '@/lib/constants'
import { getPhoneSpec } from '@/lib/utils'
import { type ZodError } from 'zod'
import { blankFormSchema, paymentFormSchema } from '@/lib/validations'

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

  const formSchemas = reactive({
    blank: blankFormSchema({
      getPhone: () => getPhoneSpec(formData.blank.phoneCountry).code || '',
    }),
    payment: paymentFormSchema,
  })

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
  }
})
