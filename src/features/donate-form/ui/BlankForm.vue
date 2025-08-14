<script lang="ts" setup>
import { FormField } from '@/shared/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import blankSchema from '@/domain/blank/schema'
import { DEFAULT_BLANK_FORM } from '@/domain/blank/default'
import { useForm } from 'vee-validate'
import { PHONE_SPECS } from '@/features/phone-input/data/phone-specs'
import { useCodeSelector } from '@/features/phone-input/composables/useCodeSelector'

import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { watch } from 'vue'
import { PhoneSpec } from '@/features/phone-input/model/types'

const donationStore = useDonationStore()

const donorBlank = useForm({
  validationSchema: toTypedSchema(blankSchema),
  initialValues: DEFAULT_BLANK_FORM,
  name: 'donationBlank',
})

const { selectedCode, currentMask, selectById } = useCodeSelector({
  defaultId: 'RU',
  phoneSpecs: PHONE_SPECS,
})

const selectPhoneCode = (id: PhoneSpec['id']) => {
  selectById(id)
  donationStore.phoneCode = id
  donorBlank.resetField('phone')
}

watch(
  () => donorBlank.values,
  (values) => {
    donationStore.blankForm = { ...values }
  },
  {
    deep: true,
  }
)

watch(
  () => donorBlank.meta.value.valid,
  (valid) => {
    donationStore.setBlankValidity(valid)
  }
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <FormField
      v-slot="{ componentField }"
      name="phone"
      :validate-on-blur="!donorBlank.isFieldDirty"
    >
      <FormItem class="gap-1">
        <FormLabel>Телефон</FormLabel>
        <div class="flex gap-2">
          <FormControl>
            <Input
              v-mask="currentMask"
              v-bind="componentField"
              :placeholder="selectedCode.code"
              name="phone"
              type="tel"
            >
            </Input>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="default" :variant="'outline'">
                  <span v-if="selectedCode" class="text-sm md:text-base">{{
                    selectedCode.icon
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
                    '!bg-secondary !text-secondary-foreground dark:!bg-card':
                      selectedCode.code === spec.code,
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
        <FormLabel>Имя</FormLabel>

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
        <FormLabel>Дата рождения</FormLabel>

        <FormControl>
          <Input
            v-bind="componentField"
            placeholder="дд.мм.гггг"
            name="birth"
            type="tel"
            v-mask="'##.##.####'"
          >
          </Input>
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
