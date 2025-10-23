import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { BlankFormValues, PaymentFormValues } from '@/lib/types'
import { DEFAULT_BLANK_FORM, DEFAULT_PAY_FORM } from '@/lib/constants'

const STORAGE_KEY = 'donation-form-data'

interface DonationFormData {
  currentStep: number
  blankForm: BlankFormValues
  paymentForm: PaymentFormValues
}

/**
 * Donation form store with sessionStorage persistence
 * Manages form state and step progression
 */
export const useDonationStore = defineStore('donation', () => {
  // ========== STATE ==========
  const currentStep = ref<number>(1)
  const blankForm = ref<BlankFormValues>({ ...DEFAULT_BLANK_FORM })
  const paymentForm = ref<PaymentFormValues>({ ...DEFAULT_PAY_FORM })

  // ========== HELPERS ==========

  /**
   * Normalize phone number - remove country code if present
   */
  function normalizePhone(phone: string | undefined, code: string): string | undefined {
    if (!phone || !code) return phone
    const digitsOnly = phone.replace(/\D/g, '')
    const codeWithoutPlus = code.replace('+', '')
    return digitsOnly.slice(codeWithoutPlus.length)
  }

  // ========== ACTIONS ==========

  /**
   * Update blank form values
   */
  function updateBlankForm(values: Partial<BlankFormValues>) {
    blankForm.value = { ...blankForm.value, ...values }
  }

  /**
   * Update payment form values
   */
  function updatePaymentForm(values: Partial<PaymentFormValues>) {
    paymentForm.value = { ...paymentForm.value, ...values }
  }

  /**
   * Go to next step
   */
  function nextStep() {
    if (currentStep.value < 2) {
      currentStep.value++
    }
  }

  /**
   * Go to previous step
   */
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  /**
   * Go to specific step
   */
  function goToStep(step: number) {
    if (step >= 1 && step <= 2) {
      currentStep.value = step
    }
  }

  /**
   * Reset all form data to defaults
   */
  function resetForm() {
    currentStep.value = 1
    blankForm.value = { ...DEFAULT_BLANK_FORM }
    paymentForm.value = { ...DEFAULT_PAY_FORM }
    clearStorage()
  }

  // ========== STORAGE HELPERS ==========

  /**
   * Load form data from sessionStorage
   */
  function loadFromStorage() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: DonationFormData = JSON.parse(stored)
        currentStep.value = data.currentStep || 1

        // Load blank form and normalize phone
        const loadedBlankForm = { ...DEFAULT_BLANK_FORM, ...data.blankForm }
        loadedBlankForm.phone = normalizePhone(loadedBlankForm.phone, loadedBlankForm.phoneCountry)
        blankForm.value = loadedBlankForm

        paymentForm.value = { ...DEFAULT_PAY_FORM, ...data.paymentForm }
      }
    } catch (error) {
      console.error('Failed to load donation form data from sessionStorage:', error)
      // If parsing fails, reset to defaults
      resetForm()
    }
  }

  /**
   * Save form data to sessionStorage
   */
  function saveToStorage() {
    try {
      // Normalize phone before saving
      const dataToSave: DonationFormData = {
        currentStep: currentStep.value,
        blankForm: {
          ...blankForm.value,
          phone: normalizePhone(blankForm.value.phone, blankForm.value.phoneCountry),
        },
        paymentForm: paymentForm.value,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save donation form data to sessionStorage:', error)
    }
  }

  /**
   * Clear form data from sessionStorage
   */
  function clearStorage() {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear donation form data from sessionStorage:', error)
    }
  }

  // ========== WATCHERS ==========

  // Auto-save to sessionStorage on any state change
  watch(
    [currentStep, blankForm, paymentForm],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // ========== INITIALIZATION ==========

  // Load from sessionStorage on store creation
  loadFromStorage()

  return {
    // State
    currentStep,
    blankForm,
    paymentForm,

    // Actions
    updateBlankForm,
    updatePaymentForm,
    nextStep,
    prevStep,
    goToStep,
    resetForm,

    // Storage helpers (exposed for manual control if needed)
    loadFromStorage,
    saveToStorage,
    clearStorage,
  }
})
