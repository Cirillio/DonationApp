import { getCurrentFormattedDateTime } from '@/shared/lib/date'
import { ref, onBeforeUnmount } from 'vue'

export const useHeaderTimer = () => {
  const headerTimer = ref(getCurrentFormattedDateTime())

  const intervalId = setInterval(() => {
    headerTimer.value = getCurrentFormattedDateTime()
  }, 1000)

  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })

  return { headerTimer }
}
