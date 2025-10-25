import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlankFormValues, PaymentFormValues } from '@/lib/types'
import {
  DEFAULT_BLANK_FORM,
  DEFAULT_PAY_FORM,
  DONATION_STATUSES,
  MAX_STEPS,
  START_STATUS,
  STATUS_TO_STEP,
  STEP_TO_STATUS,
} from '@/lib/constants'
import { DonationStatus } from '@/lib/types/donate'

export const useDonationStore = defineStore('donation', () => {
  // Forms data
  const blankForm = ref<BlankFormValues>({ ...DEFAULT_BLANK_FORM })
  const paymentForm = ref<PaymentFormValues>({ ...DEFAULT_PAY_FORM })
  const paymentResult = ref<{ success: boolean; paymentId?: string } | null>(null)

  // Form updates
  function updateBlankForm(values: Partial<BlankFormValues>) {
    blankForm.value = { ...blankForm.value, ...values }
  }

  function updatePaymentForm(values: Partial<PaymentFormValues>) {
    paymentForm.value = { ...paymentForm.value, ...values }
  }

  // Stepper
  const currentStep = ref<number>(1)
  const currentStatus = computed<DonationStatus>(() => STEP_TO_STATUS[currentStep.value])
  const stepsValidity = ref<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  })

  function isCurrentStep(step: DonationStatus): boolean {
    return currentStep.value === STATUS_TO_STEP[step]
  }

  function setStepValidity(step: number, isValid: boolean) {
    stepsValidity.value[step] = isValid
  }

  function nextStep() {
    if (currentStep.value < MAX_STEPS) {
      currentStep.value++
    }
  }

  function prevStep() {
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

  // Payment
  function finish(result?: { success: boolean; paymentId?: string }) {
    if (result) {
      paymentResult.value = result
    }
    currentStep.value = 3
  }

  function setPaymentResult(result: { success: boolean; paymentId?: string }) {
    paymentResult.value = result
  }

  // Reset
  function resetForm() {
    currentStep.value = 1
    blankForm.value = { ...DEFAULT_BLANK_FORM }
    paymentForm.value = { ...DEFAULT_PAY_FORM }
    paymentResult.value = null
    stepsValidity.value = {
      1: false,
      2: false,
      3: false,
    }
  }

  return {
    // State
    currentStep,
    blankForm,
    paymentForm,
    paymentResult,
    currentStatus,
    stepsValidity,

    // Getters
    isCurrentStep,

    // Actions
    updateBlankForm,
    updatePaymentForm,
    setStepValidity,
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
