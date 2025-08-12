<script lang="ts" setup>
import { BlankForm, PayForm } from '@/components/forms'
import DonateControls from '@/components/controls/DonateControls.vue'
import { formSteps } from '@/data/donation/steps.data'
import { useStepperStore } from '@/app/stepper.store'

const stepper = useStepperStore()
stepper.initStepper({ steps: formSteps })
</script>

<template>
  <div class="flex md:x-pad max-md:h-full h-fit w-full justify-center items-center">
    <div
      class="md:max-w-[648px] w-full h-full max-md:flex justify-center items-center px-4 md:px-14 py-16 md:shadow-xs md:border bg-background/80 dark:bg-background/60 md:rounded-md backdrop-blur-lg"
    >
      <div class="flex gap-4 md:gap-8 flex-col">
        <BlankForm v-if="stepper.currentStep === 0" />
        <PayForm v-if="stepper.currentStep === 1" />
        <div class="flex flex-col w-full">
          <div class="w-full h-2 md:h-3 rounded-full bg-ring/25">
            <div
              class="h-full bg-primary ring ring-primary rounded-full transition-all duration-150"
              :style="{ width: `${stepper.completedRatio * 100}%` }"
            />
          </div>
        </div>

        <DonateControls />
      </div>
    </div>
  </div>
</template>
