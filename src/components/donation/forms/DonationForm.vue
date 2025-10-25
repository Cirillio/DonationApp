<script lang="ts" setup>
/**
 * DonationForm - Main donation wizard component
 *
 * Orchestrates the 3-step donation process:
 * 1. Анкета (Personal info) - DonationBlank
 * 2. Оплата (Payment) - DonationPay
 * 3. Результат (Result) - DonationResult
 *
 * Features:
 * - Visual stepper showing progress
 * - Validation-gated navigation (can't proceed with invalid form)
 * - Responsive layout with proper back/forward navigation
 * - Lifecycle management (no cleanup needed - forms handle themselves)
 */
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import FormCard from '@/components/donation/forms/FormCard.vue'
import DonationBlank from '../views/DonationBlank.vue'
import DonationPay from '../views/DonationPay.vue'
import DonationResult from '../views/DonationResult.vue'
import { PAYMENT_AMOUNTS_MIN } from '@/lib/constants'
import { DONATE_STEPS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'

const donationStore = useDonationStore()
const { isCurrentStep, nextStep, prevStep } = donationStore
const { currentStep, stepsValidity } = storeToRefs(donationStore)

/**
 * Submit payment and process donation
 *
 * In production: This would make API call to payment provider
 * Current behavior: Simulates async payment processing with 2s delay
 *
 * Flow:
 * 1. Call finish() to move to result step immediately
 * 2. Show loading state while "processing"
 * 3. Set payment result after delay to show success/failure
 *
 * TODO: Replace setTimeout with actual payment API integration
 */
const submit = async () => {
  // Go to result step immediately (without payment result)
  donationStore.finish()

  // Simulate payment processing with backend
  // In real app, this would be API call
  setTimeout(() => {
    // Simulate successful payment response from backend
    donationStore.setPaymentResult({
      success: true,
      paymentId: 'PMT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    })
  }, 2000)
}
</script>

<template>
  <section class="flex flex-col gap-24 z-30 w-full">
    <!-- Stepper -->
    <div class="flex w-full px-12 items-center justify-center gap-4">
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
                  'bg-transparent border-primary border-0 ring ring-primary shadow-sm',
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

        <!-- Separator between DONATE_STEPS -->
        <div
          v-if="index < DONATE_STEPS.length - 1"
          class="h-[2px] w-full max-w-32 rounded-full bg-muted transition-all"
          :class="currentStep > step.step && 'bg-primary'"
        />
      </template>
    </div>

    <!-- Form Content -->
    <div class="max-w-xl w-full mx-auto">
      <!-- Step 1: Анкета -->
      <FormCard
        v-if="isCurrentStep('blank')"
        title="Анкета"
        description="Заполните обязательные поля"
        class="w-full"
      >
        <template v-slot:content>
          <DonationBlank />
        </template>
        <template v-slot:footer>
          <Button @click="nextStep" :disabled="!stepsValidity[1]" class="w-full py-2">
            Продолжить
          </Button>
        </template>
      </FormCard>

      <!-- Step 2: Оплата -->
      <FormCard
        v-if="isCurrentStep('payment')"
        title="Оплата"
        :description="`Минимальная сумма: ${PAYMENT_AMOUNTS_MIN.label}Р`"
        class="w-full"
      >
        <template v-slot:content>
          <DonationPay />
        </template>
        <template v-slot:footer>
          <div class="flex max-sm:flex-col-reverse w-full gap-2">
            <Button @click="prevStep" variant="secondary" class="flex-1/3 max-sm:w-full py-2">
              Назад
            </Button>

            <Button
              @click="submit"
              :disabled="!stepsValidity[2]"
              class="flex-2/3 py-2 max-sm:w-full max-sm:text-lg shadow-md shadow-accent/15 hover:shadow-accent/35 transition-all"
              variant="accent"
            >
              Пожертвовать
            </Button>
          </div>
        </template>
      </FormCard>

      <!-- Step 3: Результат -->
      <FormCard
        v-if="isCurrentStep('result')"
        title="Готово!"
        description="Ваше пожертвование успешно обработано"
        class="w-full"
      >
        <template #content>
          <DonationResult />
        </template>
      </FormCard>
    </div>
  </section>
</template>
