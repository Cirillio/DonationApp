<script setup lang="ts">
import { computed } from 'vue'
import type { PhoneSpec, PhoneSpecId } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  modelValue?: string
  specs: readonly PhoneSpec[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: PhoneSpecId]
}>()

const selectedSpec = computed(() => {
  return props.specs.find(spec => spec.id === props.modelValue) || props.specs[0]
})

const onCountryChange = (countryId: PhoneSpecId) => {
  emit('update:modelValue', countryId)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" :selectedSpec="selectedSpec" :disabled="props.disabled">
        <!-- Default fallback if no slot provided -->

        <button>{{ selectedSpec.code }}</button>
      </slot>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="start"
      class="duration-150 border-0 shadow-sm hover:shadow-lg rounded-md bg-popover transition-all gap-1.5 p-1 ease-in-out flex flex-col min-w-[220px] max-sm:!w-[calc(100dvw-2rem)]"
    >
      <DropdownMenuItem
        v-for="spec in props.specs"
        :key="spec.id"
        @select="onCountryChange(spec.id)"
        class="p-0 !bg-transparent"
      >
        <button
          :class="[
            selectedSpec?.code === spec.code ? '!text-primary' : 'opacity-85 hover:opacity-100',
          ]"
          class="rounded-sm w-full cursor-pointer hover:bg-muted/15 dark:hover:bg-card/50 transition-all duration-150 ease-in-out text-lg justify-start gap-3 md:gap-2 px-2 py-1 h-auto flex items-center"
        >
          <span class="font-medium mr-auto">{{ spec.name }}</span>

          <span>
            {{ spec.code }}
          </span>
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
