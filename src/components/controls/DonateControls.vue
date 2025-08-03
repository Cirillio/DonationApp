<script lang="ts" setup>
import { useStepperStore } from '@/stores/stepper.store'

const stepper = useStepperStore()
</script>

<template>
  <div class="flex gap-4 justify-between">
    <Button
      size="lg"
      v-if="!stepper.isFirstStep"
      @click="stepper.prev"
      :disabled="!stepper.canGoPrev"
      variant="outline"
    >
      Назад
    </Button>
    <Button
      size="lg"
      class="w-full text-base"
      v-if="stepper.currentStep !== 1"
      @click="stepper.next"
      :disabled="!stepper.canGoNext"
    >
      К оплате
    </Button>
    <Button
      size="lg"
      class="flex-1 text-base"
      v-if="stepper.currentStep === 1"
      :disabled="!stepper.currentStepData?.completed"
    >
      Оплатить
    </Button>
  </div>
</template>
