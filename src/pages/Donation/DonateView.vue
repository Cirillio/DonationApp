<script lang="ts" setup>
import BlankForm from '@/features/donate-form/ui/BlankForm.vue'
import PayForm from '@/features/donate-form/ui/PayForm.vue'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { configure } from 'vee-validate'

configure({
  validateOnBlur: true,
  validateOnModelUpdate: false,
})
const donationStore = useDonationStore()
</script>

<template>
  <div class="flex h-full w-full justify-center items-center">
    <div class="flex flex-col items-end gap-4 bg-ghost rounded-md p-12">
      <div class="flex max-md:flex-col gap-8">
        <div class="flex flex-col gap-8 flex-1">
          <div class="flex gap-4">
            <Icon variant="fill" class="f7--person size-7" />
            <div class="flex items-center bg-card rounded-md w-full h-full px-4 py-2">
              <h3 class="text-2xl font-semibold text-foreground">Анкета</h3>
            </div>
            <Icon
              :variant="donationStore.blankValid ? 'secondary' : 'fill'"
              :class="{ 'text-primary': donationStore.blankValid }"
              class="f7--checkmark-alt size-7"
            />
          </div>
          <BlankForm class="flex-1" />
        </div>

        <div class="flex w-2 min-h-0 min-w-0 rounded-md bg-card"></div>

        <div class="flex flex-col gap-8 flex-1">
          <div class="flex gap-4">
            <Icon variant="fill" class="f7--creditcard size-7" />
            <div class="flex items-center bg-card rounded-md w-full h-full px-4 py-2">
              <h3 class="text-2xl font-semibold text-foreground">Оплата</h3>
            </div>
            <Icon
              :variant="donationStore.payValid ? 'secondary' : 'fill'"
              class="f7--checkmark-alt size-7"
            />
          </div>
          <PayForm />
        </div>
      </div>
      <Button variant="secondary" size="lg">Пожертвовать</Button>
    </div>
  </div>
</template>
