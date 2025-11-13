<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import LeaveConfirm from "@/components/common/LeaveConfirm.vue";
import { useDonationStore } from "@/stores/donation";
import { usePageLeaveConfirmation } from "@/composables/usePageLeaveConfirm";
import {
  useStructuredData,
  getDonateActionStructuredData,
} from "@/composables/useStructuredData";
import { DonationForm, DonationHeader } from "@/components/donation/sections";

const route = useRoute();
const donationStore = useDonationStore();
const { hasUnsavedData } = storeToRefs(donationStore);

const { showConfirmDialog, confirmLeave, cancelLeave } = usePageLeaveConfirmation({
  hasUnsavedData,
  onConfirm: () => donationStore.resetForm(),
});

useStructuredData(getDonateActionStructuredData());

onMounted(() => {
  const paymentToken = route.query["payment-token"] as string | null;
  donationStore.checkPaymentToken(paymentToken);
});
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

  <div class="light:bg-card">
    <div class="container min-h-screen mx-auto">
      <div class="mx-auto flex flex-col gap-4 w-full">
        <DonationHeader />
        <DonationForm />
      </div>
    </div>
  </div>
</template>
