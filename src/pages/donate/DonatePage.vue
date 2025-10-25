<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DonationStatus } from '@/lib/types/donate'
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DonationForm from '@/components/donation/forms/DonationForm.vue'
import { useDonationStore } from '@/stores/donation'
import { usePageLeaveConfirmation } from '@/composables/usePageLeaveConfirm'
import { useDonationRedirect } from '@/composables/useDonationRedirect'

const route = useRoute()
const router = useRouter()
const donationStore = useDonationStore()

const { showConfirmDialog, confirmLeave, cancelLeave } = usePageLeaveConfirmation()

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

  <div class="container min-h-screen mx-auto px-4 py-8 md:py-16">
    <div class="mx-auto flex flex-col gap-4 max-w-4xl">
      <div class="mb-12 text-center">
        <h1 class="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Поддержите наш посёлок
        </h1>
        <p class="text-pretty text-lg text-muted-foreground md:text-xl">
          Ваше пожертвование поможет сделать наш посёлок лучше. Каждый вклад имеет значение.
        </p>
      </div>

      <DonationForm />

      <div class="mt-12 grid gap-6 md:grid-cols-3">
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
