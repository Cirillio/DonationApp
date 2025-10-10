<script lang="ts" setup>
import { FormField } from '@/shared/ui/form'
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input'
import { PAYMENT_AMOUNTS, DEFAULT_PAY_FORM, PAYMENT_METHODS } from '@/domain/payment/config'
import { amountSchema, noteSchema, typeSchema } from '@/domain/payment/schema'
import { PaymentFormValues } from '@/domain/payment/types'

const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput({
  currency: 'RUB',
  currencyDisplay: CurrencyDisplay.hidden,
  precision: 2,
})

const donorPay = useForm<PaymentFormValues>({
  initialValues: DEFAULT_PAY_FORM,
  name: 'donationPayment',
})

watch(numberValue, (value) => {
  donorPay.setFieldValue('amount', value ?? 0, false)
})

watch(
  () => donorPay.values.amount,
  (value) => {
    if (value !== numberValue.value) {
      setValue(value ? value : null)
    }
  }
)

const selectAmount = (amount: number) => {
  donorPay.setFieldValue('amount', amount)
}

const isAmountSelected = (amount: number) => numberValue.value === amount

const getPaymentAmountButtonVariant = (amountValue: number): 'secondary' | 'outline' =>
  isAmountSelected(amountValue) ? 'secondary' : 'outline'

defineExpose({
  isValid: computed(() => donorPay.meta.value.valid),
  values: computed(() => donorPay.values),
  reset: () => donorPay.resetForm({ values: DEFAULT_PAY_FORM }),
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormField
      name="amount"
      :rules="toTypedSchema(amountSchema)"
      :validate-on-blur="!donorPay.isFieldDirty"
      v-slot="{ setValue, handleBlur }"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 text-lg">Сумма</FormLabel>
        <div class="relative">
          <FormControl>
            <Input
              @blur="handleBlur"
              @change="() => setValue(numberValue)"
              ref="inputRef"
              v-model="formattedValue"
              inputmode="numeric"
              placeholder="100,00"
              class="max-md:min-h-11 text-lg pr-10"
            />
          </FormControl>
        </div>

        <AutoAnimated>
          <FormMessage class="text-base" />
        </AutoAnimated>

        <div class="flex flex-wrap gap-1 w-full">
          <Button
            v-for="amount in PAYMENT_AMOUNTS"
            :key="amount.label"
            :variant="getPaymentAmountButtonVariant(amount.value)"
            @click="selectAmount(amount.value)"
          >
            {{ amount.label }}
          </Button>
        </div>
      </FormItem>
    </FormField>

    <FormField :rules="toTypedSchema(typeSchema)" v-slot="{ value, setValue }" name="type">
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 text-lg">Способ оплаты</FormLabel>

        <FormControl>
          <div class="flex flex-col gap-2">
            <CheckBlock
              v-for="p in PAYMENT_METHODS"
              :key="p.type"
              :checked="p.type === value"
              :showCheckbox="false"
              @onCheck="(check: boolean) => check ? setValue(p.type) : setValue(undefined)"
              class="w-full px-3 flex-1 min-h-12"
            >
              <template #content>
                <div class="flex w-full text-lg font-normal gap-3 items-center">
                  <img :src="p.icon" :alt="p.type" class="size-7" />
                  {{ p.name }}
                </div>
              </template>
            </CheckBlock>
          </div>
        </FormControl>
        <AutoAnimated>
          <FormMessage class="text-base" />
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
            placeholder="Можете указать пожелания или список участников, если участвует коллектив."
            v-model="componentField.modelValue"
            @blur="componentField.onBlur"
            @change="componentField.onChange"
            class="resize-none min-h-24 text-base"
          />
        </FormControl>
        <AutoAnimated>
          <FormMessage class="text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>
  </div>
</template>
