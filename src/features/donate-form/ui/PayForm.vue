<script lang="ts" setup>
import { FormField } from '@/shared/ui/form'
import { watch, onBeforeUnmount, onMounted } from 'vue'
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

onBeforeUnmount(() => donorPay.resetForm({values: DEFAULT_PAY_FORM}))
onMounted(() => donorPay.resetForm({values: DEFAULT_PAY_FORM}))

const selectAmount = (selectedAmount: number) => {

  if (selectedAmount === currencyNumber.value) {
    currencySet(null)
    donorPay.setFieldValue('amount', undefined, true)
    donorPay.setFieldTouched('amount', false)
  }
  else {
    currencySet(selectedAmount)
    donorPay.setFieldValue('amount', selectedAmount, true)
  }

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
  <div class="flex flex-col gap-4">
    <FormField v-slot="{ setValue, handleBlur, handleInput }" name="amount" :validate-on-blur="!donorPay.isFieldDirty" "
    >
      <FormItem class=" gap-1">
      <FormLabel class="label-required gap-0.5 ">Сумма</FormLabel>
      <FormControl>
        <Input ref="currencyRef" v-model="currencyFormatted" :placeholder="PAYMENT_AMOUNTS_MIN.label" name="amount"
           @blur="handleBlur" @input="handleInput" @change="() => setValue(currencyNumber)"
           inputmode="numeric" class=""
           />

        <AutoAnimated>
          <FormMessage />
        </AutoAnimated>

        <div class="flex flex-wrap gap-1 w-full">
          <Button
          class="px-2 py-1"
          v-for="amount in PAYMENT_AMOUNTS" :key="amount.label"
            :variant="currencyNumber === amount.value ? 'secondary' : 'outline'" size="sm"
            @click="selectAmount(amount.value)">
            {{ amount.label }}
          </Button>
        </div>
      </FormControl>
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, setValue }" name="type">
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 ">Способ оплаты</FormLabel>

        <FormControl>
          <div class="flex flex-col gap-2">
            <CheckBlock v-for="p in PAYMENT_TYPES" :key="p.type" class="w-full px-3 flex-1"
              @onCheck="(check: boolean) => check ? setValue(p.type) : setValue(undefined)"
              :showCheckbox="false"
              :checked="p.type === value">
              <template #content>
                <div class="flex w-full   gap-3 items-center">
                  <img :src="p.icon" :alt="p.type" class="size-6" />
                  {{ p.name }}
                </div>
              </template>
            </CheckBlock>
          </div>
        </FormControl>
        <AutoAnimated>
          <FormMessage />
        </AutoAnimated>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" :validate-on-blur="!donorPay.isFieldDirty" name="note">
      <FormItem class="gap-1">
        <FormControl>
          <Textarea :placeholder="placeholders.get(donationStore.blankForm.isGroup || false)" v-bind="componentField"
            class="resize-none min-h-24 text-sm" />
        </FormControl>
        <AutoAnimated>
          <FormMessage />
        </AutoAnimated>
      </FormItem>
    </FormField>
  </div>
</template>


