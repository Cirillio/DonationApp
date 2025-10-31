import { ref, onMounted, onUnmounted, type ComputedRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Конфигурация хука usePageLeaveConfirmation
 */
interface PageLeaveConfig {
  /** Computed свойство, которое определяет наличие несохраненных данных */
  hasUnsavedData: ComputedRef<boolean>
  /** Callback при подтверждении ухода */
  onConfirm?: () => void
}

/**
 * Универсальный композабл для подтверждения ухода со страницы при наличии несохранённых данных
 *
 * Управляет только диалоговым окном подтверждения. Логика проверки наличия несохраненных данных
 * должна быть реализована в store через computed свойства.
 *
 * @example
 * ```ts
 * const donationStore = useDonationStore()
 *
 * const { showConfirmDialog, confirmLeave, cancelLeave } = usePageLeaveConfirmation({
 *   hasUnsavedData: donationStore.hasUnsavedData,
 *   onConfirm: () => donationStore.resetForm(),
 * })
 * ```
 */
export function usePageLeaveConfirmation(config: PageLeaveConfig) {
  const showConfirmDialog = ref(false)
  const pendingNavigation = ref<{ to: RouteLocationNormalized; next: NavigationGuardNext } | null>(
    null
  )

  // Обработчик beforeunload для закрытия вкладки/браузера
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (config.hasUnsavedData.value) {
      e.preventDefault()
      // Современные браузеры игнорируют кастомное сообщение, показывают свое
      e.returnValue = ''
    }
  }

  // Обработчик навигации в рамках SPA
  const handleRouteLeave = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!config.hasUnsavedData.value) {
      return next()
    }

    // Сохраняем информацию о навигации и показываем диалог
    pendingNavigation.value = { to, next }
    showConfirmDialog.value = true
  }

  // Подтверждение ухода
  const confirmLeave = () => {
    if (pendingNavigation.value) {
      // Вызываем callback при подтверждении (например, для сброса формы)
      if (config.onConfirm) {
        config.onConfirm()
      }
      pendingNavigation.value.next()
      pendingNavigation.value = null
    }
    showConfirmDialog.value = false
  }

  // Отмена ухода
  const cancelLeave = () => {
    if (pendingNavigation.value) {
      pendingNavigation.value.next(false)
      pendingNavigation.value = null
    }
    showConfirmDialog.value = false
  }

  // Установка listeners
  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  // Установка route guard
  onBeforeRouteLeave((to, _, next) => handleRouteLeave(to, next))

  return {
    /** Ref для управления видимостью диалога подтверждения */
    showConfirmDialog,
    /** Функция для подтверждения ухода */
    confirmLeave,
    /** Функция для отмены ухода */
    cancelLeave,
  }
}
