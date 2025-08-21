<script lang="ts" setup>
import { FormField } from '@/shared/ui/form'
import { watch, onBeforeUnmount, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input'
import { PAYMENT_AMOUNTS, DEFAULT_PAY_FORM } from '@/domain/payment/default'
import { PAYMENT_TYPES } from '@/domain/payment/types'
import { amountSchema, noteSchema, typeSchema } from '@/domain/payment/schema'
import { PaySchema } from '@/domain/payment/types'
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

const donorPay = useForm<PaySchema>({
  initialValues: DEFAULT_PAY_FORM,
  name: 'donationPayment',
})

const selectAmount = (selectedAmount: number) => {
  if (selectedAmount === currencyNumber.value) {
    currencySet(null)
    donorPay.resetField('amount')
    donorPay.validateField('amount', {
      mode: 'silent',
    })
  } else {
    currencySet(selectedAmount)
    donorPay.setFieldValue('amount', selectedAmount, true)
  }
}

const handleNumericInput = (value: string, handle: Function) => {
  if (!/^[0-9., ]*$/.test(value)) {
    return
  }
  handle()
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

onMounted(() => {
  donationStore.initValidator('donationPayment', donorPay.validate)
})

onBeforeUnmount(() => {
  donorPay.resetForm({ values: DEFAULT_PAY_FORM })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormField
      :rules="toTypedSchema(amountSchema)"
      v-slot="{ setValue, handleBlur, handleInput }"
      name="amount"
      :validate-on-blur="!donorPay.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 max-md:text-lg">Сумма</FormLabel>
        <div class="relative">
          <FormControl>
            <Input
              ref="currencyRef"
              v-model="currencyFormatted"
              :placeholder="'0,00'"
              name="amount"
              @blur="handleBlur"
              @input="(e: HTMLInputElement) => handleNumericInput(e?.value, () => handleInput(e))"
              @change="() => setValue(currencyNumber)"
              inputmode="numeric"
              class="max-md:min-h-11 max-md:text-lg pr-10"
            />
          </FormControl>
        </div>

        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>

        <div class="flex flex-wrap gap-1 w-full">
          <Button
            class="px-2 py-1 max-md:text-base"
            v-for="amount in PAYMENT_AMOUNTS"
            :key="amount.label"
            :variant="currencyNumber === amount.value ? 'secondary' : 'outline'"
            size="sm"
            @click="selectAmount(amount.value)"
          >
            {{ amount.label }}
          </Button>
        </div>
      </FormItem>
    </FormField>

    <FormField :rules="toTypedSchema(typeSchema)" v-slot="{ value, setValue }" name="type">
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 max-md:text-lg">Способ оплаты</FormLabel>

        <FormControl>
          <div class="flex flex-col gap-2">
            <CheckBlock
              v-for="p in PAYMENT_TYPES"
              :key="p.type"
              class="w-full px-3 flex-1 max-md:min-h-14"
              @onCheck="(check: boolean) => check ? setValue(p.type) : setValue(undefined)"
              :showCheckbox="false"
              :checked="p.type === value"
            >
              <template #content>
                <div class="flex w-full max-md:text-lg font-normal gap-3 items-center">
                  <img :src="p.icon" :alt="p.type" class="size-6 max-md:size-7" />
                  {{ p.name }}
                </div>
              </template>
            </CheckBlock>
          </div>
        </FormControl>
        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>

    <FormField
      :rules="toTypedSchema(noteSchema)"
      v-slot="{ componentField }"
      :validate-on-blur="!donorPay.isFieldDirty"
      name="note"
    >
      <FormItem class="gap-1">
        <FormControl>
          <Textarea
            :placeholder="placeholders.get(donationStore.blankForm.isGroup || false)"
            v-bind="componentField"
            class="resize-none min-h-24 text-sm max-md:text-base"
          />
        </FormControl>
        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>
  </div>
</template>
