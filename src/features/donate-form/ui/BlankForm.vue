<script lang="ts" setup>
import { FormField } from '@/shared/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import makeBlankSchema from '@/domain/blank/schema'
import { DEFAULT_BLANK_FORM } from '@/domain/blank/default'
import { useForm } from 'vee-validate'
import { PHONE_SPECS, DEFAULT_PHONE_SPEC } from '@/features/phone-input/data/phone-specs'
import { useCodeSelector } from '@/features/phone-input/composables/useCodeSelector'
import parsePhoneNumber from 'libphonenumber-js'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { watch } from 'vue'
import { PhoneSpec } from '@/features/phone-input/model/types'

const donationStore = useDonationStore()

const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
} = useCodeSelector({
  defaultId: DEFAULT_PHONE_SPEC.id,
  phoneSpecs: PHONE_SPECS,
})

const donorBlank = useForm({
  validationSchema: toTypedSchema(makeBlankSchema(() => selectedSpec.value?.code || '')),
  initialValues: DEFAULT_BLANK_FORM,
  name: 'donationBlank',
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

const selectPhoneCode = (specId: PhoneSpec['id']) => {
  selectPhoneCodeById(specId)
  donorBlank.resetField('phone')
}

watch(selectedSpec, () => donorBlank.resetField('phone'), {
  immediate: true,
})

watch(
  () => donorBlank.values,
  (values) => (donationStore.blankForm = { ...values }),
  {
    deep: true,
  }
)

watch(
  () => donorBlank.meta.value.valid,
  (valid) => donationStore.setBlankValidity(valid)
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField
      name="phone"
      v-slot="{ componentField }"
      :validate-on-blur="!donorBlank.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5">Телефон </FormLabel>
        <div class="flex gap-2">
          <FormControl>
            <div class="flex shadow-xs rounded-md">
              <div
                class="text-foreground !opacity-100 px-3 flex rounded-md rounded-r-none items-center border-r-0 border border-border"
              >
                {{ selectedSpec.code }}
              </div>
              <Input
                class="rounded-l-none shadow-none"
                v-mask="currentMask"
                type="tel"
                v-bind="componentField"
                @paste="onPastePhone"
                :placeholder="selectedSpec.mask"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="default" :variant="'outline'">
                  <span v-if="selectedSpec" class="text-sm md:text-base">{{
                    selectedSpec.icon
                  }}</span>
                  <span v-else class="text-sm">Select</span>
                  <Icon class="f7--chevron-down size-3.5 md:size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                :align="'end'"
                class="min-w-[var(--radix-dropdown-menu-trigger-width)] gap-1 duration-150 flex flex-col"
              >
                <DropdownMenuItem
                  v-for="spec in PHONE_SPECS"
                  :key="spec.id"
                  @select="() => selectPhoneCode(spec.id)"
                  class="flex gap-2 px-3 cursor-pointer"
                  :class="{
                    '!bg-secondary !text-secondary-foreground': selectedSpec?.code === spec.code,
                  }"
                >
                  <span class="">{{ spec.icon }}</span>
                  <span>{{ spec.name }}</span>
                  <span class="ml-auto">{{ spec.code }}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" :validate-on-blur="!donorBlank.isFieldDirty" name="name">
      <FormItem class="gap-1">
        <FormLabel class="label-optional gap-0.5">Имя</FormLabel>

        <FormControl>
          <Input v-bind="componentField" placeholder="Хотя бы 3 символа" name="name" type="text">
          </Input>
        </FormControl>
        <FormMessage />
        <FormDescription>Оставьте пустым для анонимности</FormDescription>
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField }"
      :validate-on-blur="!donorBlank.isFieldDirty"
      name="birth"
    >
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5">Дата рождения</FormLabel>

        <FormControl>
          <Input
            v-bind="componentField"
            placeholder="дд.мм.гггг"
            name="birth"
            type="tel"
            v-mask="'##.##.####'"
            inputmode="numeric"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField }"
      :validate-on-blur="!donorBlank.isFieldDirty"
      name="isGroup"
    >
      <FormItem class="gap-1">
        <FormControl>
          <div class="flex flex-col">
            <CheckBlock
              class="w-full"
              v-bind="componentField"
              label="От лица группы"
              icon="f7--person-2"
              :size="'default'"
            />
          </div>
        </FormControl>
        <FormDescription>Отметьте, если участвует коллектив</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
