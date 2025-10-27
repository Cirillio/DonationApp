<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DonateLayout from '@/components/donation/DonateLayout.vue'
import LeaveConfirm from '@/components/common/LeaveConfirm.vue'
import { useDonationStore } from '@/stores/donation'
import { usePageLeaveConfirmation } from '@/composables/usePageLeaveConfirm'
import { DEFAULT_BLANK_FORM, DEFAULT_PAY_FORM } from '@/lib/constants'
import { blankFormSchema, paymentFormSchema } from '@/lib/validations'

import { getPhoneSpec } from '@/lib/utils'

const route = useRoute()
const donationStore = useDonationStore()

const { showConfirmDialog, confirmLeave, cancelLeave } = usePageLeaveConfirmation({
  forms: [
    {
      data: () => donationStore.formData.blank,
      defaults: DEFAULT_BLANK_FORM,
      schema: blankFormSchema({
        getPhone: () => getPhoneSpec(donationStore.formData.blank.phoneCountry).code || '',
      }),
      ignoreFields: ['phoneCountry', 'isGroup'],
    },
    {
      data: () => donationStore.formData.payment,
      defaults: DEFAULT_PAY_FORM,
      schema: paymentFormSchema,
    },
  ],
  shouldPrevent: () => donationStore.currentStep < 3 && !donationStore.paymentResult?.success,
  onConfirm: () => donationStore.resetForm(),
})

const onCloseDialog = (open: boolean) => {
  if (!open) {
    cancelLeave()
  }
}

onMounted(() => {
  // Проверяем наличие платежного токена в URL
  const paymentToken = route.query['payment-token'] as string | null
  donationStore.checkPaymentToken(paymentToken)
})
</script>
<template>
  <LeaveConfirm
    :open="showConfirmDialog"
    :onClose="() => onCloseDialog(false)"
    :onConfirm="confirmLeave"
    :onCancel="cancelLeave"
    title="Вы уверены, что хотите выйти?"
    description="Все введённые данные будут утеряны."
  />

  <div class="container min-h-screen mx-auto py-8 md:py-16">
    <div class="mx-auto flex flex-col gap-4 w-full sm:max-w-4xl">
      <div class="mb-12 text-center max-sm:px-4">
        <h1 class="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
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
</template>
