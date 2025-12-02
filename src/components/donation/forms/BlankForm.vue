<script lang="ts" setup>
import { computed, onUnmounted, watch } from 'vue'
import { usePhone } from '@/composables/usePhone'
import { DEFAULT_BLANK_FORM, DEFAULT_PHONE_SPEC, PHONE_SPECS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import SubLabelError from '@/components/common/SubLabelError.vue'
import PhoneCountrySelector from '@/components/common/PhoneCountrySelector.vue'
import { PhoneSpecId } from '@/lib/types'

const donationStore = useDonationStore()

const form = computed(() => donationStore.formData.blank)
const errors = computed(() => donationStore.fieldErrors.blank)

const { selectedSpec, currentMask, selectById, parsePhoneFromClipboard } = usePhone({
  defaultId: form.value.phoneCountry || DEFAULT_PHONE_SPEC.id,
})

// Синхронизируем selectedSpec с form.phoneCountry
const countryCodeWatch = watch(
  () => form.value.phoneCountry,
  newCountry => {
    if (newCountry && newCountry !== selectedSpec.value.id) {
      selectById(newCountry)
    }
  },
  { immediate: true }
)

const anonymousWatch = watch(
  () => donationStore.isBlankAnonymous,
  isAnonymous => {
    if (isAnonymous) {
      form.value.name = ''
      donationStore.clearFieldError('blank', 'name')
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  countryCodeWatch()
  anonymousWatch()
})

const resetPhoneField = () => {
  form.value.phone = DEFAULT_BLANK_FORM.phone
  donationStore.clearFieldError('blank', 'phone')
}

const onPastePhone = (e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const parsed = parsePhoneFromClipboard(pasted)
  if (parsed) {
    form.value.phone = parsed
  }
}

const onCountryChange = (countryId: PhoneSpecId) => {
  form.value.phoneCountry = countryId
  resetPhoneField()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Phone Field -->

    <div class="flex flex-col gap-1">
      <label for="form-phone" class="flex w-fit text-lg font-medium items-center label-required">
        <Icon class="f7--phone size-6 mr-1" />
        Номер телефона</label
      >
      <div class="flex relative rounded-md items-center gap-2">
        <PhoneCountrySelector
          v-model="form.phoneCountry"
          :specs="PHONE_SPECS"
          @update:model-value="onCountryChange"
        >
          <template #trigger="{ selectedSpec }">
            <Button variant="soft" class="gap-2 px-3 h-10 text-lg transition-all duration-150">
              <Icon class="f7--chevron-down size-5" />
              {{ selectedSpec.code }}
            </Button>
          </template>
        </PhoneCountrySelector>

        <Input
          v-model="form.phone"
          @paste="onPastePhone"
          @input="donationStore.clearFieldError('blank', 'phone')"
          :placeholder="currentMask"
          v-maska
          :data-maska="currentMask"
          name="phone"
          inputmode="tel"
          id="form-phone"
          type="tel"
          :aria-invalid="!!errors.phone"
          class="text-lg! h-10 px-3!"
        />
      </div>
      <SubLabelError :error="errors.phone" />
    </div>

    <!-- Name Field -->
    <div class="flex flex-col gap-2">
      <label
        for="form-name"
        class="flex w-fit text-lg font-medium items-center label-optional"
        :class="{
          'opacity-50 select-none pointer-events-none': donationStore.isBlankAnonymous,
        }"
      >
        <Icon class="f7--person size-6 mr-1" />
        Имя</label
      >
      <Input
        v-model="form.name"
        @input="donationStore.clearFieldError('blank', 'name')"
        placeholder="ФИО*"
        type="text"
        :aria-invalid="!!errors.name"
        name="name"
        id="form-name"
        :disabled="donationStore.isBlankAnonymous"
        class="text-lg! h-10 px-3!"
      />

      <SubLabelError :error="errors.name" />

      <div class="flex items-center space-x-3">
        <Checkbox v-model="donationStore.isBlankAnonymous" id="anonimous" class="size-5" />
        <label for="anonimous" class="font-normal text-foreground cursor-pointer"> Анонимно </label>
      </div>
    </div>

    <!-- Birth Date Field -->

    <div class="flex flex-col gap-1">
      <label for="form-birth" class="flex w-fit text-lg font-medium items-center label-required">
        <Icon class="f7--calendar size-6 mr-1" />
        Дата рождения</label
      >
      <Input
        v-model="form.birth"
        @input="donationStore.clearFieldError('blank', 'birth')"
        :aria-invalid="!!errors.birth"
        v-maska
        :data-maska="'##.##.####'"
        data-maska-eager
        type="text"
        placeholder="ДД.ММ.ГГГГ"
        inputmode="numeric"
        name="birth"
        id="form-birth"
        class="text-lg! h-10 px-3!"
      />

      <SubLabelError :error="errors.birth" />
    </div>

    <!-- Group Checkbox -->

    <div class="flex flex-col gap-1">
      <div class="flex items-center space-x-3">
        <Checkbox id="group" v-model="form.isGroup" class="size-5" />
        <label for="group" class="text-base w-fit font-normal text-foreground cursor-pointer">
          В пожертвовании участвует несколько человек
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
