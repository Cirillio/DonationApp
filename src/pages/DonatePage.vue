<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import DonateLayout from '@/components/donation/DonateLayout.vue'
import LeaveConfirm from '@/components/common/LeaveConfirm.vue'
import { useDonationStore } from '@/stores/donation'
import { usePageLeaveConfirmation } from '@/composables/usePageLeaveConfirm'
import Icon from '@/components/ui/icon/Icon.vue'
import { useStructuredData, getDonateActionStructuredData } from '@/composables/useStructuredData'

const route = useRoute()
const donationStore = useDonationStore()
const { hasUnsavedData } = storeToRefs(donationStore)

const { showConfirmDialog, confirmLeave, cancelLeave } = usePageLeaveConfirmation({
  hasUnsavedData,
  onConfirm: () => donationStore.resetForm(),
})

useStructuredData(getDonateActionStructuredData())

onMounted(() => {
  const paymentToken = route.query['payment-token'] as string | null
  donationStore.checkPaymentToken(paymentToken)
})
</script>
<template>
  <LeaveConfirm
    :open="showConfirmDialog"
    :onClose="cancelLeave"
    :onConfirm="confirmLeave"
    :onCancel="cancelLeave"
    title="Вы уверены, что хотите выйти?"
    description="Все введённые данные будут утеряны."
  />

  <div class="donate-page">
    <div class="container min-h-screen mx-auto py-8 md:py-16">
      <div class="mx-auto flex flex-col gap-4 w-full sm:max-w-4xl">
        <div class="mb-12 text-center max-sm:px-4 items-center flex flex-col">
          <Icon variant="ghost" :class="[route.meta.icon]" class="size-12 text-primary" />
          <h1
            class="my-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Поддержите наш посёлок
          </h1>
          <p class="text-pretty text-lg text-muted-foreground md:text-xl">
            Ваше пожертвование поможет сделать наш посёлок лучше. Каждый вклад имеет значение.
          </p>
        </div>

        <DonateLayout />

        <div class="mt-12 grid gap-6 md:grid-cols-3 px-4">
          <div class="rounded-lg bg-card p-6 text-center shadow-sm">
            <div class="mb-2 text-3xl font-bold text-primary">100%</div>
            <p class="text-sm text-muted-foreground">Прозрачность использования средств</p>
          </div>
          <div class="rounded-lg bg-card p-6 text-center shadow-sm">
            <div class="mb-2 text-3xl font-bold text-primary">24/7</div>
            <p class="text-sm text-muted-foreground">Безопасные платежи</p>
          </div>
          <div class="rounded-lg bg-card p-6 text-center shadow-sm">
            <div class="mb-2 text-3xl font-bold text-primary">1000+</div>
            <p class="text-sm text-muted-foreground">Благодарных жителей</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donate-page {
  position: relative;
  background-color: var(--color-background);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      color-mix(in oklch, var(--color-primary) 15%, transparent) 1px,
      transparent 1px
    );
    background-size: 64px 64px;
    pointer-events: none;
    animation: pulse-bg 3s ease-in-out infinite;
  }
}

@keyframes pulse-bg {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
