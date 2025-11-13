<script lang="ts" setup>
import { computed, onUnmounted, watch } from "vue";
import { usePhone } from "@/composables/usePhone";
import { DEFAULT_BLANK_FORM, DEFAULT_PHONE_SPEC, PHONE_SPECS } from "@/lib/constants";
import { useDonationStore } from "@/stores/donation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Checkbox } from "@/components/ui/checkbox";
import SubLabelError from "@/components/common/SubLabelError.vue";
import DateInput from "@/components/common/DateInput.vue";
import PhoneCountrySelector from "@/components/common/PhoneCountrySelector.vue";
import { PhoneSpecId } from "@/lib/types";

const donationStore = useDonationStore();

const form = computed(() => donationStore.formData.blank);
const errors = computed(() => donationStore.fieldErrors.blank);

const { selectedSpec, currentMask, selectById, parsePhoneFromClipboard } = usePhone({
  defaultId: form.value.phoneCountry || DEFAULT_PHONE_SPEC.id,
});

// Синхронизируем selectedSpec с form.phoneCountry
const countryCodeWatch = watch(
  () => form.value.phoneCountry,
  (newCountry) => {
    if (newCountry && newCountry !== selectedSpec.value.id) {
      selectById(newCountry);
    }
  },
  { immediate: true }
);

const anonymousWatch = watch(
  () => donationStore.isBlankAnonymous,
  (isAnonymous) => {
    if (isAnonymous) {
      form.value.name = "";
      donationStore.clearFieldError("blank", "name");
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  countryCodeWatch();
  anonymousWatch();
});

const resetPhoneField = () => {
  form.value.phone = DEFAULT_BLANK_FORM.phone;
  donationStore.clearFieldError("blank", "phone");
};

const onPastePhone = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasted = e.clipboardData?.getData("text") || "";
  const parsed = parsePhoneFromClipboard(pasted);
  if (parsed) {
    form.value.phone = parsed;
  }
};

const onCountryChange = (countryId: PhoneSpecId) => {
  form.value.phoneCountry = countryId;
  resetPhoneField();
};
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- Phone Field -->

    <div class="flex flex-col gap-1">
      <div class="flex relative rounded-md items-center gap-2 *:text-lg">
        <PhoneCountrySelector
          v-model="form.phoneCountry"
          :specs="PHONE_SPECS"
          @update:model-value="onCountryChange"
        >
          <template #trigger="{ selectedSpec }">
            <Button
              variant="ghost"
              class="gap-2 !text-xl shadow-none transition-all duration-150"
            >
              {{ selectedSpec.code }}
              <Icon class="f7--chevron-down size-4.5" />
            </Button>
          </template>
        </PhoneCountrySelector>

        <Input
          v-model="form.phone"
          @paste="onPastePhone"
          @input="donationStore.clearFieldError('blank', 'phone')"
          :placeholder="'Номер телефона*'"
          v-mask="currentMask"
          name="phone"
          inputmode="tel"
          type="tel"
          :aria-invalid="!!errors.phone"
          class="text-xl max-md:min-h-11 rounded-l-none shadow-none"
        />
      </div>
      <SubLabelError :error="errors.phone" />
    </div>

    <!-- Name Field -->
    <div class="flex flex-col gap-2">
      <Input
        v-model="form.name"
        @input="donationStore.clearFieldError('blank', 'name')"
        placeholder="ФИО*"
        type="text"
        :aria-invalid="!!errors.name"
        class="max-md:min-h-11 text-xl"
        name="name"
        :disabled="donationStore.isBlankAnonymous"
      />

      <SubLabelError :error="errors.name" />

      <div class="flex items-center space-x-3">
        <Checkbox
          v-model="donationStore.isBlankAnonymous"
          id="anonimous"
          class="size-5"
        />
        <label for="anonimous" class="text-lg font-normal text-foreground cursor-pointer">
          Анонимно
        </label>
      </div>
    </div>

    <!-- Birth Date Field -->

    <div class="flex flex-col gap-1">
      <p class="text-muted-foreground font-medium max-md:!text-sm">Дата рождения*</p>
      <DateInput
        v-model="form.birth"
        :aria-invalid="!!errors.birth"
        @input="donationStore.clearFieldError('blank', 'birth')"
        class="max-md:min-h-11 text-xl"
      />

      <SubLabelError :error="errors.birth" />
    </div>

    <!-- Group Checkbox -->

    <div class="flex flex-col gap-1">
      <div class="flex items-center space-x-3">
        <Checkbox id="group" v-model:checked="form.isGroup" />
        <label for="group" class="text-xl font-normal text-foreground cursor-pointer">
          В пожертвовании участвует несколько человек
        </label>
      </div>
    </div>
  </div>
</template>
