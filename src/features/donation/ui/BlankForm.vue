<script lang="ts" setup>
import { watch, computed } from 'vue'
import { FormField } from '@/shared/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { phoneSchema, nameSchema, birthSchema, isGroupSchema } from '@/domain/blank/schema'
import { BlankFormValues } from '@/domain/blank/types'
import { DEFAULT_BLANK_FORM } from '@/domain/blank/config'
import { useCodeSelector } from '@/features/phone-input/composables/useCodeSelector'
import parsePhoneNumber from 'libphonenumber-js'
import { DEFAULT_PHONE_SPEC, PHONE_SPECS } from '@/domain/phone-input/config'

const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
} = useCodeSelector({
  defaultId: DEFAULT_PHONE_SPEC.id,
  phoneSpecs: PHONE_SPECS,
})

const donorBlank = useForm<BlankFormValues>({
  initialValues: DEFAULT_BLANK_FORM,
  name: 'donationBlank',
})

const resetPhoneField = () => {
  donorBlank.resetField('phone', {
    value: DEFAULT_BLANK_FORM.phone,
  })
  donorBlank.validateField('phone', {
    mode: 'silent',
  })
}

watch(selectedSpec, () => resetPhoneField(), {
  immediate: true,
})

defineExpose({
  isValid: computed(() => donorBlank.meta.value.valid),
  values: computed(() => donorBlank.values),
  reset: () => donorBlank.resetForm({ values: DEFAULT_BLANK_FORM }),
})

const onPastePhone = (e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const parsed = parsePhoneNumber(pasted, selectedSpec.value.id)
  if (parsed) {
    const formatted = parsed.formatInternational()
    const phone = formatted.replace(selectedSpec.value.code, '')
    donorBlank.setFieldValue('phone', phone)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormField
      name="phone"
      :rules="toTypedSchema(phoneSchema(() => selectedSpec.code || ''))"
      :validate-on-input="false"
      :validate-on-model-update="false"
      :validate-on-blur="!donorBlank.isFieldDirty"
      v-slot="{ componentField }"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 text-lg">Телефон</FormLabel>
        <div class="flex rounded-md shadow-xs *:text-lg">
          <div
            class="text-foreground !opacity-100 px-3 flex rounded-md rounded-r-none items-center border-r-0 border border-border"
          >
            {{ selectedSpec.code }}
          </div>

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
              class="rounded-none shadow-none text-lg max-md:min-h-11"
            />
          </FormControl>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button :variant="'outline'" class="rounded-l-none !shadow-none border-l-0 px-3">
                <Icon class="f7--chevron-down size-4.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent :align="'end'" class="duration-75 ease-linear flex flex-col">
              <DropdownMenuItem
                v-for="spec in PHONE_SPECS"
                :key="spec.id"
                @select="selectPhoneCodeById(spec.id)"
                class="cursor-pointer p-0"
              >
                <Button
                  :variant="selectedSpec?.code === spec.code ? 'secondary' : 'outline'"
                  class="w-full space-x-1 rounded-none duration-300 border-0"
                  size="lg"
                >
                  <span>{{ spec.name }}</span>
                  <span class="ml-auto">({{ spec.code }})</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <FormLabel class="label-optional gap-0.5 text-lg">Имя</FormLabel>

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
        <FormDescription class="text-base">Оставьте пустым для анонимности</FormDescription>
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
        <FormLabel class="label-required gap-0.5 text-lg">Дата рождения</FormLabel>

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
