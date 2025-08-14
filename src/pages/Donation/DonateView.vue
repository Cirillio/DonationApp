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
  <div class="flex h-full w-full justify-center items-center max-w-[960px] mx-auto">
    <div class="flex flex-col items-end gap-4 bg-ghost rounded-md p-12">
      <div class="flex max-md:flex-col gap-8">
        <Card class="flex flex-col gap-8 flex-1 !border-none">
          <CardHeader class="flex gap-4 items-center">
            <Icon variant="ghost" class="f7--person size-6" />

            <CardTitle class="text-2xl w-full">Анкета</CardTitle>

            <Icon
              :variant="donationStore.blankValid ? 'secondary' : 'outline'"
              class="f7--checkmark-alt size-6"
            />
          </CardHeader>

          <CardContent>
            <BlankForm class="flex-1" />
          </CardContent>
        </Card>

        <Card class="flex flex-col gap-8 flex-1 !border-none">
          <CardHeader class="flex gap-4 items-center">
            <Icon variant="ghost" class="f7--creditcard size-7" />
            <CardTitle class="text-2xl w-full">Оплата</CardTitle>
            <Icon
              :variant="donationStore.payValid ? 'secondary' : 'outline'"
              class="f7--checkmark-alt size-7"
            />
          </CardHeader>
          <CardContent>
            <PayForm />
          </CardContent>
        </Card>
      </div>

      <Button variant="accent" size="lg">Пожертвовать</Button>
    </div>
  </div>
</template>
