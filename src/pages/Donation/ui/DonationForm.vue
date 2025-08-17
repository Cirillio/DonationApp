<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted } from 'vue'
import FormCard from './FormCard.vue'
import BlankForm from '@/features/donate-form/ui/BlankForm.vue'
import PayForm from '@/features/donate-form/ui/PayForm.vue'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { configure } from 'vee-validate'

configure({
  validateOnBlur: true,
  validateOnModelUpdate: false,
})

const donationStore = useDonationStore()
const { bindFocus, isActive } = inject('useCardFocus') as any

onBeforeUnmount(donationStore.resetAll)
onMounted(donationStore.resetAll)
</script>

<template>
  <section class="flex flex-col gap-2 z-30">
    <div class="flex max-md:flex-col gap-2 md:gap-4">
      <FormCard
        v-bind="bindFocus('blank')"
        :class="{ 'card-focused': isActive('blank'), 'opacity-50': isActive('payment') }"
      >
        <template v-slot:header>
          <Icon variant="ghost" class="f7--person md:size-6 size-4" />

          <CardTitle class="md:text-xl w-full">Анкета</CardTitle>

          <Icon
            :variant="donationStore.blankValid ? 'secondary' : 'outline'"
            class="f7--checkmark-alt md:size-5 size-4"
          />
        </template>

        <template v-slot:content>
          <BlankForm />
        </template>

        <template v-slot:footer>
          <p class="text-muted-foreground">Данная информация будет собрана для статистики.</p>
        </template>
      </FormCard>

      <FormCard
        v-bind="bindFocus('payment')"
        :class="{ 'card-focused': isActive('payment'), 'opacity-50': isActive('blank') }"
      >
        <template v-slot:header>
          <Icon variant="ghost" class="f7--creditcard md:size-6 size-4" />
          <CardTitle class="md:text-xl w-full">Оплата</CardTitle>
          <Icon
            :variant="donationStore.payValid ? 'secondary' : 'outline'"
            class="f7--checkmark-alt md:size-5 size-4"
          />
        </template>

        <template v-slot:content>
          <PayForm />
        </template>

        <template v-slot:footer>
          <div>
            <p class="text-muted-foreground">Мы не храним ваши банковские данные.</p>
            <p class="text-muted-foreground">Платеж производится через сервис YooKassa.</p>
          </div>
        </template>
      </FormCard>
    </div>

    <div
      class="md:ml-auto flex max-md:flex-col-reverse items-center max-md:justify-center gap-2 md:gap-5"
    >
      <Button
        variant="ghost"
        size="sm"
        class="dark:border-primary/50 dark:hover:border-primary border-accent/50 hover:border-accent"
        >Платёж активен? Нажмите здесь</Button
      >
      <Button
        :disabled="!donationStore.isValid"
        class="max-md:w-full dark:bg-primary dark:text-primary-foreground dark:hover:shadow-primary/25 dark:shadow-black shadow-muted hover:shadow-accent/50 shadow-lg active:scale-99"
        variant="accent"
        size="lg"
        >Пожертвовать</Button
      >
    </div>
  </section>
</template>
