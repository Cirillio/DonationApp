<script setup lang="ts">
import { Checkbox } from '../checkbox'
import { computed } from 'vue'

const props = defineProps({
  label: String,
  desc: String,
  icon: String,
  modelValue: {
    type: Boolean,
    default: undefined, // Чтобы можно было отличить "не передан" от false
  },
  checked: {
    type: Boolean,
    default: false,
  },
  showCheckbox: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: boolean): void
  (e: 'onCheck', value: boolean): void
}>()

const check = computed({
  get: () => props.modelValue ?? props.checked,
  set: (value) => {
    emits('update:modelValue', value)
    emits('onCheck', value)
  },
})
</script>

<template>
  <Button
    @click="check = !check"
    class="group gap-2"
    :variant="check ? 'secondary' : 'outline'"
    type="button"
  >
    <span v-if="icon" class="iconify size-5 md:size-6" :class="[icon]"></span>

    <div v-if="label || desc" class="flex flex-col text-start flex-1">
      <span class="">{{ label }}</span>
      <span class="max-sm:text-sm text-muted-foreground">{{ desc }}</span>
    </div>

    <slot name="content"></slot>

    <Checkbox
      v-if="showCheckbox"
      :model-value="check"
      class="cursor-pointer group-hover:bg-card size-6 border-border rounded-[var(--radius)] transition-all bg-none ml-auto"
    />
  </Button>
</template>
