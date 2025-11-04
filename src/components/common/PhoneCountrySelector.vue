<script setup lang="ts">
import { computed } from 'vue'
import type { PhoneSpec } from '@/lib/types'
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
  'update:modelValue': [value: string]
}>()

const selectedSpec = computed(() => {
  return props.specs.find(spec => spec.id === props.modelValue) || props.specs[0]
})

const onCountryChange = (countryId: string) => {
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
      class="duration-150 md:-translate-x-2 shadow-muted dark:shadow-black/50 shadow-md bg-card gap-1.5 p-1 ease-in-out flex flex-col min-w-[220px] max-sm:!w-[calc(100dvw-2rem)]"
    >
      <DropdownMenuItem
        v-for="spec in props.specs"
        :key="spec.id"
        @select="onCountryChange(spec.id)"
        class="p-0 !bg-transparent"
      >
        <button
          :class="[selectedSpec?.code === spec.code ? '!text-primary' : 'opacity-85 hover:opacity-100']"
          class="w-full rounded-sm cursor-pointer hover:!bg-border/50 active:!bg-border/50 dark:hover:!bg-muted/50 dark:active:!bg-muted/50 transition-all duration-150 ease-in-out text-base justify-start gap-3 md:gap-2 px-2 py-1.5 h-auto flex items-center"
        >
          <Badge
            :variant="selectedSpec?.code === spec.code ? 'outline-primary' : 'outline'"
            class="font-mono font-semibold min-w-[3.5rem] h-7 md:h-5 justify-center max-md:text-base"
          >
            {{ spec.code }}
          </Badge>
          <span class="max-md:text-lg">{{ spec.name }}</span>
        </button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

