<script lang="ts" setup>
/**
 * DonationPay - Step 2: Payment Form
 *
 * Collects payment information:
 * - Amount (required, min 100 RUB) with preset buttons and custom input
 * - Payment method (СБП or Bank Card)
 * - Optional comment/note (max 200 chars)
 *
 * Form Management:
 * - Direct v-model binding to store.formData.payment
 * - No vee-validate, no watchers, no complexity
 * - Validation happens on submit via store.validatePayment()
 *
 * Special Features:
 * - Quick-select amount buttons (100, 500, 1000, 2500, 5000, 10000)
 * - Custom amount input with vue-currency-input formatting
 * - Bidirectional sync between buttons and input field
 * - Visual payment method selection with icons
 */
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input'
import { PAYMENT_AMOUNTS, PAYMENT_METHODS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/ui/icon'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PaymentType } from '@/lib/types'
import AutoAnimated from '@/components/ui/auto-animated/AutoAnimated.vue'

const donationStore = useDonationStore()

const form = computed(() => donationStore.formData.payment)
const errors = computed(() => donationStore.fieldErrors.payment)

const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput({
  currency: 'RUB',
  currencyDisplay: CurrencyDisplay.hidden,
  precision: 2,
})

const selectAmount = (amount: number) => {
  form.value.amount = amount
  donationStore.clearFieldError('payment', 'amount')
}

const isAmountSelected = (amount: number) => form.value.amount === amount

const getPaymentAmountButtonVariant = (amountValue: number): 'default' | 'soft' =>
  isAmountSelected(amountValue) ? 'default' : 'soft'

const clearNumberValueWatch = watch(numberValue, value => {
  form.value.amount = value ?? 0
  donationStore.clearFieldError('payment', 'amount')
})

const clearFormAmountWatch = watch(
  () => form.value.amount,
  value => {
    if (value !== numberValue.value) {
      setValue(value ? value : null)
    }
  },
  { immediate: true }
)

const selectPaymentType = (type: PaymentType | undefined) => {
  if (form.value.type === type) return
  form.value.type = type
  donationStore.clearFieldError('payment', 'type')
}

onMounted(() => {
  if (form.value.amount) {
    formattedValue.value = String(form.value.amount)
  }
})

onUnmounted(() => {
  clearNumberValueWatch()
  clearFormAmountWatch()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Amount Field -->
    <div class="flex flex-col gap-2">
      <label for="form-amount" class="flex w-fit text-lg font-medium items-center label-required">
        <Icon class="f7--money-rubl size-6 mr-1" />
        Сумма</label
      >
      <div class="relative">
        <Input
          ref="inputRef"
          id="form-amount"
          :model-value="formattedValue ?? ''"
          @update:model-value="val => (formattedValue = String(val))"
          inputmode="numeric"
          placeholder="100,00"
          :aria-invalid="!!errors.amount"
          class="text-lg! h-10 px-3!"
        />
        <span
          class="iconify text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 f7--money-rubl size-6"
        ></span>
      </div>

      <AutoAnimated>
        <p v-if="errors.amount" class="text-destructive text-base">
          {{ errors.amount }}
        </p>
      </AutoAnimated>

      <div class="flex flex-wrap gap-1 w-full">
        <Button
          v-for="amount in PAYMENT_AMOUNTS"
          :key="amount.label"
          :variant="getPaymentAmountButtonVariant(amount.value)"
          class="text-base max-sm:flex-1"
          @click="selectAmount(amount.value)"
        >
          {{ amount.label }}
        </Button>
      </div>
    </div>

    <!-- Payment Method Field -->
    <div class="flex flex-col gap-1">
      <label class="flex w-fit text-lg font-medium items-center label-required">
        <Icon class="f7--creditcard size-6 mr-1" />
        Способ оплаты</label
      >

      <div class="flex max-sm:flex-col gap-2">
        <Button
          v-for="p in PAYMENT_METHODS"
          :key="p.type"
          class="w-full flex-1 min-h-14"
          @click="selectPaymentType(p.type)"
          :variant="form.type === p.type ? 'default' : 'soft'"
        >
          <div class="flex w-full text-lg justify-center font-normal gap-3 items-center">
            <img :src="p.icon" :alt="p.type" class="size-6" />
            {{ p.name }}
          </div>
        </Button>
      </div>
      <AutoAnimated>
        <p v-if="errors.type" class="text-destructive text-base">
          {{ errors.type }}
        </p>
      </AutoAnimated>
    </div>

    <!-- Note/Comment Field -->
    <div class="flex flex-col gap-1">
      <p class="text-muted-foreground font-medium max-md:!text-sm">Комментарий (необязательно)</p>

      <Textarea
        v-model="form.note"
        @input="donationStore.clearFieldError('payment', 'note')"
        placeholder="Можете указать пожелания или список участников, если участвует коллектив."
        :aria-invalid="!!errors.note"
        class="resize-none min-h-32 text-base"
      />

      <AutoAnimated>
        <p v-if="errors.note" class="text-destructive text-sm">
          {{ errors.note }}
        </p>
      </AutoAnimated>
    </div>
  </div>
</template>
