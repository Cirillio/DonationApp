<script setup lang="ts">
import { ref,  watch } from 'vue'


interface Props {
  modelValue?: Date | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'ДД.ММ.ГГГГ'
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'input': [event: Event]
  'focus': [event: FocusEvent]
}>()

const day = ref<string>('')
const month = ref<string>('')
const year = ref<string>('')


watch(() => props.modelValue, (newDate) => {
  if (newDate instanceof Date && !isNaN(newDate.getTime())) {
    day.value = String(newDate.getDate()).padStart(2, '0')
    month.value = String(newDate.getMonth() + 1).padStart(2, '0')
    year.value = String(newDate.getFullYear())
  } else {
    day.value = ''
    month.value = ''
    year.value = ''
  }
}, { immediate: true })

const createDate = () => {
  const d = parseInt(day.value)
  const m = parseInt(month.value)
  const y = parseInt(year.value)

  if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900) {
    emit('update:modelValue', null)
    return
  }

  const date = new Date(y, m - 1, d)

  if (date.getDate() !== d || date.getMonth() !== m - 1 || date.getFullYear() !== y) {
    emit('update:modelValue', null)
    return
  }

  emit('update:modelValue', date)
}

const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}

const handleDayInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  if (value.length > 2) value = value.slice(0, 2)
  if (parseInt(value) > 31) value = '31'

  day.value = value

  if (value.length === 2) {
    const monthInput = input.parentElement?.querySelector('[data-month]') as HTMLInputElement
    monthInput?.focus()
  }

  createDate()
  emit('input', e)
}

const handleMonthInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  if (value.length > 2) value = value.slice(0, 2)
  if (parseInt(value) > 12) value = '12'

  month.value = value

  if (value.length === 2) {
    const yearInput = input.parentElement?.querySelector('[data-year]') as HTMLInputElement
    yearInput?.focus()
  }

  createDate()
  emit('input', e)
}

const handleYearInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  if (value.length > 4) value = value.slice(0, 4)

  year.value = value
  createDate()
  emit('input', e)
}

</script>

<template>
    <div class="grid h-fit w-full grid-cols-[auto_1fr_auto_1fr_auto_2fr] items-center rounded-md border border-border bg-card px-3 py-2 text-base shadow-xs transition-all duration-150 ease-in-out outline-none [&[aria-invalid=true]]:border-destructive [&[aria-invalid=true]]:bg-destructive/10 [&[aria-invalid=true]]:ring-destructive [&[aria-invalid=true]]:hover:border-destructive dark:[&[aria-invalid=true]]:ring-destructive/40">
      <input
        :value="day"
        @input="handleDayInput"
        @focus="handleFocus"
        type="text"
        inputmode="numeric"
        placeholder="ДД"
        class="min-w-0 w-full text-center bg-transparent outline-none placeholder:text-muted-foreground"
        maxlength="2"
      />
      <span class="text-center text-muted-foreground">.</span>
      <input
        :value="month"
        @input="handleMonthInput"
        @focus="handleFocus"
        type="text"
        inputmode="numeric"
        placeholder="ММ"
        data-month
        class="min-w-0 w-full text-center bg-transparent outline-none placeholder:text-muted-foreground"
        maxlength="2"
      />
      <span class="text-center text-muted-foreground">.</span>
      <input
        :value="year"
        @input="handleYearInput"
        @focus="handleFocus"
        type="text"
        inputmode="numeric"
        placeholder="ГГГГ"
        data-year
        class="min-w-0 w-full text-center bg-transparent outline-none placeholder:text-muted-foreground"
        maxlength="4"
      />
    </div>
</template>
