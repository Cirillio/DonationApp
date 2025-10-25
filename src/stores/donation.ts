/**
 * @fileoverview Donation Store - Multi-step donation form state management
 *
 * This store implements a hybrid approach to form state management that balances
 * the benefits of vee-validate with the need for persistent state across component
 * lifecycle and step navigation.
 *
 * ## Architecture Overview
 *
 * ### Problem Solved
 * Previously, the store held references to vee-validate FormContext objects, which caused:
 * - Memory leaks (circular references, DOM element retention)
 * - Difficult form reset (meta state wouldn't clear properly)
 * - Race conditions during component remounting
 *
 * ### Current Solution: Hybrid Approach
 *
 * 1. **Store holds values + meta, NOT FormContext**
 *    - `formData`: Plain objects with form values (single source of truth)
 *    - `formMeta`: Validation state (valid, dirty, touched)
 *
 * 2. **Components use vee-validate normally**
 *    - Create forms with `useForm()` and `keepValuesOnUnmount: false`
 *    - Initialize from store: `initialValues: donationStore.formData.blank`
 *
 * 3. **Two-way sync via watchers**
 *    - Component watches form.values → calls `updateFormValues()`
 *    - Component watches form.meta → calls `syncFormMeta()`
 *    - Watchers stopped on unmount to prevent leaks
 *
 * ### Benefits
 * ✅ No memory leaks - only plain objects stored
 * ✅ Clean reset - simple Object.assign() works perfectly
 * ✅ Persistence - values survive component unmount/remount
 * ✅ Full vee-validate features - validation, error messages, field-level control
 *
 * ### Data Flow
 * ```
 * User input → vee-validate form → watcher → store.updateFormValues()
 *                                         → store.syncFormMeta()
 *
 * Store reset → formData updated → component remounts → useForm(initialValues: formData)
 * ```
 *
 * @module stores/donation
 */
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
import { DonationStatus } from '@/lib/types/donate'

/**
 * Form metadata for validation state tracking
 *
 * Synced from vee-validate's FormMeta via component watchers.
 * Used to determine step validity for navigation control.
 */
interface FormMeta {
  valid: boolean
  dirty: boolean
  touched: boolean
}

/**
 * Donation Store
 *
 * Manages the state and logic for the multi-step donation form.
 * Uses a hybrid approach: stores form values directly (not FormContext)
 * to prevent memory leaks, while maintaining two-way sync with vee-validate forms.
 *
 * Architecture:
 * - formData: Stores actual form values (single source of truth)
 * - formMeta: Tracks validation state (valid, dirty, touched)
 * - Components watch their vee-validate forms and sync changes to store
 * - Store provides getters for read-only access to values
 */
export const useDonationStore = defineStore('donation', () => {
  //#region forms data

  /**
   * Form values storage
   * Stores actual user input directly without FormContext references
   * This prevents memory leaks from holding onto vee-validate internals
   */
  const formData = reactive({
    blank: { ...DEFAULT_BLANK_FORM } as BlankFormValues,
    payment: { ...DEFAULT_PAY_FORM } as PaymentFormValues,
  })

  /**
   * Form validation metadata
   * Tracks validation state separately from values
   * Synced from vee-validate via component watchers
   */
  const formMeta = reactive({
    blank: { valid: false, dirty: false, touched: false } as FormMeta,
    payment: { valid: false, dirty: false, touched: false } as FormMeta,
  })

  /**
   * Payment processing result
   * Set after payment API call completes (or simulated completion)
   */
  const paymentResult = ref<{ success: boolean; paymentId?: string } | null>(null)

  /**
   * Get a copy of blank form values
   *
   * @returns Shallow copy of blank form values
   * @example const values = donationStore.getBlankValues()
   */
  const getBlankValues = (): BlankFormValues => {
    return { ...formData.blank }
  }

  /**
   * Get a copy of payment form values
   *
   * @returns Shallow copy of payment form values
   * @example const values = donationStore.getPaymentValues()
   */
  const getPaymentValues = (): PaymentFormValues => {
    return { ...formData.payment }
  }

  /**
   * Update form values from component watchers
   *
   * Called by component watchers when vee-validate form values change.
   * Merges partial updates into existing form data.
   *
   * @param formName - Which form to update ('blank' | 'payment')
   * @param values - Partial form values to merge
   * @example donationStore.updateFormValues('blank', { phone: '1234567890' })
   */
  const updateFormValues = (
    formName: 'blank' | 'payment',
    values: Partial<BlankFormValues | PaymentFormValues>
  ) => {
    Object.assign(formData[formName], values)
  }

  /**
   * Sync form validation metadata from component watchers
   *
   * Called by component watchers when vee-validate form meta changes.
   * Updates validation state (valid, dirty, touched) in store.
   *
   * @param formName - Which form meta to update ('blank' | 'payment')
   * @param meta - Partial meta information to merge
   * @example donationStore.syncFormMeta('blank', { valid: true, dirty: true })
   */
  const syncFormMeta = (formName: 'blank' | 'payment', meta: Partial<FormMeta>) => {
    Object.assign(formMeta[formName], meta)
  }

  //#endregion

  //#region stepper

  /**
   * Current step in the donation wizard (1-3)
   * 1 = Анкета, 2 = Оплата, 3 = Результат
   */
  const currentStep = ref<number>(1)

  /**
   * Current step status as string
   * Computed from currentStep: 'blank' | 'payment' | 'result'
   */
  const currentStatus = computed<DonationStatus>(() => STEP_TO_STATUS[currentStep.value])

  /**
   * Validation state for each step
   *
   * Computed from formMeta to determine if user can proceed to next step.
   * Step 3 is always false to prevent backward navigation from result page.
   *
   * @returns Object mapping step number to validity boolean
   */
  const stepsValidity: ComputedRef<Record<number, boolean>> = computed(() => {
    return {
      1: formMeta.blank.valid,
      2: formMeta.payment.valid,
      3: false, // Result step is never "valid" - prevents going back
    }
  })

  /**
   * Check if given status matches current step
   *
   * @param step - Status to check ('blank' | 'payment' | 'result')
   * @returns True if the status matches current step
   * @example if (isCurrentStep('blank')) { ... }
   */
  function isCurrentStep(step: DonationStatus): boolean {
    return currentStep.value === STATUS_TO_STEP[step]
  }

  /**
   * Move to next step if not at the end
   *
   * Should only be called when current step is valid.
   * Does nothing if already at step 3.
   *
   * @example donationStore.nextStep() // 1 → 2 → 3
   */
  function nextStep() {
    if (currentStep.value < MAX_STEPS) {
      currentStep.value++
    }
  }

  /**
   * Move to previous step if not at the beginning
   *
   * Does nothing if already at step 1.
   *
   * @example donationStore.prevStep() // 3 → 2 → 1
   */
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  /**
   * Jump directly to a specific step
   *
   * Performs bounds checking to ensure step is valid (1-3).
   *
   * @param step - Step number (1-3)
   * @example donationStore.goToStep(2) // Jump to payment step
   */
  function goToStep(step: number) {
    if (step >= 1 && step <= MAX_STEPS) {
      currentStep.value = step
    }
  }

  /**
   * Set step by status string
   *
   * Converts status to step number and calls goToStep.
   * Used primarily for URL query parameter initialization.
   *
   * @param status - Status string ('blank' | 'payment' | 'result')
   * @example donationStore.setStepByStatus('payment') // Sets step to 2
   */
  function setStepByStatus(status: DonationStatus) {
    const step = STATUS_TO_STEP[status]
    if (step) {
      goToStep(step)
    }
  }

  /**
   * Initialize step from URL query parameter
   *
   * Validates and sets initial step based on ?status query param.
   * Returns whether initialization was successful and suggested query if not.
   *
   * @param query - Status from URL query parameter
   * @returns Object with success flag and optional corrected query
   * @example
   * const result = initStatus(route.query.status)
   * if (!result.success) {
   *   router.replace({ query: result.query })
   * }
   */
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
  //#endregion

  //#region payment

  /**
   * Complete donation and move to result step
   *
   * Transitions to step 3 (result page) immediately.
   * Optionally sets payment result if provided, or waits for
   * setPaymentResult to be called later (e.g., after async API call).
   *
   * @param result - Optional payment result to set immediately
   * @example
   * donationStore.finish() // Move to result, show loading
   * // Later, after API call:
   * donationStore.setPaymentResult({ success: true, paymentId: '123' })
   */
  function finish(result?: { success: boolean; paymentId?: string }) {
    if (result) {
      paymentResult.value = result
    }
    currentStep.value = 3
  }

  /**
   * Update payment result after processing
   *
   * Called after payment API completes (success or failure).
   * Updates result state which triggers UI changes in DonationResult component.
   *
   * @param result - Payment processing result
   * @example
   * try {
   *   const response = await paymentAPI.process(...)
   *   donationStore.setPaymentResult({ success: true, paymentId: response.id })
   * } catch (error) {
   *   donationStore.setPaymentResult({ success: false })
   * }
   */
  function setPaymentResult(result: { success: boolean; paymentId?: string }) {
    paymentResult.value = result
  }

  //#endregion

  /**
   * Reset all form data and state to initial values
   *
   * This is the single source of truth for form reset.
   * Called when user clicks "Сделать ещё одно пожертвование" or
   * when user leaves page with unsaved data.
   *
   * Resets:
   * - Current step back to 1
   * - All form values to defaults
   * - All form meta (valid, dirty, touched) to false
   * - Payment result to null
   *
   * Note: Components will automatically re-sync with reset values
   * via their initialValues binding to formData.
   *
   * @example donationStore.resetForm() // Start fresh donation flow
   */
  function resetForm() {
    // Reset step to first
    currentStep.value = 1

    // Reset form values to defaults
    Object.assign(formData.blank, { ...DEFAULT_BLANK_FORM })
    Object.assign(formData.payment, { ...DEFAULT_PAY_FORM })

    // Reset form meta to initial state
    Object.assign(formMeta.blank, { valid: false, dirty: false, touched: false })
    Object.assign(formMeta.payment, { valid: false, dirty: false, touched: false })

    // Clear payment result
    paymentResult.value = null
  }

  //#region return
  return {
    // State
    formData,
    formMeta,
    paymentResult,
    currentStep,
    currentStatus,
    stepsValidity,

    // Getters
    getBlankValues,
    getPaymentValues,
    isCurrentStep,

    // Actions
    updateFormValues,
    syncFormMeta,
    nextStep,
    prevStep,
    goToStep,
    setStepByStatus,
    initStatus,
    finish,
    setPaymentResult,
    resetForm,
  }
  //#endregion
})
