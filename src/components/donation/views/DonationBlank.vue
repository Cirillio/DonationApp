<script lang="ts" setup>
import { watch } from 'vue'
import { FormField } from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import type { FormContext } from 'vee-validate'
import { phoneSchema, nameSchema, birthSchema, isGroupSchema } from '@/lib/validations'
import { BlankFormValues } from '@/lib/types'
import { DEFAULT_BLANK_FORM } from '@/lib/constants'
import { usePhone } from '@/composables/usePhone'
import { DEFAULT_PHONE_SPEC, PHONE_SPECS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { storeToRefs } from 'pinia'

const donorBlank = defineModel<FormContext<BlankFormValues, BlankFormValues>>({
  required: true,
})

const donationStore = useDonationStore()
const { blankForm } = storeToRefs(donationStore)

const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
  parsePhoneFromClipboard,
} = usePhone({
  defaultId: blankForm.value.phoneCountry || DEFAULT_PHONE_SPEC.id,
})

const resetPhoneField = () => {
  donorBlank.value.resetField('phone', {
    value: DEFAULT_BLANK_FORM.phone,
  })
  donorBlank.value.validateField('phone', {
    mode: 'silent',
  })
}

const onPastePhone = (e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const parsed = parsePhoneFromClipboard(pasted)
  if (parsed) {
    donorBlank.value.setFieldValue('phone', parsed)
  }
}

watch(selectedSpec, (spec) => {
  donorBlank.value.setFieldValue('phoneCountry', spec.id)
  resetPhoneField()
})

// watch(
//   () => donorBlank.values,
//   (values) => {
//     donationStore.updateBlankForm(values)
//   },
//   { deep: true }
// )

watch(
  () => donorBlank.value.meta.value.valid,
  (valid) => {
    donationStore.setStepValidity(1, valid)
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField
      name="phone"
      :rules="toTypedSchema(phoneSchema(() => selectedSpec.code || ''))"
      :validate-on-input="false"
      :validate-on-model-update="false"
      :validate-on-blur="!donorBlank.isFieldDirty"
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
      :validate-on-blur="!donorBlank.isFieldDirty"
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
      :validate-on-blur="!donorBlank.isFieldDirty"
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
