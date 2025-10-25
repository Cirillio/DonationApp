<script lang="ts" setup>
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { DONATE_STEPS } from '@/lib/constants'

import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'

const donationStore = useDonationStore()
const { currentStep, stepsValidity } = storeToRefs(donationStore)
</script>

<template>
  <!-- Desktop Stepper -->
  <div class="max-md:hidden flex w-full px-12 items-center justify-center gap-4">
    <template v-for="(step, index) in DONATE_STEPS" :key="step.step">
      <Stepper v-model="currentStep" class="contents" :orientation="'horizontal'">
        <StepperItem v-slot="{ state }" :step="step.step" class="relative flex items-center">
          <StepperTrigger
            as-child
            disabled
            class="disabled:opacity-100"
            :class="[
              state === 'completed' && 'bg-primary border-primary shadow-md',
              state === 'active' &&
                !stepsValidity[currentStep] &&
                'bg-card border-primary  shadow-sm',
              state === 'active' &&
                stepsValidity[currentStep] &&
                'bg-primary border-primary shadow-md',
            ]"
          >
            <Button
              :variant="state === 'completed' || state === 'active' ? 'outline' : 'outline'"
              class="shrink-0 rounded-full size-14 pointer-events-none cursor-default transition-all"
            >
              <StepperIndicator
                class="flex items-center justify-center !bg-transparent border-0 ring-0"
              >
                <span
                  v-if="state === 'completed'"
                  class="size-7 text-primary-foreground iconify f7--checkmark-alt"
                />
                <span
                  v-else
                  class="iconify size-7 transition-colors"
                  :class="[
                    step.icon,
                    state === 'active' && stepsValidity[currentStep]
                      ? 'text-primary-foreground'
                      : '',
                    state === 'active' && !stepsValidity[currentStep] ? 'text-primary' : '',
                  ]"
                />
              </StepperIndicator>
            </Button>
          </StepperTrigger>

          <StepperTitle
            class="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-sm font-semibold transition-colors text-center whitespace-nowrap"
            :class="[
              state === 'completed' || state === 'active'
                ? 'text-foreground'
                : 'text-muted-foreground',
            ]"
          >
            {{ step.title }}
          </StepperTitle>
        </StepperItem>
      </Stepper>

      <div
        v-if="index < DONATE_STEPS.length - 1"
        class="h-[2px] w-full max-w-32 rounded-full bg-muted transition-all"
        :class="currentStep > step.step && 'bg-primary'"
      />
    </template>
  </div>
</template>
