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
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useCurrencyInput, CurrencyDisplay } from "vue-currency-input";
import { PAYMENT_AMOUNTS, PAYMENT_METHODS } from "@/lib/constants";
import { useDonationStore } from "@/stores/donation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/lib/types";
import AutoAnimated from "@/components/ui/auto-animated/AutoAnimated.vue";

const donationStore = useDonationStore();

const form = computed(() => donationStore.formData.payment);
const errors = computed(() => donationStore.fieldErrors.payment);

const { formattedValue, inputRef, numberValue, setValue } = useCurrencyInput({
  currency: "RUB",
  currencyDisplay: CurrencyDisplay.hidden,
  precision: 2,
});

const selectAmount = (amount: number) => {
  form.value.amount = amount;
  donationStore.clearFieldError("payment", "amount");
};

const isAmountSelected = (amount: number) => form.value.amount === amount;

const getPaymentAmountButtonVariant = (
  amountValue: number
): "outline-primary" | "outline" =>
  isAmountSelected(amountValue) ? "outline-primary" : "outline";

const clearNumberValueWatch = watch(numberValue, (value) => {
  form.value.amount = value ?? 0;
  donationStore.clearFieldError("payment", "amount");
});

const clearFormAmountWatch = watch(
  () => form.value.amount,
  (value) => {
    if (value !== numberValue.value) {
      setValue(value ? value : null);
    }
  },
  { immediate: true }
);

const selectPaymentType = (type: PaymentType | undefined) => {
  if (form.value.type === type) return;
  form.value.type = type;
  donationStore.clearFieldError("payment", "type");
};

onMounted(() => {
  if (form.value.amount) {
    formattedValue.value = String(form.value.amount);
  }
});

onUnmounted(() => {
  clearNumberValueWatch();
  clearFormAmountWatch();
});
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- Amount Field -->
    <div class="flex flex-col gap-2">
      <div class="relative mt-4">
        <Input
          ref="inputRef"
          :model-value="formattedValue ?? ''"
          @update:model-value="(val) => (formattedValue = String(val))"
          inputmode="numeric"
          placeholder="Сумма пожертвования*"
          :aria-invalid="!!errors.amount"
          class="max-md:min-h-11 text-xl pr-10"
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

      <div class="flex flex-wrap gap-1 mt-2 w-full">
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
    </div>

    <!-- Payment Method Field -->
    <div class="flex flex-col gap-1">
      <p class="text-muted-foreground font-medium max-md:!text-sm">Способ оплаты*</p>

      <div class="flex max-sm:flex-col gap-2">
        <Button
          v-for="p in PAYMENT_METHODS"
          :key="p.type"
          class="w-full flex-1 text-foreground min-h-14"
          @click="selectPaymentType(p.type)"
          :variant="form.type === p.type ? 'outline-primary' : 'outline'"
        >
          <div class="flex w-full text-lg justify-center font-normal gap-3 items-center">
            <img :src="p.icon" :alt="p.type" class="size-7" />
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
      <p class="text-muted-foreground font-medium max-md:!text-sm">
        Комментарий (необязательно) p
      </p>

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
