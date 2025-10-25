import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useDonationStore } from '@/stores/donation'

export function usePageLeaveConfirmation() {
  const donationStore = useDonationStore()
  const showConfirmDialog = ref(false)
  const pendingNavigation = ref<{ to: RouteLocationNormalized; next: NavigationGuardNext } | null>(
    null
  )

  // Проверяем есть ли несохранённые данные
  const hasUnsavedData = computed(() => {
    const { formData, currentStep, paymentResult } = donationStore

    // Если платёж уже прошёл успешно - данные "сохранены"
    if (paymentResult?.success) return false

    // Проверяем заполненные поля в форме анкеты
    const hasBlankData = Object.entries(formData.blank).some(([key, value]) => {
      if (key === 'phoneCountry' || key === 'isGroup') return false
      if (value === '') return false
      return value !== undefined && value !== false
    })

    // Проверяем заполненные поля в форме оплаты
    const hasPaymentData = Object.entries(formData.payment).some(([key, value]) => {
      if (key === 'note') return false
      return value !== undefined && value !== '' && value !== 0
    })

    // Есть данные и процесс не завершён
    return (hasBlankData || hasPaymentData) && currentStep < 3
  })

  // Обработчик beforeunload для закрытия вкладки/браузера
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedData.value) {
      e.preventDefault()
    }
  }

  // Обработчик навигации в рамках SPA
  const handleRouteLeave = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!hasUnsavedData.value) {
      return next()
    }

    // Сохраняем информацию о навигации и показываем диалог
    pendingNavigation.value = { to, next }
    showConfirmDialog.value = true
  }

  // Подтверждение ухода
  const confirmLeave = () => {
    if (pendingNavigation.value) {
      donationStore.resetForm()
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
    showConfirmDialog,
    hasUnsavedData,
    confirmLeave,
    cancelLeave,
  }
}
