<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DonationStatus } from '@/lib/types/donate'
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DonateLayout from '@/components/donation/DonateLayout.vue'
import { useDonationStore } from '@/stores/donation'
import { usePageLeaveConfirmation } from '@/composables/usePageLeaveConfirm'
import { useDonationRedirect } from '@/composables/useDonationRedirect'
import { DEFAULT_BLANK_FORM, DEFAULT_PAY_FORM } from '@/lib/constants'
import { phoneSchema, nameSchema, birthSchema, isGroupSchema } from '@/lib/validations/blank'
import { amountSchema, typeSchema, noteSchema } from '@/lib/validations/payment'
import { getPhoneSpec } from '@/lib/utils'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const donationStore = useDonationStore()

// Создаем объектные схемы из готовых field схем
const blankFormSchema = z.object({
  phone: phoneSchema(() => getPhoneSpec(donationStore.formData.blank.phoneCountry).code || ''),
  phoneCountry: z.string(),
  name: nameSchema,
  birth: birthSchema,
  isGroup: isGroupSchema,
})

const paymentFormSchema = z.object({
  amount: amountSchema,
  type: typeSchema,
  note: noteSchema,
})

const { showConfirmDialog, confirmLeave, cancelLeave } = usePageLeaveConfirmation({
  forms: [
    {
      data: () => donationStore.formData.blank,
      defaults: DEFAULT_BLANK_FORM,
      schema: blankFormSchema,
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

const { checkAndRedirect } = useDonationRedirect()

onMounted(() => {
  const status = route.query.status as DonationStatus

  checkAndRedirect(status)

  const initStatusResult = donationStore.initStatus(status)
  if (!initStatusResult.success && initStatusResult.query) {
    router.replace({
      path: '/donate',
      query: {
        ...initStatusResult.query,
      },
    })
  }
})

// Sync currentStatus to query param
watch(
  () => donationStore.currentStatus,
  (newStatus) => {
    if (route.query.status !== newStatus) {
      router.replace({
        query: { ...route.query, status: newStatus },
      })
    }
  }
)

// Sync query param to currentStatus
watch(
  () => route.query.status,
  (newStatus) => {
    if (
      newStatus &&
      typeof newStatus === 'string' &&
      ['blank', 'payment', 'result'].includes(newStatus)
    ) {
      const status = newStatus as DonationStatus
      if (donationStore.currentStatus !== status) {
        donationStore.setStepByStatus(status)
      }
    }
  }
)
</script>
<template>
  <Dialog :open="showConfirmDialog" @update:open="onCloseDialog">
    <DialogContent @escape-key-down="cancelLeave" class="sm:max-w-md dark:border-accent/50">
      <DialogHeader class="text-center space-y-4">
        <div class="mx-auto w-fit relative">
          <div class="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <span class="iconify f7--doc-text size-8 text-destructive"></span>
          </div>
          <span
            class="absolute -top-1 -right-1 iconify f7--exclamationmark-circle-fill size-6 text-destructive rounded-full"
          ></span>
        </div>

        <div class="space-y-2">
          <DialogTitle class="text-xl">Вы уверены, что хотите выйти?</DialogTitle>
          <DialogDescription class="text-muted-foreground">
            Все введённые данные будут утеряны.
          </DialogDescription>
        </div>
      </DialogHeader>

      <DialogFooter class="flex-col-reverse sm:flex-row gap-2 mt-6">
        <Button variant="outline" @click="cancelLeave" class="w-full sm:flex-1"> Остаться </Button>
        <Button variant="destructive" @click="confirmLeave" class="w-full sm:flex-1">
          Выйти
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

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
