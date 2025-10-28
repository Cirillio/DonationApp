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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckBlock } from '@/components/ui/checkblock'
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

const getPaymentAmountButtonVariant = (amountValue: number): 'outline-primary' | 'outline' =>
  isAmountSelected(amountValue) ? 'outline-primary' : 'outline'

const clearNumberValueWatch = watch(numberValue, (value) => {
  form.value.amount = value ?? 0
  donationStore.clearFieldError('payment', 'amount')
})

const clearFormAmountWatch = watch(
  () => form.value.amount,
  (value) => {
    if (value !== numberValue.value) {
      setValue(value ? value : null)
    }
  },
  { immediate: true }
)

const selectPaymentType = (type: PaymentType | undefined) => {
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
  <div class="flex flex-col gap-6">
    <!-- Amount Field -->
    <div class="flex flex-col gap-1">
      <label
        class="label-required gap-0.5 text-lg font-medium text-foreground"
        :class="[errors.amount && '!text-destructive']"
        >Выберите сумму</label
      >

      <div class="flex flex-wrap gap-1 w-full">
        <Button
          v-for="amount in PAYMENT_AMOUNTS"
          :key="amount.label"
          :variant="getPaymentAmountButtonVariant(amount.value)"
          class="py-4 text-lg text-foreground px-9 max-sm:flex-1"
          @click="selectAmount(amount.value)"
        >
          {{ amount.label }}
        </Button>
      </div>

      <label class="label-required mt-5 gap-0.5 text-lg font-medium text-foreground">
        Или укажите свою сумму
      </label>

      <div class="relative">
        <Input
          ref="inputRef"
          :model-value="formattedValue ?? ''"
          @update:model-value="(val) => (formattedValue = String(val))"
          inputmode="numeric"
          placeholder="100,00"
          :aria-invalid="!!errors.amount"
          class="max-md:min-h-11 text-lg pr-10"
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
    </div>

    <!-- Payment Method Field -->
    <div class="flex flex-col gap-1">
      <label
        class="label-required gap-1 text-lg flex items-center font-medium text-foreground"
        :class="[errors.type && '!text-destructive']"
      >
        <span class="iconify f7--creditcard size-6"></span>
        Способ оплаты
      </label>

      <div class="flex max-sm:flex-col gap-2">
        <CheckBlock
          v-for="p in PAYMENT_METHODS"
          :key="p.type"
          :checked="p.type === form.type"
          :showCheckbox="false"
          @onCheck="(check: boolean) => selectPaymentType(check ? p.type : undefined)"
          class="w-full flex-1 text-foreground min-h-14"
        >
          <template #content>
            <div class="flex w-full text-lg justify-center font-normal gap-3 items-center">
              <img :src="p.icon" :alt="p.type" class="size-7" />
              {{ p.name }}
            </div>
          </template>
        </CheckBlock>
      </div>
      <AutoAnimated>
        <p v-if="errors.type" class="text-destructive text-base">
          {{ errors.type }}
        </p>
      </AutoAnimated>
    </div>

    <!-- Note/Comment Field -->
    <div class="flex flex-col gap-1">
      <label class="gap-1 text-lg flex items-center font-medium text-foreground">
        <span class="iconify f7--bubble-left size-6"></span>
        Комментарий (необязательно)
      </label>

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
