import { ref } from 'vue'

export function useCardFocus<T extends string>() {
  const focused = ref<T | null>(null)

  function bindFocus(id: T) {
    return {
      onFocusin: () => {
        focused.value = id
      },
      onFocusout: (e: FocusEvent) => {
        const host = e.currentTarget as HTMLElement
        if (!host.contains(e.relatedTarget as Node)) {
          if (focused.value === id) focused.value = null
        }
      },
      tabindex: -1,
    }
  }

  const isActive = (id: T) => focused.value === id

  return { focused, bindFocus, isActive }
}
