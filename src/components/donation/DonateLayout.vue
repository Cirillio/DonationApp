<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue'
import { PAYMENT_AMOUNTS_MIN } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import { useScrollToElement } from '@/composables/useScrollToElement'
import DonateStepper from './DonateStepper.vue'
import FormCard from './FormCard.vue'
import { BlankForm, PaymentForm, ResultForm } from './forms'
import { useRoute } from 'vue-router'

const donationStore = useDonationStore()
const { isCurrentStep, nextStep, prevStep } = donationStore
const { currentStep, stepsValidity, transitionDirection, isInitialLoad } =
  storeToRefs(donationStore)

const goToPayment = () => {
  if (donationStore.validateForm('blank')) {
    nextStep()
  }
}

const route = useRoute()

const submit = () => {
  if (!donationStore.validateForm('payment')) {
    return
  }

  donationStore.finish()

  setTimeout(() => {
    donationStore.setPaymentResult({
      success: true,
      paymentId: 'PMT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    })
  }, 2000)
}

onUnmounted(() => donationStore.resetForm())

const cardTitle = computed(() => {
  if (isCurrentStep('blank')) return 'Анкета'
  if (isCurrentStep('payment')) return 'Оплата'
  if (isCurrentStep('result')) return 'Готово!'
  return ''
})

const cardDescription = computed(() => {
  if (isCurrentStep('blank')) return 'Заполните обязательные поля'
  if (isCurrentStep('payment')) return `Минимальная сумма: ${PAYMENT_AMOUNTS_MIN.label}Р`
  if (isCurrentStep('result')) return 'Ваше пожертвование успешно обработано'
  return ''
})

const transitionName = computed(() => {
  if (isInitialLoad.value) {
    return 'fade'
  }
  return transitionDirection.value === 'forward' ? 'slide-left' : 'slide-right'
})

const formCard = useTemplateRef<HTMLElement>('formRefEl')
const { scrollTo } = useScrollToElement({
  behavior: 'smooth',
  mobileBreakpoint: 768,
  mobileOffset: 100,
})

watch(currentStep, () => {
  nextTick(() => {
    if (formCard.value) {
      scrollTo(formCard.value)
    }
  })
})

let scrollTimeout: NodeJS.Timeout | null = null

onMounted(() => {
  scrollTimeout = setTimeout(() => {
    if (route.query.telegramApp === 'true') {
      scrollTo(formCard.value)
    }
  }, 50)
})
onBeforeUnmount(() => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<template>
  <section class="flex flex-col gap-24 z-30 w-full">
    <!-- Desktop Stepper -->
    <DonateStepper />

    <!-- Single Form Card -->
    <div ref="formRefEl" class="sm:max-w-xl w-full mx-auto">
      <FormCard
        :title="cardTitle"
        :description="cardDescription"
        :current-step="currentStep"
        :total-steps="3"
        :steps-validity="stepsValidity"
        class="w-full hover:shadow-black/15 hover:shadow-lg dark:hover:shadow-black/25 border-0 transition-shadow shadow-md"
      >
        <template #content>
          <Transition :name="transitionName" mode="out-in">
            <BlankForm v-if="isCurrentStep('blank')" key="blank" />
            <PaymentForm v-else-if="isCurrentStep('payment')" key="payment" />
            <ResultForm v-else-if="isCurrentStep('result')" key="result" />
          </Transition>
        </template>

        <template #footer>
          <Transition :name="transitionName" mode="out-in">
            <!-- Step 1: Blank - Continue button -->
            <Button
              v-if="isCurrentStep('blank')"
              key="blank-btn"
              @click="goToPayment"
              class="w-full py-2"
            >
              Продолжить
            </Button>

            <!-- Step 2: Payment - Back + Submit buttons -->
            <div
              v-else-if="isCurrentStep('payment')"
              key="payment-btns"
              class="flex max-sm:flex-col-reverse w-full gap-2"
            >
              <Button @click="prevStep" variant="secondary" class="flex-1/3 max-sm:w-full py-2">
                Назад
              </Button>

              <Button
                @click="submit"
                class="flex-2/3 py-2 max-sm:w-full max-sm:text-lg shadow-md shadow-accent/15 hover:shadow-accent/35 transition-all"
                variant="accent"
              >
                Пожертвовать
              </Button>
            </div>
          </Transition>
        </template>
      </FormCard>
    </div>
  </section>
</template>

<style scoped>
/* Forward transition: slide from right to left */
.slide-left-enter-active {
  transition: all 0.15s ease-out;
}

.slide-left-leave-active {
  transition: all 0.1s ease-in;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Backward transition: slide from left to right */
.slide-right-enter-active {
  transition: all 0.15s ease-out;
}

.slide-right-leave-active {
  transition: all 0.1s ease-in;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

/* Fade for initial load */
.fade-enter-active {
  transition: opacity 0.3s ease-out;
}

.fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
</style>
