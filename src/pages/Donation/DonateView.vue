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
        <Icon variant="fill" class="f7--heart size-6" />
        <Label class="text-3xl font-bold text-foreground">Оформление пожертвования</Label>
      </div>

      <div class="flex max-md:flex-col gap-8 relative">
        <Card class="flex flex-col gap-4 flex-1 light:border-none bg-card/90">
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

        <Card class="flex flex-col gap-4 flex-1 light:border-none bg-card/90">
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

      <div class="ml-auto flex items-center gap-5">
        <div
          class="h-10 w-10 border bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_100%)]"
        ></div>
        <Button
          variant="ghost"
          size="sm"
          class="dark:border-primary/50 dark:hover:border-primary border-accent/50 hover:border-accent"
          >Платёж активен? Нажмите здесь</Button
        >
        <Button
          :disabled="!donationStore.isValid"
          class="dark:bg-primary dark:text-primary-foreground dark:hover:shadow-primary/25 dark:shadow-black shadow-muted hover:shadow-accent/50 shadow-lg active:scale-99"
          variant="accent"
          size="lg"
          >Пожертвовать</Button
        >
      </div>
    </div>
  </div>
</template>
