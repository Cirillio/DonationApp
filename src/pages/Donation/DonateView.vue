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
  <div class="flex h-full w-full justify-center items-center max-w-[868px] mx-auto">
    <div class="flex flex-col gap-4">
      <div class="flex gap-1 mb-4 items-center">
        <Icon variant="primary" class="f7--heart-fill size-5" />
        <Label class="text-3xl font-bold text-foreground">Оформление пожертвования</Label>
      </div>

      <div class="flex max-md:flex-col gap-8">
        <Card class="flex flex-col gap-4 flex-1 light:border-none">
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

          <Separator class="mt-auto" />
          <CardFooter>
            <p class="text-muted-foreground text-sm">
              Данная информация будет собрана для статистики
            </p>
          </CardFooter>
        </Card>

        <Card class="flex flex-col gap-4 flex-1 light:border-none">
          <CardHeader class="flex gap-4 items-center">
            <Icon variant="ghost" class="f7--creditcard size-6" />
            <CardTitle class="text-2xl w-full">Оплата</CardTitle>
            <Icon
              :variant="donationStore.payValid ? 'secondary' : 'outline'"
              class="f7--checkmark-alt size-6"
            />
          </CardHeader>
          <CardContent>
            <PayForm />
          </CardContent>
          <Separator class="mt-auto" />

          <CardFooter>
            <div>
              <p class="text-muted-foreground text-sm">Мы не храним ваши банковские данные.</p>
              <p class="text-muted-foreground text-sm">
                Платеж производится через сервис YooKassa.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Button
        :disabled="!donationStore.isValid"
        class="dark:bg-primary dark:text-primary-foreground ml-auto"
        variant="accent"
        size="lg"
        >Пожертвовать</Button
      >
    </div>
  </div>
</template>
