import { defineStore } from 'pinia'
import { ref, computed, ComputedRef, reactive } from 'vue'
import type { BlankFormValues, PaymentFormValues } from '@/lib/types'
import {
  DONATION_STATUSES,
  MAX_STEPS,
  START_STATUS,
  STATUS_TO_STEP,
  STEP_TO_STATUS,
  DEFAULT_BLANK_FORM,
  DEFAULT_PAY_FORM,
} from '@/lib/constants'
import { getPhoneSpec } from '@/lib/utils'
import { DonationStatus } from '@/lib/types/donate'
import { z, type ZodError } from 'zod'
import { phoneSchema, nameSchema, birthSchema, isGroupSchema } from '@/lib/validations/blank'
import { amountSchema, typeSchema, noteSchema } from '@/lib/validations/payment'

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
    blank: z.object({
      phone: phoneSchema(() => getPhoneSpec(formData.blank.phoneCountry).code || ''),
      phoneCountry: z.string(),
      name: nameSchema,
      birth: birthSchema,
      isGroup: isGroupSchema,
    }),
    payment: z.object({
      amount: amountSchema,
      type: typeSchema,
      note: noteSchema,
    }),
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

  const clearFieldError = (formName: 'blank' | 'payment', fieldName: string) => {
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

  function setStepByStatus(status: DonationStatus) {
    const step = STATUS_TO_STEP[status]
    if (step) {
      goToStep(step)
    }
  }

  const initStatus = (
    query: DonationStatus | null | undefined
  ): {
    success: boolean
    query?: {
      status: DonationStatus
    }
  } => {
    if (!query) {
      return {
        success: false,
        query: {
          status: START_STATUS,
        },
      }
    }

    if (DONATION_STATUSES.includes(query)) {
      setStepByStatus(query)
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        query: {
          status: START_STATUS,
        },
      }
    }
  }

  function finish(result?: { success: boolean; paymentId?: string }) {
    if (result) {
      paymentResult.value = result
    }
    currentStep.value = 3
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
    setStepByStatus,
    initStatus,
    finish,
    setPaymentResult,
    resetForm,
  }
})
