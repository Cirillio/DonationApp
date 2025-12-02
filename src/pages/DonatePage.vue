<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import LeaveConfirm from '@/components/common/LeaveConfirm.vue'
import { useDonationStore } from '@/stores/donation'
import { usePageLeaveConfirmation } from '@/composables/usePageLeaveConfirm'
import { useStructuredData, getDonateActionStructuredData } from '@/composables/useStructuredData'
import { DonationForm, DonationHeader } from '@/components/donation/sections'

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

  <div class="light:bg-card flex w-full">
    <div class="container mx-auto my-auto">
      <div class="m flex gap-4 w-full py-16">
        <DonationHeader class="flex-2/3" />
        <DonationForm class="flex-1/3" />
      </div>
    </div>
  </div>
</template>
