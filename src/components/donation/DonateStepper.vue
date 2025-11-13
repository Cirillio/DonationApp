<script lang="ts" setup>
import { computed } from "vue";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { DONATE_STEPS } from "@/lib/constants";

import { useDonationStore } from "@/stores/donation";
import { storeToRefs } from "pinia";

interface Props {
  orientation?: "horizontal" | "vertical";
  inverted?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
  inverted: false,
});

const donationStore = useDonationStore();
const { currentStep, stepsValidity } = storeToRefs(donationStore);

const isHorizontal = computed(() => props.orientation === "horizontal");
</script>

<template>
  <!-- Desktop Stepper -->
  <div
    class="max-md:hidden grid min-h-full transition-all"
    :class="isHorizontal ? 'grid-cols-4 gap-8' : 'grid-rows-4 gap-12'"
  >
    <template v-for="(step, _) in DONATE_STEPS" :key="step.step">
      <Stepper v-model="currentStep" class="contents" :orientation="orientation">
        <StepperItem
          v-slot="{ state }"
          :step="step.step"
          class="relative flex items-center"
        >
          <StepperTrigger
            as-child
            disabled
            class="disabled:opacity-100"
            :class="[
              state === 'completed' && 'bg-primary border-primary',
              state === 'active' &&
                !stepsValidity[currentStep] &&
                'bg-card border-primary',
              state === 'active' &&
                stepsValidity[currentStep] &&
                'bg-primary border-primary',
            ]"
          >
            <Button
              :variant="
                state === 'completed' || state === 'active' ? 'default' : 'outline'
              "
              class="shrink-0 rounded-full size-16 pointer-events-none cursor-default transition-all"
            >
              <StepperIndicator
                class="flex items-center justify-center !bg-transparent border-0 ring-0"
              >
                <span
                  v-if="state === 'completed'"
                  class="size-14 text-primary-foreground iconify f7--checkmark-alt"
                />
                <span
                  v-else
                  class="iconify size-14 transition-colors"
                  :class="[
                    step.icon,
                    state === 'active' && stepsValidity[currentStep]
                      ? 'text-primary-foreground'
                      : '',
                    state === 'active' && !stepsValidity[currentStep]
                      ? 'text-primary'
                      : '',
                  ]"
                />
              </StepperIndicator>
            </Button>
          </StepperTrigger>
          <StepperTitle
            class="absolute transition-colors whitespace-nowrap"
            :class="[
              state === 'completed' || state === 'active'
                ? '*:text-foreground'
                : 'text-muted-foreground',
              isHorizontal
                ? props.inverted
                  ? 'bottom-full mb-2 left-1/2 -translate-x-1/2 text-center'
                  : 'top-full mt-2 left-1/2 -translate-x-1/2 text-center'
                : props.inverted
                ? 'right-full mr-4 top-1/2 -translate-y-1/2 text-end'
                : 'left-full ml-4 top-1/2 -translate-y-1/2 text-start',
            ]"
          >
            <p class="text-xl font-semibold">{{ step.title }}</p>
            <p
              v-if="orientation !== 'horizontal'"
              class="text-base text-muted-foreground/75 font-medium"
            >
              {{ step.desc }}
            </p>
          </StepperTitle>
        </StepperItem>
      </Stepper>
    </template>
  </div>
</template>
