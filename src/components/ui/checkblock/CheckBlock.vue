<script setup lang="ts">
import { Checkbox } from '../checkbox'
import { computed } from 'vue'

const props = defineProps({
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
    :variant="check ? 'outline-primary' : 'outline'"
    type="button"
  >
    <slot name="content"></slot>

    <Checkbox
      v-if="showCheckbox"
      :model-value="check"
      class="cursor-pointer border-0 ring group-hover:bg-card size-6 rounded-[var(--radius)] transition-all bg-none ml-auto"
      :class="[check ? 'ring-primary' : 'ring-border']"
    />
  </Button>
</template>
