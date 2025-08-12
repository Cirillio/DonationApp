<script lang="ts" setup>
import { FormField } from '@/components/ui/form'

import { onMounted, ref, watch } from 'vue'
import { CurrencyDisplay } from 'vue-currency-input'
import { useFormConfig } from '@/composables/useFormConfig'
import { paySchema, paymentAmounts, paymentTypes } from '@/data/donation'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { nextTick } from 'vue'
const donationStore = useDonationStore()

const { currencyFormatted, currencyNumber, currencyRef, currencySet } = useFormConfig({
  currencyOptions: {
    currency: 'RUB',
    currencyDisplay: CurrencyDisplay.hidden,
    precision: 2,
  },
})

const donorPay = useForm({
  validationSchema: toTypedSchema(paySchema),
  initialValues: { ...donationStore.payForm },
  name: 'donationPayment',
})

const amountsRef = ref()

onMounted(async () => {
  await nextTick()
  if (donorPay.values.payAmount) currencySet(donorPay.values.payAmount)
})

watch(currencyNumber, (_new) => {
  const newAmount = _new || 0
  donorPay.setFieldValue('payAmount', newAmount, false)
  if (amountsRef.value.selected !== newAmount && amountsRef.value)
    amountsRef.value.select(undefined)
})

watch(
  () => donorPay.values,
  (values) => {
    donationStore.payForm = { ...values }
  },
  {
    deep: true,
  }
)

watch(
  () => donorPay.meta.value.valid,
  (valid) => {
    donationStore.setPayValidity(valid)
  }
)
</script>

<template>
  <form @submit.prevent="">
    <CardTitledContent
      icon="f7--creditcard"
      title="Оплата"
      desc="Минимальная сумма пожертвования 100 рублей"
    >
      <template #desc>
        <span class="max-[400px]:text-xs text-sm md:text-base text-muted-foreground"
          >Начните помогать от

          <PrimaryBadge> {{ paymentAmounts[0].value }}</PrimaryBadge>

          рублей
        </span>
      </template>
      <div class="flex flex-col w-full gap-4">
        <FormField v-slot="{ resetField, meta, handleBlur, validate }" name="payAmount">
          <FormItem class="gap-0">
            <FormControl>
              <IconInput
                @blur="(e: Event) => (meta.dirty ? handleBlur(e) : undefined)"
                ref="currencyRef"
                :value="currencyFormatted"
                :icon="true"
                placeholder="100,00"
                name="payAmount"
                type="text"
              >
                <template #icon>
                  <span
                    class="iconify f7--money-rubl size-5 md:size-6 dark:text-primary"
                  ></span> </template
              ></IconInput>
              <FormMessage />

              <RadioList orientation="wrap" class="mt-1" ref="amountsRef">
                <template #item="{ select, selected }">
                  <RadioButton
                    class="text-xs !max-h-8 px-2 md:text-base sm:text-sm"
                    v-for="_amount in paymentAmounts"
                    :key="_amount.label"
                    :onSelect="() => {
                    const _new = select(_amount.value) as number | null
                    _new ? validate() : resetField()
                    currencySet(_new)
                  }"
                    :selected="_amount.value === selected"
                    size="sm"
                  >
                    {{ _amount.label }}
                  </RadioButton>
                </template>
              </RadioList>
            </FormControl>
          </FormItem>
        </FormField>

        <TextSeparator>
          <PrimaryBadge> Cпособ оплаты </PrimaryBadge>
        </TextSeparator>

        <FormField v-slot="{ setValue, value }" name="payPaymentType">
          <FormItem class="gap-1">
            <FormControl>
              <div class="flex flex-col gap-2">
                <CheckBlock
                  v-for="p in paymentTypes"
                  :key="p.type"
                  class="w-full flex-1"
                  @onCheck="(check: boolean)=> check ? setValue(p.type) : setValue(undefined)"
                  :checked="p.type === value"
                >
                  <template #content>
                    <div class="flex gap-2 items-center">
                      <img :src="p.icon" :alt="p.type" class="w-6 h-6" />
                      {{ p.name }}
                    </div>
                  </template>
                </CheckBlock>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </CardTitledContent>
  </form>
</template>
