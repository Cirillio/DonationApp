<script lang="ts" setup>
import { computed } from "vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const props = defineProps<{
  title?: string;
  description?: string;
  currentStep?: number;
  totalSteps?: number;
  stepsValidity?: Record<number, boolean>;
}>();

const completedStepsCount = computed(() => {
  if (!props.stepsValidity) return 0;
  return Object.entries(props.stepsValidity).filter(([_, isValid]) => isValid).length;
});

const progressPercentage = computed(() => {
  if (!props.totalSteps) return 0;
  return (completedStepsCount.value / props.totalSteps) * 100;
});
</script>

<template>
  <Card
    class="flex flex-col w-full rounded-xl gap-10 py-12 light:bg-background max-md:!bg-transparent"
  >
    <CardHeader
      v-if="description || title"
      class="flex gap-2 !px-4 sm:!px-12 md:gap-3 max-md:my-4 items-center max-md:flex-col max-md:justify-center"
    >
      <div class="max-md:text-center">
        <CardTitle class="text-4xl max-sm:text-3xl md:w-full">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="max-sm:text-base text-lg">
          {{ description }}
        </CardDescription>
      </div>
    </CardHeader>

    <CardContent class="!px-4 sm:!px-12 flex flex-col lg:flex-row gap-6">
      <div class="flex-1/2 flex flex-col">
        <slot name="left" />
      </div>
      <div v-if="currentStep && totalSteps" class="md:hidden w-full">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm text-muted-foreground">
            Шаг {{ currentStep }} из {{ totalSteps }}
          </span>
        </div>

        <div class="w-full rounded-full h-2 bg-primary/25 overflow-hidden">
          <div
            class="h-full bg-primary transition-all duration-500 ease-out"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>
      <div class="flex-1/2 flex flex-col">
        <slot name="right" />
      </div>
    </CardContent>
    <slot name="footer"> </slot>
  </Card>
</template>
