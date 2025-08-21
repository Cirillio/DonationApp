<script lang="ts" setup>
import { watch, onBeforeUnmount, onMounted } from 'vue'
import { FormField } from '@/shared/ui/form'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import makeBlankSchema from '@/domain/blank/schema'
import { DEFAULT_BLANK_FORM } from '@/domain/blank/default'
import { PHONE_SPECS, DEFAULT_PHONE_SPEC } from '@/features/phone-input/data/phone-specs'
import { useCodeSelector } from '@/features/phone-input/composables/useCodeSelector'
import parsePhoneNumber from 'libphonenumber-js'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import z from 'zod'

// import { configure } from 'vee-validate'

// configure({
//   validateOnModelUpdate: false,
//   validateOnInput: false,
//   validateOnChange: false,
//   validateOnBlur: false,
// })

const donationStore = useDonationStore()

const donorBlank = useForm({
  validationSchema: toTypedSchema(makeBlankSchema(() => selectedSpec.value?.code || '')),
  initialValues: DEFAULT_BLANK_FORM,
  name: 'donationBlank',
})

const phoneField = useField('phone', toTypedSchema(z.string().optional()), {})

const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
} = useCodeSelector({
  defaultId: DEFAULT_PHONE_SPEC.id,
  phoneSpecs: PHONE_SPECS,
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

watch(selectedSpec, () => resetPhone(), { immediate: true })

watch(
  () => donorBlank.values,
  (values) => (donationStore.blankForm = { ...values }),
  {
    deep: true,
    immediate: true,
  }
)

watch(
  () => donorBlank.meta.value.valid,
  (valid) => donationStore.setBlankValidity(valid)
)
onMounted(() => {
  donationStore.initValidator('donationBlank', donorBlank.validate)
})
onBeforeUnmount(() => {
  donorBlank.resetForm({ values: DEFAULT_BLANK_FORM })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormField name="phone">
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 max-md:text-lg">Телефон </FormLabel>
        <div class="flex rounded-md shadow-xs max-md:*:text-lg">
          <div
            class="text-foreground !opacity-100 px-3 flex rounded-md rounded-r-none items-center border-r-0 border border-border"
          >
            {{ selectedSpec.code }}
          </div>

          <FormControl>
            <Input
              class="rounded-none shadow-none max-md:min-h-11"
              type="tel"
              @paste="onPastePhone"
              :placeholder="selectedSpec.mask"
              v-mask="currentMask"
              name="phone"
              inputmode="tel"
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
                @select="() => selectPhoneCodeById(spec.id)"
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

    <FormField name="name">
      <FormItem class="gap-1">
        <FormLabel class="label-optional gap-0.5 max-md:text-lg">Имя</FormLabel>

        <FormControl>
          <Input
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

    <FormField name="birth">
      <FormItem class="gap-1">
        <FormLabel class="label-required gap-0.5 max-md:text-lg">Дата рождения</FormLabel>

        <FormControl>
          <Input
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
