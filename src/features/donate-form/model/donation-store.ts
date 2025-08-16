import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlankSchema } from '@/domain/blank/schema'
import type { PaySchema } from '@/domain/payment/schema'
import { DEFAULT_BLANK_FORM } from '@/domain/blank/default'
import { DEFAULT_PAY_FORM } from '@/domain/payment/default'

export const useDonationStore = defineStore('donation', () => {
  const blankForm = ref<Partial<BlankSchema>>(DEFAULT_BLANK_FORM)

  const payForm = ref<Partial<PaySchema>>(DEFAULT_PAY_FORM)

  const resetBlankForm = () => {
    blankForm.value = DEFAULT_BLANK_FORM
  }

  const resetPayForm = () => {
    payForm.value = DEFAULT_PAY_FORM
  }

  const resetAll = () => {
    resetBlankForm()
    resetPayForm()
  }

  const blankValid = ref(false)
  const payValid = ref(false)

  const isValid = computed(() => blankValid.value && payValid.value)

  function setBlankValidity(isValid: boolean) {
    blankValid.value = isValid
  }

  function setPayValidity(isValid: boolean) {
    payValid.value = isValid
  }

  return {
    blankForm,
    payForm,
    resetBlankForm,
    resetPayForm,
    resetAll,
    setPayValidity,
    setBlankValidity,
    payValid,
    blankValid,
    isValid,
  }
})
