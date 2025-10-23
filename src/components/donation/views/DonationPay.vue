<script lang="ts" setup>
import { FormField } from '@/components/ui/form'
import { computed, onMounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input'
import { PAYMENT_AMOUNTS, DEFAULT_PAY_FORM, PAYMENT_METHODS } from '@/lib/constants'
import { amountSchema, noteSchema, typeSchema } from '@/lib/validations'
import { PaymentFormValues } from '@/lib/types'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'

const donationStore = useDonationStore()
const { paymentForm } = storeToRefs(donationStore)

const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput({
  currency: 'RUB',
  currencyDisplay: CurrencyDisplay.hidden,
  precision: 2,
})

const donorPay = useForm<PaymentFormValues>({
  initialValues: paymentForm.value,
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

onMounted(() => {
  console.log(numberValue.value, donorPay.values.amount)

  formattedValue.value = donorPay.values.amount
    ? donorPay.values.amount.toString().replace('.', ',')
    : null

  console.log(numberValue.value, donorPay.values.amount)
})

// Sync form values to store
watch(
  () => donorPay.values,
  (values) => {
    donationStore.updatePaymentForm(values)
  },
  { deep: true }
)

const selectAmount = (amount: number) => {
  donorPay.setFieldValue('amount', amount)
}

const isAmountSelected = (amount: number) => donorPay.values.amount === amount

const getPaymentAmountButtonVariant = (amountValue: number): 'secondary' | 'outline' =>
  isAmountSelected(amountValue) ? 'secondary' : 'outline'

defineExpose({
  isValid: computed(() => donorPay.meta.value.valid),
  values: computed(() => donorPay.values),
  reset: () => donorPay.resetForm({ values: DEFAULT_PAY_FORM }),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField
      name="amount"
      :rules="toTypedSchema(amountSchema)"
      :validate-on-blur="!donorPay.isFieldDirty"
      v-slot="{ setValue, handleBlur }"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 text-lg">Выберите сумму</FormLabel>

        <div class="flex flex-wrap gap-1 w-full">
          <Button
            v-for="amount in PAYMENT_AMOUNTS"
            :key="amount.label"
            :variant="getPaymentAmountButtonVariant(amount.value)"
            class="py-4 text-lg px-9 max-sm:flex-1"
            @click="selectAmount(amount.value)"
          >
            {{ amount.label }}
          </Button>
        </div>

        <FormLabel class="label-required mt-5 gap-0.5 text-lg">Или укажите свою сумму</FormLabel>

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
          <span
            class="iconify text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 f7--money-rubl size-6"
          ></span>
        </div>

        <AutoAnimated>
          <FormMessage class="text-base" />
        </AutoAnimated>
      </FormItem>
    </FormField>

    <FormField :rules="toTypedSchema(typeSchema)" v-slot="{ value, setValue }" name="type">
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-1 text-lg">
          <span class="iconify f7--creditcard size-6"></span>
          Способ оплаты</FormLabel
        >

        <FormControl>
          <div class="flex max-sm:flex-col gap-2">
            <CheckBlock
              v-for="p in PAYMENT_METHODS"
              :key="p.type"
              :checked="p.type === value"
              :showCheckbox="false"
              @onCheck="(check: boolean) => check ? setValue(p.type) : setValue(undefined)"
              class="w-full flex-1 min-h-14"
            >
              <template #content>
                <div class="flex w-full text-lg justify-center font-normal gap-3 items-center">
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
        <FormLabel class="gap-1 text-lg">
          <span class="iconify f7--bubble-left size-6"></span>
          Комментарий (необязательно)</FormLabel
        >

        <FormControl>
          <Textarea
            placeholder="Можете указать пожелания или список участников, если участвует коллектив."
            v-model="componentField.modelValue"
            @blur="componentField.onBlur"
            @change="componentField.onChange"
            class="resize-none min-h-32 text-base"
          />
        </FormControl>
        <AutoAnimated>
          <FormMessage class="text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>
  </div>
</template>
