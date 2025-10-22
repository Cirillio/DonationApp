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

const blankFormRef = ref<InstanceType<typeof DonationBlank>>()
const payFormRef = ref<InstanceType<typeof DonationPay>>()

const currentStep = ref(1)

const isStep1Valid = computed(() => blankFormRef.value?.isValid ?? false)
const isStep2Valid = computed(() => payFormRef.value?.isValid ?? false)
const isFormValid = computed(() => isStep1Valid.value && isStep2Valid.value)

const debugResults = ref()
const dialogOpen = ref(false)

const steps = [
  {
    step: 1,
    title: 'Анкета',
    description: 'Заполните обязательные поля',
  },
  {
    step: 2,
    title: 'Оплата',
    description: `Минимальная сумма: ${PAYMENT_AMOUNTS_MIN.label}Р`,
  },
]

const nextStep = () => {
  if (currentStep.value < steps.length && isStep1Valid.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submit = async () => {
  dialogOpen.value = true
  debugResults.value = 'donation sends successfully.'
}
</script>

<template>
  <section class="flex flex-col gap-24 z-30 w-full">
    <!-- Stepper -->
    <Stepper v-model="currentStep" class="flex w-full items-center" :orientation="'horizontal'">
      <StepperItem
        v-for="(step, index) in steps"
        :key="step.step"
        v-slot="{ state }"
        :step="step.step"
        class="relative flex w-full items-center justify-center"
      >
        <StepperSeparator
          v-if="index !== steps.length - 1"
          class="absolute right-[calc(-50%+20px)] top-5 block h-0.5 w-[calc(100%-40px)] shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
        />

        <StepperTrigger as-child>
          <Button
            :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
            size="icon"
            class="z-10 rounded-full shrink-0"
            :class="[
              'h-10 w-10',
              state === 'completed' && 'bg-primary hover:bg-primary',
              state === 'active' && 'border-primary',
            ]"
          >
            <StepperIndicator class="flex items-center justify-center">
              {{ step.step }}
            </StepperIndicator>
          </Button>
        </StepperTrigger>

        <div class="absolute top-12 flex flex-col items-center text-center">
          <StepperTitle
            :class="[
              'text-sm font-medium',
              state === 'completed' || state === 'active'
                ? 'text-foreground'
                : 'text-muted-foreground',
            ]"
          >
            {{ step.title }}
          </StepperTitle>
          <StepperDescription
            :class="[
              'sr-only text-xs text-muted-foreground md:not-sr-only',
              state === 'active' && 'text-foreground',
            ]"
          >
            {{ step.description }}
          </StepperDescription>
        </div>
      </StepperItem>
    </Stepper>

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
