<script lang="ts" setup>
import { computed, onBeforeUnmount } from 'vue'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'

const donationStore = useDonationStore()
const { paymentResult } = storeToRefs(donationStore)

const isLoading = computed(() => !paymentResult.value)
const isSuccess = computed(() => paymentResult.value?.success ?? false)

const handleNewDonation = () => {
  donationStore.resetForm()
}

const handleGoHome = () => {
  window.location.href = '/'
}

onBeforeUnmount(() => donationStore.resetForm())
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 pt-6 text-center">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex size-24 items-center justify-center rounded-full bg-muted">
      <span class="iconify f7--arrow-2-circlepath size-16 text-muted-foreground animate-spin" />
    </div>

    <!-- Success Icon -->
    <div
      v-else-if="isSuccess"
      class="flex size-24 items-center justify-center rounded-full bg-primary/10"
    >
      <span class="iconify f7--checkmark-circle-fill size-16 text-primary" />
    </div>

    <!-- Loading Message -->
    <div v-if="isLoading" class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold text-foreground">Обработка платежа...</h2>
      <p class="text-muted-foreground">Пожалуйста, подождите. Это займет несколько секунд.</p>
    </div>

    <!-- Success Message -->
    <div v-else-if="isSuccess" class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold text-foreground">Спасибо за ваше пожертвование!</h2>
      <p class="text-muted-foreground">
        Ваш вклад поможет сделать наш посёлок лучше.<br />
        Мы ценим вашу поддержку!
      </p>
    </div>

    <!-- Donation Details Summary (only show when payment is successful) -->
    <div v-if="isSuccess" class="w-full rounded-lg border border-border bg-card p-6">
      <h3 class="mb-4 text-lg font-semibold">Детали пожертвования</h3>
      <div class="flex flex-col gap-3 text-sm">
        <div v-if="paymentResult?.paymentId" class="flex justify-between">
          <span class="text-muted-foreground">ID платежа:</span>
          <span class="font-mono text-xs font-semibold">{{ paymentResult.paymentId }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Сумма:</span>
          <span class="font-semibold">{{ donationStore.paymentForm.amount }} ₽</span>
        </div>
        <div v-if="donationStore.blankForm.name" class="flex justify-between">
          <span class="text-muted-foreground">Имя:</span>
          <span class="font-medium">{{ donationStore.blankForm.name }}</span>
        </div>
        <div v-if="donationStore.paymentForm.note" class="flex justify-between">
          <span class="text-muted-foreground">Комментарий:</span>
          <span class="font-medium">{{ donationStore.paymentForm.note }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons (only show when payment is successful) -->
    <div v-if="isSuccess" class="flex w-full flex-col gap-3 pt-4">
      <Button @click="handleNewDonation" class="w-full py-3" size="lg">
        Сделать ещё одно пожертвование
      </Button>
      <Button @click="handleGoHome" variant="outline" class="w-full py-3" size="lg">
        Вернуться на главную
      </Button>
    </div>
  </div>
</template>
