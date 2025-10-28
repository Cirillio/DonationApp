<script lang="ts" setup>
import { computed } from 'vue'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  title: string
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
    class="flex flex-col w-full rounded-md gap-6 border-0 !py-6 shadow-none sm:shadow-lg !bg-transparent sm:!bg-card"
  >
    <CardHeader
      class="flex gap-2 !px-4 sm:!px-6 md:gap-3 max-md:my-4 items-center max-md:flex-col max-md:justify-center"
    >
      <div class="max-md:text-center">
        <CardTitle class="text-2xl max-sm:text-3xl md:w-full">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="max-sm:text-lg">
          {{ description }}
        </CardDescription>
      </div>
    </CardHeader>

    <!-- Mobile Progress Bar -->
    <div v-if="currentStep && totalSteps" class="md:hidden w-full px-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-muted-foreground">
          Шаг {{ currentStep }} из {{ totalSteps }}
        </span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-500 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
    </div>

    <Separator class="bg-foreground/50" />

    <CardContent class="!px-4 sm:!px-6">
      <slot name="content" />
    </CardContent>

    <CardFooter class="text-xs !px-4 sm:!px-6 sm:text-base text-pretty">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
