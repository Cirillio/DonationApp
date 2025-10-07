<script lang="ts" setup>
import { watch, computed } from 'vue'
import { FormField } from '@/shared/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { phoneSchema, nameSchema, birthSchema, isGroupSchema } from '@/domain/blank/schema'
import { BlankSchema } from '@/domain/blank/types'
import { DEFAULT_BLANK_FORM } from '@/domain/blank/config'
import { PHONE_SPECS, DEFAULT_PHONE_SPEC } from '@/features/phone-input/data/phone-specs'
import { useCodeSelector } from '@/features/phone-input/composables/useCodeSelector'
import parsePhoneNumber from 'libphonenumber-js'

const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
} = useCodeSelector({
  defaultId: DEFAULT_PHONE_SPEC.id,
  phoneSpecs: PHONE_SPECS,
})

const donorBlank = useForm<BlankSchema>({
  initialValues: DEFAULT_BLANK_FORM,
  name: 'donationBlank',
})

const resetPhoneField = () => {
  donorBlank.setFieldValue('phone', DEFAULT_BLANK_FORM.phone, false)
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
      v-slot="{ componentField }"
      :rules="toTypedSchema(phoneSchema(() => selectedSpec.code || ''))"
      :validate-on-input="false"
      :validate-on-model-update="false"
      :validate-on-blur="!donorBlank.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 max-md:text-lg">Телефон</FormLabel>
        <div class="flex rounded-md shadow-xs max-md:*:text-lg">
          <div
            class="text-foreground !opacity-100 px-3 flex rounded-md rounded-r-none items-center border-r-0 border border-border"
          >
            {{ selectedSpec.code }}
          </div>

          <FormControl>
            <Input
              v-bind="componentField"
              @paste="onPastePhone"
              :placeholder="selectedSpec.mask"
              v-mask="currentMask"
              name="phone"
              inputmode="tel"
              type="tel"
              class="rounded-none shadow-none max-md:min-h-11"
            />
          </FormControl>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button :variant="'outline'" class="rounded-l-none !shadow-none border-l-0 px-3">
                <Icon class="f7--chevron-down size-4.5 md:size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              :align="'end'"
              class="min-w-[var(--radix-dropdown-menu-trigger-width)] gap-1 duration-150 flex flex-col"
            >
              <DropdownMenuItem
                v-for="spec in PHONE_SPECS"
                :key="spec.id"
                @select="selectPhoneCodeById(spec.id)"
                class="flex gap-1 px-3 text-sm max-md:text-base cursor-pointer"
                :class="{
                  '!bg-secondary !text-secondary-foreground': selectedSpec?.code === spec.code,
                }"
              >
                <span>{{ spec.name }}</span>

                <span class="ml-auto">({{ spec.code }})</span>
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
      v-slot="{ componentField }"
      :rules="toTypedSchema(nameSchema)"
      :validate-on-input="false"
      :validate-on-model-update="false"
      :validate-on-blur="!donorBlank.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-optional gap-0.5 max-md:text-lg">Имя</FormLabel>

        <FormControl>
          <Input
            v-bind="componentField"
            placeholder="Хотя бы 3 символа"
            type="text"
            class="max-md:min-h-11 max-md:text-lg"
            name="name"
          />
        </FormControl>

        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>
        <FormDescription class="max-md:!text-sm">Оставьте пустым для анонимности</FormDescription>
      </FormItem>
    </FormField>

    <FormField
      name="birth"
      :rules="toTypedSchema(birthSchema)"
      :validate-on-input="false"
      :validate-on-blur="!donorBlank.isFieldDirty"
      v-slot="{ componentField }"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 max-md:text-lg">Дата рождения</FormLabel>

        <FormControl>
          <Input
            v-model="componentField.modelValue"
            @change="componentField.onChange"
            @blur="componentField.onBlur"
            type="text"
            placeholder="дд.мм.гггг"
            name="birth"
            v-mask="'##.##.####'"
            inputmode="numeric"
            class="max-md:min-h-11 max-md:text-lg"
          />
        </FormControl>
        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>

    <FormField
      name="isGroup"
      v-slot="{ componentField }"
      :rules="toTypedSchema(isGroupSchema)"
      :validate-on-blur="!donorBlank.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormControl>
          <div class="flex flex-col">
            <CheckBlock class="w-full max-md:!min-h-11" :size="'default'" v-bind="componentField">
              <template v-slot:content>
                <Icon class="f7--person-2 size-6" />
                <span class="max-md:text-lg font-normal">От лица группы</span>
              </template>
            </CheckBlock>
          </div>
        </FormControl>
        <FormDescription class="max-md:!text-sm"
          >Отметьте, если участвует коллектив</FormDescription
        >
        <AutoAnimated>
          <FormMessage class="max-md:!text-sm" />
        </AutoAnimated>
      </FormItem>
    </FormField>
  </div>
</template>
