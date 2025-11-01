/**
 * Композабл для работы с телефонными номерами
 *
 * @description
 * Управляет форматами телефонных номеров для различных стран,
 * парсит номера из буфера обмена и предоставляет маски для ввода.
 *
 * @example
 * const { selectedSpec, currentMask, selectById, parsePhoneFromClipboard } = usePhone({
 *   defaultId: 'RU'
 * })
 *
 * // Получить текущую маску
 * const mask = currentMask.value
 *
 * // Переключить формат
 * selectById('KZ')
 *
 * // Парсить номер из буфера обмена
 * const parsedNumber = parsePhoneFromClipboard('+7 999 999 99 99')
 */
import { ref, computed, watch } from 'vue'
import { PHONE_SPECS, DEFAULT_PHONE_SPEC } from '@/lib/constants'
import type { PhoneSpec } from '@/lib/types'
import parsePhoneNumber from 'libphonenumber-js'

export interface UsePhoneOptions {
  /**
   * ID формата телефона по умолчанию
   * @default значение DEFAULT_PHONE_SPEC.id
   */
  defaultId?: string
}

export function usePhone(options?: UsePhoneOptions) {
  const defaultId = options?.defaultId ?? DEFAULT_PHONE_SPEC.id

  const selectedSpec = ref<PhoneSpec>(
    PHONE_SPECS.find((spec) => spec.id === defaultId) ?? PHONE_SPECS[0]
  )

  const currentMask = ref<string>('')

  watch(
    () => selectedSpec.value.id,
    (newId) => {
      const foundSpec = PHONE_SPECS.find((spec) => spec.id === newId)

      if (foundSpec) {
        currentMask.value = foundSpec.mask
      } else {
        currentMask.value = ''
        console.warn(`Phone spec with ID ${newId} not found.`)
      }
    },
    { immediate: true }
  )

  const selectById = (id: string) => {
    const found = PHONE_SPECS.find((spec) => spec.id === id)
    if (!found) {
      console.warn(`Phone spec with ID ${id} not found.`)
      return
    }
    selectedSpec.value = found
  }

  const parsePhoneFromClipboard = (pastedText: string): string | null => {
    const parsed = parsePhoneNumber(pastedText, selectedSpec.value.id)
    if (parsed) {
      const formatted = parsed.formatInternational()
      return formatted.replace(selectedSpec.value.code, '').trim()
    }
    return null
  }

  return {
    selectedSpec: computed(() => selectedSpec.value),
    currentMask: computed(() => currentMask.value),
    selectById,
    parsePhoneFromClipboard,
    phoneSpecs: PHONE_SPECS,
  }
}
