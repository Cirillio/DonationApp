<script lang="ts" setup>
import { FormField } from '@/shared/ui/form'
import { onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input'
import { PAYMENT_AMOUNTS, PAYMENT_AMOUNTS_MIN, DEFAULT_PAY_FORM } from '@/domain/payment/default'
import { PAYMENT_TYPES } from '@/domain/payment/types'
import paySchema from '@/domain/payment/schema'
import { placeholders } from './copy'

const donationStore = useDonationStore()

const {
  formattedValue: currencyFormatted,
  setValue: currencySet,
  numberValue: currencyNumber,
  inputRef: currencyRef,
} = useCurrencyInput({
  currency: 'RUB',
  currencyDisplay: CurrencyDisplay.hidden,
  precision: 2,
})

const donorPay = useForm({
  validationSchema: toTypedSchema(paySchema),
  initialValues: DEFAULT_PAY_FORM,
  name: 'donationPayment',
})

const amountsRef = ref()

onMounted(() => {
  if (donorPay.values.amount) currencySet(donorPay.values.amount)
})

watch(currencyNumber, (newAmount) => {
  donorPay.setFieldValue('amount', newAmount, false)
  if (amountsRef.value && amountsRef.value.selected !== newAmount)
    amountsRef.value.select(undefined)
})

const selectAmount = (selectedAmount: number | null) => {
  currencySet(selectedAmount)
}

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
  <div class="flex flex-col gap-6 p-6 rounded-lg bg-card">
    <FormField v-slot="{ meta, handleBlur }" name="amount">
      <FormItem v-auto-animate class="gap-1">
        <FormLabel>Сумма</FormLabel>

        <FormControl>
          <Input
            v-bind="meta"
            @blur="handleBlur"
            ref="currencyRef"
            :value="currencyFormatted"
            :placeholder="PAYMENT_AMOUNTS_MIN.label"
            name="amount"
            type="text"
          >
          </Input>

          <FormMessage />
          <RadioList orientation="wrap" class="mt-1" ref="amountsRef">
            <template #item="{ select, selected }">
              <RadioButton
                class="text-xs !max-h-8 px-2 md:text-base sm:text-sm"
                v-for="amount in PAYMENT_AMOUNTS"
                :key="amount.label"
                :onSelect="() => selectAmount(select(amount.value) as number | null)"
                :selected="amount.value === selected"
                size="sm"
              >
                {{ amount.label }}
              </RadioButton>
            </template>
          </RadioList>
        </FormControl>
      </FormItem>
    </FormField>

    <FormField v-slot="{ value }" name="type">
      <FormItem v-auto-animate class="gap-1">
        <FormLabel>Способ оплаты</FormLabel>

        <FormControl>
          <div class="flex flex-col gap-2">
            <CheckBlock
              v-for="p in PAYMENT_TYPES"
              :key="p.type"
              class="w-full flex-1"
              @onCheck="(check: boolean)=> check ? donorPay.setFieldValue('type', p.type) : donorPay.setFieldValue('type', undefined)"
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

    <FormField v-slot="{ componentField }" :validate-on-blur="!donorPay.isFieldDirty" name="note">
      <FormItem class="gap-1">
        <FormControl>
          <Textarea
            :placeholder="placeholders.get(donationStore.blankForm.isGroup || false)"
            v-bind="componentField"
            class="resize-none min-h-24 text-sm"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
