<script lang="ts" setup>
/**
 * DonationBlank - Step 1: Personal Information Form
 *
 * Collects basic donor information:
 * - Phone number with country code selection (RU/TJ)
 * - Name (optional)
 * - Birth date (required, age validation 18-100)
 * - Group donation checkbox
 *
 * Form Synchronization:
 * - Uses vee-validate for validation
 * - Syncs with donation store via watchers (two-way binding)
 * - No keepValuesOnUnmount - store handles persistence
 *
 * Special Features:
 * - Phone number paste detection and parsing
 * - Country-specific phone validation and masking
 * - Auto-reset phone field when country changes
 */
import { watch, onUnmounted } from 'vue'
import { FormField } from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { phoneSchema, nameSchema, birthSchema, isGroupSchema } from '@/lib/validations'
import { usePhone } from '@/composables/usePhone'
import { DEFAULT_BLANK_FORM, DEFAULT_PHONE_SPEC, PHONE_SPECS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { useForm } from 'vee-validate'
import { BlankFormValues } from '@/lib/types'

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
const blankForm = useForm<BlankFormValues>({
  name: 'blank',
  initialValues: donationStore.formData.blank,
  keepValuesOnUnmount: false,
})

/**
 * Two-way sync: form values -> store
 * Watch form values and update store when they change
 */
const stopWatchValues = watch(
  () => blankForm.values,
  (newValues) => {
    donationStore.updateFormValues('blank', newValues)
  },
  { deep: true }
)

/**
 * Two-way sync: form meta -> store
 * Watch form meta (validation state) and update store
 */
const stopWatchMeta = watch(
  () => blankForm.meta.value,
  (newMeta) => {
    donationStore.syncFormMeta('blank', {
      valid: newMeta.valid,
      dirty: newMeta.dirty,
      touched: newMeta.touched,
    })
  },
  { deep: true, immediate: true }
)

/**
 * Phone input helper composable
 * Provides country selection, masking, and clipboard parsing
 */
const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
  parsePhoneFromClipboard,
} = usePhone({
  defaultId: blankForm.values.phoneCountry || DEFAULT_PHONE_SPEC.id,
})

/**
 * Reset phone field when country changes
 *
 * Clears phone input and resets validation state silently
 * (doesn't show error message immediately).
 */
const resetPhoneField = () => {
  blankForm.resetField('phone', {
    value: DEFAULT_BLANK_FORM.phone,
  })
  blankForm.validateField('phone', {
    mode: 'silent',
  })
}

/**
 * Handle phone paste from clipboard
 *
 * Parses international format phone numbers (e.g., +79001234567)
 * and extracts just the number part for the input field.
 *
 * @param e - Clipboard paste event
 */
const onPastePhone = (e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const parsed = parsePhoneFromClipboard(pasted)
  if (parsed) {
    blankForm.setFieldValue('phone', parsed)
  }
}

/**
 * Watch for country code changes
 *
 * When user selects different country, update phoneCountry field
 * and reset phone input since format requirements changed.
 */
const stopPhoneSpecWatch = watch(selectedSpec, (spec) => {
  blankForm.setFieldValue('phoneCountry', spec.id)
  resetPhoneField()
})

/**
 * Cleanup all watchers on unmount
 *
 * Critical for preventing memory leaks!
 * Stops all watch functions that were set up:
 * - stopWatchValues: form values -> store sync
 * - stopWatchMeta: form meta -> store sync
 * - stopPhoneSpecWatch: country code change handler
 *
 * Without cleanup, watchers would continue running even after
 * component is destroyed, causing memory leaks and unexpected updates.
 */
onUnmounted(() => {
  stopWatchValues()
  stopWatchMeta()
  stopPhoneSpecWatch()
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField
      name="phone"
      :rules="toTypedSchema(phoneSchema(() => selectedSpec.code || ''))"
      :validate-on-input="false"
      :validate-on-model-update="false"
      :validate-on-blur="!blankForm.isFieldDirty"
      v-slot="{ componentField }"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-1 text-lg">
          <span class="iconify f7--phone size-6"></span>
          Телефон</FormLabel
        >

        <div class="flex gap-2 *:text-lg">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button :variant="'outline'" class="gap-2 px-3">
                {{ selectedSpec.code }}
                <Icon class="f7--chevron-down size-4.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              :align="'start'"
              class="duration-150 shadow-lg shadow-primary/15 bg-card/70 backdrop-blur-xs gap-2 p-2 ease-linear flex flex-col"
            >
              <DropdownMenuItem
                v-for="spec in PHONE_SPECS"
                :key="spec.id"
                @select="selectPhoneCodeById(spec.id)"
                class="cursor-pointer p-0"
              >
                <Button
                  :variant="selectedSpec?.code === spec.code ? 'default' : 'link'"
                  class="w-full text-start max-sm:text-lg grid grid-cols-3 gap-2 duration-700"
                >
                  <span>({{ spec.code }})</span>
                  <span class="col-span-2">{{ spec.name }}</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FormControl>
            <Input
              v-model="componentField.modelValue"
              @blur="componentField.onBlur"
              @change="componentField.onChange"
              @paste="onPastePhone"
              :placeholder="selectedSpec.mask"
              v-mask="currentMask"
              name="phone"
              inputmode="tel"
              type="tel"
              class="shadow-none text-lg max-md:min-h-11"
            />
          </FormControl>
        </div>
        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>

    <FormField
      name="name"
      :rules="toTypedSchema(nameSchema)"
      :validate-on-input="false"
      :validate-on-model-update="false"
      :validate-on-blur="!blankForm.isFieldDirty"
      v-slot="{ componentField }"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-optional gap-1 text-lg">
          <span class="iconify f7--person size-6"></span>

          Имя</FormLabel
        >

        <FormControl>
          <Input
            v-model="componentField.modelValue"
            @blur="componentField.onBlur"
            @change="componentField.onChange"
            placeholder="Хотя бы 3 символа"
            type="text"
            class="max-md:min-h-11 text-lg"
            name="name"
          />
        </FormControl>

        <AutoAnimated>
          <FormMessage class="text-base" />
        </AutoAnimated>
        <FormDescription class="text-base max-md:!text-sm"
          >Оставьте пустым для анонимности</FormDescription
        >
      </FormItem>
    </FormField>

    <FormField
      name="birth"
      v-slot="{ componentField }"
      :rules="toTypedSchema(birthSchema)"
      :validate-on-input="false"
      :validate-on-blur="!blankForm.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-1 text-lg">
          <span class="iconify f7--calendar-today size-6"></span>

          Дата рождения</FormLabel
        >

        <FormControl>
          <Input
            v-model="componentField.modelValue"
            @blur="componentField.onBlur"
            @change="componentField.onChange"
            type="text"
            placeholder="дд.мм.гггг"
            name="birth"
            v-mask="'##.##.####'"
            inputmode="numeric"
            class="max-md:min-h-11 text-lg"
          />
        </FormControl>
        <AutoAnimated>
          <FormMessage class="text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>

    <FormField name="isGroup" v-slot="{ componentField }" :rules="toTypedSchema(isGroupSchema)">
      <FormItem class="gap-1">
        <FormControl>
          <div class="flex flex-col">
            <CheckBlock class="w-full min-h-12" :size="'default'" v-bind="componentField">
              <template v-slot:content>
                <Icon class="f7--person-2 size-7" />
                <span class="text-lg font-normal">От лица группы</span>
              </template>
            </CheckBlock>
          </div>
        </FormControl>
        <FormDescription class="max-md:!text-sm"
          >Отметьте, если участвует коллектив</FormDescription
        >
        <AutoAnimated>
          <FormMessage class="text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>
  </div>
</template>
