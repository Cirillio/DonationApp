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
import InfoCard from '@/components/common/InfoCard.vue'

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
  <LeaveConfirm :open="showConfirmDialog" :onClose="cancelLeave" :onConfirm="confirmLeave" :onCancel="cancelLeave"
    title="Вы уверены, что хотите выйти?" description="Все введённые данные будут утеряны." />

  <div class="dotted-background">
    <div class="container min-h-screen mx-auto py-8 md:py-16">
      <div class="mx-auto flex flex-col gap-4 w-full sm:max-w-4xl">
        <div class="mb-12 text-center max-sm:px-4 items-center flex flex-col">
          <Icon variant="ghost" :class="[route.meta.icon]" class="size-12 text-primary" />
          <h1 class="my-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Поддержите наш посёлок
          </h1>
          <p class="text-pretty text-lg text-muted-foreground md:text-xl">
            Ваше пожертвование поможет сделать наш посёлок лучше. Каждый вклад имеет значение.
          </p>
        </div>

        <DonateLayout />

        <div class="mt-12 grid gap-6 md:grid-cols-3 px-4">
          <InfoCard class="text-center">
            <CardHeader>
              <div class="aspect-square mx-auto size-fit bg-primary/15 p-1.5 rounded-lg mb-2">
                <Icon class="f7--square-favorites-alt size-8 text-primary group-hover:text-accent/80 transition-all duration-250" />
              </div>
              <CardTitle class="text-3xl font-bold text-primary">100%</CardTitle>
              <CardDescription class="text-sm text-muted-foreground">Прозрачность использования средств
              </CardDescription>
            </CardHeader>


          </InfoCard>
          <InfoCard class="text-center">
            <CardHeader>
              <div class="aspect-square mx-auto size-fit bg-primary/15 p-1.5 rounded-lg mb-2">
                <Icon class="f7--shield size-8 text-primary group-hover:text-accent/80 transition-all duration-250" />
              </div>
              <CardTitle class="text-3xl font-bold text-primary">24/7</CardTitle>
              <CardDescription class="text-sm text-muted-foreground">Безопасные платежи</CardDescription>
            </CardHeader>
          </InfoCard>

          <InfoCard class="text-center">
            <CardHeader>
              <div class="aspect-square mx-auto size-fit bg-primary/15 p-1.5 rounded-lg mb-2">
                <Icon class="f7--person-2 size-8 text-primary group-hover:text-accent/80 transition-all duration-250" />
              </div>
              <CardTitle class="text-3xl font-bold text-primary">1000+</CardTitle>
              <CardDescription class="text-sm text-muted-foreground">Благодарных жителей</CardDescription>
            </CardHeader>
          </InfoCard>

        </div>
      </div>
    </div>
  </div>
</template>
