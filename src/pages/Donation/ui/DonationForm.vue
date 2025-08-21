<script lang="ts" setup>
import { inject, onBeforeUnmount, ref } from 'vue'
import FormCard from './FormCard.vue'
import FormCardHeader from './FormCardHeader.vue'
import BlankForm from '@/features/donate-form/ui/BlankForm.vue'
import PayForm from '@/features/donate-form/ui/PayForm.vue'
import { PAYMENT_AMOUNTS_MIN } from '@/domain/payment/default'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import Dialog from '@/shared/ui/dialog/Dialog.vue'

const donationStore = useDonationStore()
const { bindFocus, isActive } = inject('useCardFocus') as any

onBeforeUnmount(() => {
  donationStore.resetAll
  donationStore.clearValidators()
})

const debugResults = ref()
const dialogOpen = ref(false)

const submit = async () => {
  dialogOpen.value = true
  const res = await donationStore.validate()
  console.log(res)
  if (res) {
    debugResults.value = res
    return
  }
  debugResults.value = "something went wrong. maybe you're entered invalid data."
}
</script>

<template>
  <section class="flex flex-col gap-2 z-30">
    <div class="flex max-md:flex-col gap-4">
      <FormCard
        v-bind="bindFocus('blank')"
        :class="{
          'card-focused': isActive('blank'),
          'opacity-90 md:opacity-50': isActive('payment'),
        }"
      >
        <template v-slot:header>
          <FormCardHeader
            title="Анкета"
            :icon="'f7--person'"
            :valid="donationStore.blankValid"
            description="Заполните обязательные поля"
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
        :class="{
          'card-focused': isActive('payment'),
          'opacity-90 md:opacity-50': isActive('blank'),
        }"
      >
        <template v-slot:header>
          <FormCardHeader
            title="Оплата"
            :icon="'f7--creditcard'"
            :valid="donationStore.payValid"
            :description="'Минимальная сумма: ' + PAYMENT_AMOUNTS_MIN.label + 'Р'"
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
      class="md:ml-auto flex max-md:flex-col-reverse items-center max-md:justify-center gap-4 py-4"
    >
      <Button
        variant="ghost"
        size="sm"
        class="max-md:text-xs dark:border-primary/50 dark:hover:border-primary border-accent/50 hover:border-accent"
        >Платёж активен? Нажмите здесь</Button
      >
      <Dialog
        :open="dialogOpen"
        v-on:update:open="
          (v) => {
            if (!v) {
              dialogOpen = v
            } else {
              debugResults = undefined
            }
          }
        "
      >
        <Button
          @click="submit"
          :disabled="!donationStore.isValid"
          class="max-md:w-4/5 max-md:text-xl max-md:py-3 dark:bg-primary dark:text-primary-foreground dark:hover:shadow-primary/25 dark:shadow-black shadow-muted hover:shadow-accent/50 shadow-lg active:scale-99"
          variant="accent"
          size="lg"
          >Пожертвовать</Button
        >
        <DialogContent
          class="text-foreground flex flex-col border-border max-h-[80vh] light:border-transparent"
        >
          <DialogTitle> donation form debug dialog </DialogTitle>
          <DialogDescription>shows final values to submit to backend</DialogDescription>
          <div class="flex overflow-scroll min-h-full flex-1 h-2/3 max-md:text-xs">
            <pre>{{ debugResults }}</pre>
          </div>
          <DialogClose>
            <Button>Закрыть</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  </section>
</template>
