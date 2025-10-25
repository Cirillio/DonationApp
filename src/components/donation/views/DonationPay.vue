<script lang="ts" setup>
/*
 * DonationPay - Step 2: Payment Form
 *
 * Collects payment information:
 * - Amount (required, min 100 RUB) with preset buttons and custom input
 * - Payment method (СБП or Bank Card)
 * - Optional comment/note (max 200 chars)
 *
 * Form Synchronization:
 * - Uses vee-validate for validation
 * - Syncs with donation store via watchers (two-way binding)
 * - No keepValuesOnUnmount - store handles persistence
 *
 * Special Features:
 * - Quick-select amount buttons (100, 500, 1000, 2500, 5000, 10000)
 * - Custom amount input with vue-currency-input formatting
 * - Bidirectional sync between buttons and input field
 * - Visual payment method selection with icons
 */
import { FormField } from '@/components/ui/form'
import { watch, onUnmounted } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input'
import { PAYMENT_AMOUNTS, PAYMENT_METHODS } from '@/lib/constants'
import { amountSchema, noteSchema, typeSchema } from '@/lib/validations'
import { useDonationStore } from '@/stores/donation'
import { useForm } from 'vee-validate'
import { PaymentFormValues } from '@/lib/types'

const donationStore = useDonationStore()

/**
 * Initialize form with values from store
 *
 * keepValuesOnUnmount is false because we handle persistence manually:
 * - Store is the single source of truth
 * - Form watches sync values back to store
 * - On mount, form initializes from store values
 * - On unmount, values already in store, no action needed
 */
const paymentForm = useForm<PaymentFormValues>({
  name: 'payment',
  initialValues: donationStore.formData.payment,
  keepValuesOnUnmount: false,
})

/**
 * Two-way sync: form values -> store
 * Watch form values and update store when they change
 */
const stopWatchValues = watch(
  () => paymentForm.values,
  (newValues) => {
    donationStore.updateFormValues('payment', newValues)
  },
  { deep: true }
)

/**
 * Two-way sync: form meta -> store
 * Watch form meta (validation state) and update store
 */
const stopWatchMeta = watch(
  () => paymentForm.meta.value,
  (newMeta) => {
    donationStore.syncFormMeta('payment', {
      valid: newMeta.valid,
      dirty: newMeta.dirty,
      touched: newMeta.touched,
    })
  },
  { deep: true, immediate: true }
)

/**
 * Currency input composable for amount field
 * Provides formatted display, numeric value parsing, and RUB currency handling
 */
const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput({
  currency: 'RUB',
  currencyDisplay: CurrencyDisplay.hidden,
  precision: 2,
})

/**
 * Select preset amount button
 *
 * Sets form amount value when user clicks quick-select button.
 * This will also sync the currency input via the watch below.
 *
 * @param amount - Amount to set (e.g., 100, 500, 1000)
 */
const selectAmount = (amount: number) => {
  paymentForm.setFieldValue('amount', amount)
}

/**
 * Check if given amount is currently selected
 *
 * Used to determine button variant (highlighted vs outline).
 *
 * @param amount - Amount to check
 * @returns True if this amount matches current form value
 */
const isAmountSelected = (amount: number) => paymentForm.values.amount === amount

/**
 * Get button variant based on selection state
 *
 * Returns 'secondary' for selected amount, 'outline' for others.
 *
 * @param amountValue - Amount value to check
 * @returns Button variant name
 */
const getPaymentAmountButtonVariant = (amountValue: number): 'secondary' | 'outline' =>
  isAmountSelected(amountValue) ? 'secondary' : 'outline'

/**
 * Sync currency input to form
 *
 * When user types in custom amount field, update vee-validate form value.
 * Note: validation set to false to prevent eager validation during typing.
 */
const stopNumberWatch = watch(numberValue, (value) => {
  paymentForm.setFieldValue('amount', value ?? 0, false)
})

/**
 * Sync form to currency input
 *
 * When form value changes (e.g., from preset button click),
 * update the currency input display. Prevents infinite loop
 * by checking if values actually differ.
 */
const stopFormAmountWatch = watch(
  () => paymentForm.values.amount,
  (value) => {
    if (value !== numberValue.value) {
      setValue(value ? value : null)
    }
  }
)

/**
 * Cleanup all watchers on unmount
 *
 * Critical for preventing memory leaks!
 * Stops all watch functions that were set up:
 * - stopWatchValues: form values -> store sync
 * - stopWatchMeta: form meta -> store sync
 * - stopNumberWatch: currency input -> form sync
 * - stopFormAmountWatch: form -> currency input sync
 *
 * Without cleanup, watchers would continue running even after
 * component is destroyed, causing memory leaks and unexpected updates.
 */
onUnmounted(() => {
  stopWatchValues()
  stopWatchMeta()
  stopNumberWatch()
  stopFormAmountWatch()
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField
      name="amount"
      :rules="toTypedSchema(amountSchema)"
      :validate-on-blur="!paymentForm.isFieldDirty"
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
      :validate-on-blur="!paymentForm.isFieldDirty"
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
