<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import FormCard from '@/pages/Donation/ui/FormCard.vue'
import BlankForm from '@/components/forms/BlankForm.vue'
import PayForm from '@/components/forms/PayForm.vue'
import { PAYMENT_AMOUNTS_MIN } from '@/lib/constants'
import Dialog from '@/components/ui/dialog/Dialog.vue'

const blankFormRef = ref<InstanceType<typeof BlankForm>>()
const payFormRef = ref<InstanceType<typeof PayForm>>()

const isFormValid = computed(() => blankFormRef.value?.isValid && payFormRef.value?.isValid)

const debugResults = ref()
const dialogOpen = ref(false)

const submit = async () => {
  dialogOpen.value = true
  debugResults.value = 'donation sends successfully.'
}

onBeforeMount(() => {
  blankFormRef.value?.reset()
  payFormRef.value?.reset()
})

onBeforeUnmount(() => {
  blankFormRef.value?.reset()
  payFormRef.value?.reset()
})
</script>

<template>
  <section class="flex flex-col gap-2 z-30">
    <div class="flex max-md:flex-col gap-4">
      <FormCard
        title="Анкета"
        :icon="'f7--person'"
        :valid="blankFormRef?.isValid"
        description="Заполните обязательные поля"
      >
        <template v-slot:content>
          <BlankForm ref="blankFormRef" />
        </template>

        <template v-slot:footer>
          <p class="text-muted-foreground">Данная информация будет собрана для статистики.</p>
        </template>
      </FormCard>

      <FormCard
        title="Оплата"
        :icon="'f7--creditcard'"
        :valid="payFormRef?.isValid"
        :description="'Минимальная сумма: ' + PAYMENT_AMOUNTS_MIN.label + 'Р'"
      >
        <template v-slot:content>
          <PayForm ref="payFormRef" />
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
      class="md:ml-auto flex max-md:flex-col-reverse items-center max-md:justify-center gap-4 py-2"
    >
      <Button
        variant="outline"
        size="sm"
        class="max-md:text-xs dark:border-accent/50 dark:hover:border-accent border-accent/50 hover:border-accent"
        >Платёж активен? Нажмите здесь</Button
      >
      <Dialog
        :open="dialogOpen"
        @update:open="
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
          :disabled="!isFormValid"
          class="max-md:w-4/5 text-3xl shadow-md shadow-primary/15 hover:shadow-primary/35 transition-all hover:shadow-lg"
          variant="default"
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
