<script lang="ts" setup>
import { computed } from 'vue'
import { useDonationStore } from '@/stores/donation'
import { getPhoneSpec } from '@/lib/utils'
import ConfirmationField from './ConfirmationField.vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@/components/ui/icon'

const donationStore = useDonationStore()

const { formData } = storeToRefs(donationStore)

const phoneSpec = computed(() => getPhoneSpec(formData.value.blank.phoneCountry))

const formattedPhone = computed(() => {
  if (!formData.value.blank.phone) return '-'
  return `${phoneSpec.value.code} ${formData.value.blank.phone}`
})

const formattedBirth = computed(() => {
  if (!formData.value.blank.birth) return '-'
  const date = new Date(formData.value.blank.birth)
  return date.toLocaleDateString('ru-RU')
})

const displayName = computed(() => {
  if (donationStore.isBlankAnonymous || !formData.value.blank.name) {
    return 'Анонимно'
  }
  return formData.value.blank.name
})

const paymentTypeName = computed(() => {
  if (!formData.value.payment.type) return '-'
  return formData.value.payment.type === 'sbp' ? 'СБП' : 'Банковская карта'
})

const formattedAmount = computed(() => {
  if (!formData.value.payment.amount) return '-'
  return `${formData.value.payment.amount.toLocaleString('ru-RU')} ₽`
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Личные данные -->
    <div class="flex flex-col gap-4">
      <h3 class="text-xl font-semibold text-foreground">Личные данные</h3>
      <div class="space-y-2">
        <!-- Phone -->
        <ConfirmationField icon="f7--phone" :value="formattedPhone" />

        <!-- Name -->
        <ConfirmationField
          :icon="donationStore.isBlankAnonymous ? 'f7--eye-slash' : 'f7--person'"
          :value="displayName"
        />

        <!-- Birth Date -->
        <ConfirmationField icon="f7--calendar" :value="formattedBirth" />

        <!-- Group Participation -->
        <ConfirmationField
          :icon="formData.blank.isGroup ? 'f7--person-2-fill' : 'f7--person'"
          :icon-class="formData.blank.isGroup ? 'text-primary' : 'text-muted-foreground'"
          :value="formData.blank.isGroup ? 'Несколько человек' : 'Один человек'"
        />
      </div>
    </div>

    <!-- Данные оплаты -->
    <div class="flex flex-col gap-4">
      <h3 class="text-xl font-semibold text-foreground">Данные оплаты</h3>
      <div class="space-y-3">
        <!-- Amount -->
        <ConfirmationField icon="f7--money-rubl" :value="formattedAmount" />

        <!-- Payment Type -->
        <ConfirmationField icon="f7--creditcard" :value="paymentTypeName" />

        <!-- Note (if exists) -->
        <ConfirmationField
          v-if="formData.payment.note"
          icon="f7--text-bubble"
          :value="formData.payment.note"
        />
      </div>
    </div>

    <!-- Info message -->
    <div
      class="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border-2 border-destructive/20"
    >
      <Icon class="f7--info-circle size-6 text-destructive flex-shrink-0 mt-0.5" />
      <p class="text-sm text-destructive">
        Проверьте правильность введенных данных перед переходом к оплате
      </p>
    </div>
  </div>
</template>
