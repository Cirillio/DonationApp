import { ref, watch } from 'vue'
import type { PhoneSpec, CodeSelectorParams } from '../model/types'

const useCodeSelector = (params: CodeSelectorParams) => {
  const selectedSpec = ref<PhoneSpec>(
    params.phoneSpecs.find((c) => c.id === params.defaultId) as PhoneSpec
  )

  const currentMask = ref<string>('')

  watch(
    () => selectedSpec.value.id,
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

  function selectById(id: PhoneSpec['id']) {
    const found = params.phoneSpecs.find((c) => c.id === id) ?? null
    if (!found) {
      console.warn(`Страна с ID ${id} не найдена.`)
      return
    }
    selectedSpec.value = found
  }

  return { selectedSpec, currentMask, selectById }
}

export { useCodeSelector }
