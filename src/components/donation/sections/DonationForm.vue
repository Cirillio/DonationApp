<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, watch } from "vue";
import { useDonationStore } from "@/stores/donation";
import { storeToRefs } from "pinia";
import { useTemplateRef } from "vue";
import { useScrollToElement } from "@/composables/useScrollToElement";
import DonateStepper from "../DonateStepper.vue";
import FormCard from "../FormCard.vue";
import { BlankForm, PaymentForm, ResultForm } from "../forms";
import { useRoute } from "vue-router";

const donationStore = useDonationStore();
const { isCurrentStep, nextStep, prevStep } = donationStore;
const { currentStep, stepsValidity, transitionDirection, isInitialLoad } = storeToRefs(
  donationStore
);

const goToPayment = () => {
  if (donationStore.validateForm("blank")) {
    nextStep();
  }
};

const route = useRoute();

const submit = () => {
  if (!donationStore.validateForm("payment")) {
    return;
  }

  donationStore.finish();

  setTimeout(() => {
    donationStore.setPaymentResult({
      success: true,
      paymentId: "PMT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    });
  }, 2000);
};

onUnmounted(() => donationStore.resetForm());

const transitionName = computed(() => {
  if (isInitialLoad.value) {
    return "fade";
  }
  return transitionDirection.value === "forward" ? "slide-left" : "slide-right";
});

const formCard = useTemplateRef<HTMLElement>("formRefEl");
const { scrollTo } = useScrollToElement({
  behavior: "smooth",
  mobileBreakpoint: 768,
  mobileOffset: 100,
});

watch(currentStep, () => {
  nextTick(() => {
    if (formCard.value) {
      scrollTo(formCard.value);
    }
  });
});

let scrollTimeout: NodeJS.Timeout | null = null;

onMounted(() => {
  scrollTimeout = setTimeout(() => {
    if (route.query.telegramApp === "true") {
      scrollTo(formCard.value);
    }
  }, 50);
});
onBeforeUnmount(() => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<template>
  <section class="flex flex-col gap-24 z-30 w-full">
    <!-- Single Form Card -->
    <div ref="formRefEl" class="w-full mx-auto">
      <FormCard
        :current-step="currentStep"
        :total-steps="stepsValidity ? Object.keys(stepsValidity).length : undefined"
        :steps-validity="stepsValidity"
        class="w-full"
      >
        <template #left>
          <CardHeader
            class="flex gap-2 md:gap-1 max-md:my-4 p-0 flex-col max-md:*:text-center max-lg:justify-center"
          >
            <CardTitle class="text-4xl max-sm:text-3xl w-full"
              >Форма пожертвования</CardTitle
            >
            <CardDescription class="max-sm:text-base text-xl w-full">
              Заполните обязательные поля
            </CardDescription>
          </CardHeader>
          <!-- Desktop Stepper -->

          <div
            class="flex mt-12 max-lg:mb-12 max-md:hidden w-full h-full items-start justify-start"
          >
            <DonateStepper :orientation="'vertical'" />
          </div>
        </template>

        <template #right>
          <Transition :name="transitionName" mode="out-in">
            <BlankForm v-if="isCurrentStep('blank')" key="blank" />
            <PaymentForm v-else-if="isCurrentStep('payment')" key="payment" />
            <ResultForm v-else-if="isCurrentStep('result')" key="result" />
          </Transition>
          <div class="lg:mt-auto mt-12">
            <Transition :name="transitionName" mode="out-in">
              <!-- Step 1: Blank - Continue button -->
              <Button
                v-if="isCurrentStep('blank')"
                key="blank-btn"
                @click="goToPayment"
                variant="accent"
                class="w-full py-3 md:py-2.5"
              >
                Перейти к оплате
              </Button>
              <!-- Step 2: Payment - Back + Submit buttons -->
              <div
                v-else-if="isCurrentStep('payment')"
                key="payment-btns"
                class="flex max-sm:flex-col-reverse w-full gap-2"
              >
                <Button
                  @click="prevStep"
                  variant="outline"
                  class="flex-1/3 max-sm:w-full py-3 md:py-2"
                >
                  Назад
                </Button>
                <Button
                  @click="submit"
                  class="flex-2/3 py-3 md:py-2 max-sm:w-full max-sm:text-lg hover:shadow-md hover:shadow-accent/35 transition-all"
                  variant="accent"
                >
                  Подтвердить и оплатить
                </Button>
              </div>
            </Transition>
          </div>
        </template>
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
