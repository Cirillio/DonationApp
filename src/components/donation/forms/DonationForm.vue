<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import FormCard from '@/components/donation/forms/FormCard.vue'
import DonationBlank from '../views/DonationBlank.vue'
import DonationPay from '../views/DonationPay.vue'
import { PAYMENT_AMOUNTS_MIN } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'

const donationStore = useDonationStore()
const { currentStep } = storeToRefs(donationStore)

const blankFormRef = ref<InstanceType<typeof DonationBlank>>()
const payFormRef = ref<InstanceType<typeof DonationPay>>()

const isStep1Valid = computed(() => blankFormRef.value?.isValid ?? false)
const isStep2Valid = computed(() => payFormRef.value?.isValid ?? false)
const isFormValid = computed(() => isStep1Valid.value && isStep2Valid.value)

const debugResults = ref()
const dialogOpen = ref(false)

const steps = [
  {
    step: 1,
    title: 'Анкета',
    icon: 'f7--person',
  },
  {
    step: 2,
    title: 'Оплата',
    icon: 'f7--creditcard',
  },
]

const nextStep = () => {
  if (currentStep.value < steps.length && isStep1Valid.value) {
    donationStore.nextStep()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    donationStore.prevStep()
  }
}

const submit = async () => {
  dialogOpen.value = true
  debugResults.value = {
    blank: donationStore.blankForm,
    payment: donationStore.paymentForm,
  }
}
</script>

<template>
  <section class="flex flex-col gap-24 z-30 w-full">
    <!-- Stepper -->
    <div class="flex w-full px-12 items-center justify-center gap-4">
      <template v-for="(step, index) in steps" :key="step.step">
        <Stepper v-model="currentStep" class="contents" :orientation="'horizontal'">
          <StepperItem v-slot="{ state }" :step="step.step" class="relative flex items-center">
            <StepperTrigger as-child disabled class="disabled:opacity-100">
              <Button
                :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                class="shrink-0 rounded-full size-14 pointer-events-none cursor-default transition-all"
                :class="[
                  state === 'completed' && 'bg-primary shadow-md',
                  state === 'active' && 'border-primary border-2 shadow-sm',
                ]"
              >
                <StepperIndicator
                  class="flex items-center justify-center !bg-transparent border-0 ring-0"
                >
                  <span
                    v-if="state === 'completed'"
                    class="size-7 text-primary-foreground iconify f7--checkmark-alt"
                  />
                  <span v-else class="iconify size-7" :class="step.icon" />
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

        <!-- Separator between steps -->
        <div
          v-if="index < steps.length - 1"
          class="h-[2px] w-full max-w-32 rounded-full bg-muted transition-all"
          :class="currentStep > step.step && 'bg-primary'"
        />
      </template>
    </div>

    <!-- Form Content -->
    <div class="max-w-xl w-full mx-auto">
      <!-- Step 1: Анкета -->
      <FormCard
        v-if="currentStep === 1"
        title="Анкета"
        description="Заполните обязательные поля"
        class="w-full"
      >
        <template v-slot:content>
          <DonationBlank ref="blankFormRef" />
        </template>
        <template v-slot:footer>
          <Button @click="nextStep" :disabled="!isStep1Valid" class="w-full py-2">
            Продолжить
          </Button>
        </template>
      </FormCard>

      <!-- Step 2: Оплата -->
      <FormCard
        v-if="currentStep === 2"
        title="Оплата"
        :description="`Минимальная сумма: ${PAYMENT_AMOUNTS_MIN.label}Р`"
        class="w-full"
      >
        <template v-slot:content>
          <DonationPay ref="payFormRef" />
        </template>
        <template v-slot:footer>
          <div class="flex w-full gap-2">
            <Button @click="prevStep" variant="secondary" class="flex-1/3 py-2"> Назад </Button>

            <Dialog
              :open="dialogOpen"
              @update:open="
                (v) => {
                  if (!v) {
                    dialogOpen = v
                  } else {
                    debugResults = undefined
                  }
                }
              "
            >
              <Button
                @click="submit"
                :disabled="!isStep2Valid"
                class="flex-2/3 py-2 shadow-md shadow-primary/15 hover:shadow-primary/35 transition-all hover:shadow-lg"
                variant="default"
              >
                Пожертвовать
              </Button>

              <DialogContent
                class="text-foreground flex flex-col border-border max-h-[80vh] light:border-transparent"
              >
                <DialogTitle>donation form debug dialog</DialogTitle>
                <DialogDescription>shows final values to submit to backend</DialogDescription>
                <div class="flex overflow-scroll min-h-full flex-1 h-2/3 max-md:text-xs">
                  <pre>{{ debugResults }}</pre>
                </div>
                <DialogClose>
                  <Button>Закрыть</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </template>
      </FormCard>
    </div>
  </section>
</template>
