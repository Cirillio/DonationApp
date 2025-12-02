<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import { useScrollToElement } from '@/composables/useScrollToElement'
import DonateStepper from '../DonateStepper.vue'
import FormCard from '../FormCard.vue'
import { BlankForm, PaymentForm, ResultForm } from '../forms'
import { useRoute } from 'vue-router'
import ConfirmationForm from '../forms/ConfirmationForm.vue'

const donationStore = useDonationStore()
const { isCurrentStep, nextStep, prevStep } = donationStore
const { currentStep, stepsValidity, transitionDirection, isInitialLoad } =
  storeToRefs(donationStore)

const goToPayment = () => {
  if (donationStore.validateForm('blank')) {
    nextStep()
  }
}

const goToConfirmation = () => {
  if (donationStore.validateForm('payment')) {
    nextStep()
  }
}

const route = useRoute()

const submit = () => {
  if (!donationStore.validateForm('payment')) {
    return
  }

  donationStore.confirmForm()
  donationStore.nextStep()

  setTimeout(() => {
    donationStore.setPaymentResult({
      success: true,
      paymentId: 'PMT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    })
  }, 2000)
}

onUnmounted(() => donationStore.resetForm())

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
    <!-- Single Form Card -->
    <div ref="formRefEl" class="w-full mx-auto">
      <FormCard
        :title="'Форма пожертвования'"
        :current-step="currentStep"
        :total-steps="stepsValidity ? Object.keys(stepsValidity).length : undefined"
        :steps-validity="stepsValidity"
        class="w-full"
      >
        <div class="">
          <Transition :name="transitionName" mode="out-in">
            <BlankForm v-if="isCurrentStep('blank')" key="blank" />
            <PaymentForm v-else-if="isCurrentStep('payment')" key="payment" />
            <ConfirmationForm v-else-if="isCurrentStep('confirm')" key="confirm" />
            <ResultForm v-else-if="isCurrentStep('result')" key="result" />
          </Transition>
        </div>
        <div class="">
          <Transition :name="transitionName" mode="out-in">
            <!-- Step 1: Blank - Continue button -->
            <Button
              v-if="isCurrentStep('blank')"
              key="blank-btn"
              @click="goToPayment"
              class="w-full"
            >
              Перейти к оплате
            </Button>
            <!-- Step 2: Payment - Back + Continue buttons -->
            <div
              v-else-if="isCurrentStep('payment')"
              key="payment-btns"
              class="flex max-sm:flex-col-reverse w-full gap-2"
            >
              <Button @click="prevStep" variant="soft" class="flex-1/3 max-sm:w-full py-3 md:py-2">
                Назад
              </Button>
              <Button
                @click="goToConfirmation"
                class="flex-2/3 py-3 md:py-2 max-sm:w-full max-sm:text-lg"
              >
                Продолжить
              </Button>
            </div>
            <!-- Step 3: Confirmation - Back + Submit buttons -->
            <div
              v-else-if="isCurrentStep('confirm')"
              key="confirm-btns"
              class="flex max-sm:flex-col-reverse w-full gap-2"
            >
              <Button @click="prevStep" variant="soft" class="flex-1/3 max-sm:w-full py-3 md:py-2">
                Назад
              </Button>
              <Button
                @click="submit"
                class="flex-2/3 py-3 md:py-2 max-sm:w-full max-sm:text-lg hover:shadow-md hover:shadow-accent/35 transition-all"
              >
                Подтвердить и оплатить
              </Button>
            </div>
          </Transition>
        </div>
        <template #footer> </template>
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
