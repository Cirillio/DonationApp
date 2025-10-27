import { ref, computed, onMounted, onUnmounted, type ComputedRef, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { z } from 'zod'

/**
 * Конфигурация формы для отслеживания изменений
 */
interface FormConfig<T extends Record<string, unknown>> {
  /** Реактивные данные формы или функция для их получения */
  data: ComputedRef<T> | Ref<T> | (() => T)
  /** Значения формы по умолчанию */
  defaults: T
  /** Zod схема для определения optional полей */
  schema: z.ZodObject<any>
  /** Дополнительные поля для игнорирования (не optional, но не значимые) */
  ignoreFields?: string[]
}

/**
 * Конфигурация хука usePageLeaveConfirmation
 */
interface PageLeaveConfig {
  /** Массив конфигураций форм для отслеживания */
  forms: FormConfig<any>[]
  /** Дополнительное условие для предотвращения ухода со страницы */
  shouldPrevent?: () => boolean
  /** Callback при подтверждении ухода */
  onConfirm?: () => void
}

/**
 * Нормализует значение для сравнения (пустая строка = undefined = null)
 */
function normalizeValue(value: unknown): unknown {
  return value === '' || value === null ? undefined : value
}

/**
 * Извлекает список optional полей из Zod схемы
 */
function getOptionalKeys(schema: z.ZodObject<any>): string[] {
  const shape = schema.shape
  const optionalKeys: string[] = []

  for (const [key, fieldSchema] of Object.entries(shape)) {
    // Проверяем, является ли поле optional
    if (fieldSchema instanceof z.ZodOptional) {
      optionalKeys.push(key)
    }
  }

  return optionalKeys
}

/**
 * Проверяет, есть ли изменения в форме по сравнению с дефолтными значениями
 */
function hasFormChanges<T extends Record<string, unknown>>(
  formData: T,
  defaultData: T,
  schema: z.ZodObject<any>,
  additionalIgnoreKeys: string[] = []
): boolean {
  // Получаем optional поля из схемы
  const optionalKeys = getOptionalKeys(schema)

  // Объединяем все игнорируемые поля
  const ignoreKeys = [...optionalKeys, ...additionalIgnoreKeys]

  return Object.entries(formData).some(([key, value]) => {
    // Пропускаем поля из списка игнорируемых
    if (ignoreKeys.includes(key)) return false

    const defaultValue = defaultData[key as keyof T]

    // Нормализуем значения для сравнения
    const normalizedValue = normalizeValue(value)
    const normalizedDefault = normalizeValue(defaultValue)

    return normalizedValue !== normalizedDefault
  })
}

/**
 * Универсальный композабл для подтверждения ухода со страницы при наличии несохранённых данных
 *
 * @example
 * ```ts
 * usePageLeaveConfirmation({
 *   forms: [
 *     {
 *       data: () => store.formData.blank,
 *       defaults: DEFAULT_BLANK_FORM,
 *       schema: blankSchema,
 *       ignoreFields: ['phoneCountry']
 *     }
 *   ],
 *   shouldPrevent: () => currentStep < 3
 * })
 * ```
 */
export function usePageLeaveConfirmation(config: PageLeaveConfig) {
  const showConfirmDialog = ref(false)
  const pendingNavigation = ref<{ to: RouteLocationNormalized; next: NavigationGuardNext } | null>(
    null
  )

  // Проверяем есть ли несохранённые данные
  const hasUnsavedData = computed(() => {
    // Проверяем дополнительное условие (если есть)
    if (config.shouldPrevent && !config.shouldPrevent()) {
      return false
    }

    // Проверяем каждую форму на наличие изменений
    return config.forms.some((formConfig) => {
      // Получаем данные формы
      const formData =
        typeof formConfig.data === 'function' ? formConfig.data() : formConfig.data.value

      return hasFormChanges(
        formData,
        formConfig.defaults,
        formConfig.schema,
        formConfig.ignoreFields || []
      )
    })
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
    showConfirmDialog,
    hasUnsavedData,
    confirmLeave,
    cancelLeave,
  }
}
