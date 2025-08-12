import { ref, watch } from 'vue'
import type { PhoneSpec, CodeSelector } from '../model/types'

const useCodeSelector = (params: CodeSelector) => {
  const selectedCode = ref<PhoneSpec>(
    params.phoneSpecs.find((c) => c.id === params.defaultId) as PhoneSpec
  )
  const currentMask = ref<string>('')

  watch(
    () => selectedCode.value.id,
    (newId) => {
      const foundCountry = params.phoneSpecs.find((c) => c.id === newId)

      if (foundCountry) {
        currentMask.value = foundCountry.mask
      } else {
        currentMask.value = ''
        console.warn(`Страна с ID ${newId} не найдена.`)
      }
    },
    { immediate: true }
  )

  return { selectedCode, currentMask }
}

export { useCodeSelector }
