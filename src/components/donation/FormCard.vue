<script lang="ts" setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const props = defineProps<{
  title?: string
  description?: string
  currentStep?: number
  totalSteps?: number
  stepsValidity?: Record<number, boolean>
}>()

const completedStepsCount = computed(() => {
  if (!props.stepsValidity) return 0
  return Object.entries(props.stepsValidity).filter(([_, isValid]) => isValid).length
})

const progressPercentage = computed(() => {
  if (!props.totalSteps) return 0
  return (completedStepsCount.value / props.totalSteps) * 100
})
</script>

<template>
  <Card
    class="flex flex-col w-full rounded-xl gap-10 light:bg-background shadow-xs max-md:!bg-transparent"
  >
    <CardHeader
      v-if="description || title"
      class="flex gap-2 md:gap-3 items-center max-md:flex-col max-md:justify-center"
    >
      <div class="max-md:text-center">
        <CardTitle class="text-2xl max-sm:text-xl md:w-full">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="max-sm:text-base text-lg">
          {{ description }}
        </CardDescription>
      </div>
    </CardHeader>

    <CardContent class="flex flex-col gap-6">
      <slot />
    </CardContent>
    <slot name="footer"> </slot>
  </Card>
</template>
