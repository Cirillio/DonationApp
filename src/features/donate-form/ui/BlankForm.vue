<script lang="ts" setup>
import { watch } from 'vue'
import { useFormConfig } from '@/composables/useFormConfig'
import { blankSchema, phoneSpecs, placeholders } from '@/data/donation'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useDonationStore } from '@/features/donate-form/model/donation-store'
import { FormField } from '@/components/ui/form'

import { configure } from 'vee-validate'

configure({
  validateOnBlur: true,
  validateOnModelUpdate: false,
})

const donationStore = useDonationStore()

const { phoneMask, phoneMaskSelected } = useFormConfig({
  phoneSelector: {
    _default: donationStore.phoneCode,
    phoneSpecs: phoneSpecs,
  },
})

const donorBlank = useForm({
  validationSchema: toTypedSchema(blankSchema),
  initialValues: {
    ...donationStore.blankForm,
    blankPhone: donationStore.blankForm.blankPhone
      ? donationStore.blankForm.blankPhone
      : phoneMaskSelected.value.code,
  },
  name: 'donationBlank',
})

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
  <form @submit.prevent="() => {}">
    <CardTitledContent icon="f7--person-crop-rectangle" title="Анкета">
      <template #desc>
        <span
          class="max-md:text-center md:flex items-center gap-1 md:text-base text-sm text-muted-foreground"
          >Пожалуйста, укажите <PrimaryBadge> номер телефона </PrimaryBadge>
          <div class="max-md:mt-1 dark:m-0 flex justify-center gap-2 dark:gap-1 items-center">
            имя и
            <PrimaryBadge> дату рождения</PrimaryBadge>
          </div>
        </span>
      </template>

      <div class="flex flex-col w-full gap-4 md:gap-6">
        <!-- Phone -->
        <FormField
          v-slot="{ componentField, resetField }"
          :validate-on-blur="!donorBlank.isFieldDirty"
          name="blankPhone"
        >
          <FormItem class="gap-1">
            <FormControl>
              <IconInput
                v-mask="phoneMask"
                v-bind="componentField"
                :icon="true"
                :placeholder="phoneMaskSelected.code"
                name="blankPhone"
                type="tel"
              >
                <template #icon>
                  <span class="iconify f7--phone md:size-6 size-5 dark:text-primary"></span>
                </template>

                <template #actionButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button
                        size="lg"
                        :variant="'outline'"
                        class="px-3 gap-1 md:gap-2 md:px-4 w-fit"
                      >
                        <span v-if="phoneMaskSelected" class="text-sm md:text-base">{{
                          phoneMaskSelected.icon
                        }}</span>
                        <span v-else class="text-sm text-muted-foreground">Select</span>
                        <F7Icon class="f7--chevron-down size-3.5 md:size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      :align="'end'"
                      class="min-w-[var(--radix-dropdown-menu-trigger-width)] gap-1 duration-25 flex flex-col"
                    >
                      <DropdownMenuItem
                        v-for="spec in phoneSpecs"
                        :key="spec.id"
                        @select="
                          () => {
                            phoneMaskSelected = spec
                            donationStore.phoneCode = spec.id
                            resetField({ value: spec.code })
                          }
                        "
                        class="flex gap-4 max-md:p-2.5 max-md:px-3.5 py-1.5 px-4 !text-base md:!text-lg cursor-pointer"
                        :class="{
                          '!bg-background shadow-sm dark:!bg-card':
                            phoneMaskSelected.code === spec.code,
                        }"
                      >
                        <span class="">{{ spec.icon }}</span>
                        <span>{{ spec.name }}</span>
                        <span class="ml-auto">{{ spec.code }}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </template>
              </IconInput>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex max-[400px]:flex-col gap-4">
          <!-- Name -->
          <FormField
            v-slot="{ componentField }"
            :validate-on-blur="!donorBlank.isFieldDirty"
            name="blankName"
          >
            <FormItem class="gap-1 flex-3">
              <FormControl>
                <IconInput
                  v-bind="componentField"
                  :icon="true"
                  placeholder="Имя"
                  name="blankName"
                  type="text"
                >
                  <template #icon>
                    <span
                      class="iconify f7--person md:size-6 size-5 text-muted-foreground"
                    ></span> </template
                ></IconInput>
              </FormControl>
              <FormMessage />
              <FormDescription>Оставьте пустым для анонимности</FormDescription>
            </FormItem>
          </FormField>

          <!-- Birth -->
          <FormField
            v-slot="{ componentField }"
            :validate-on-blur="!donorBlank.isFieldDirty"
            name="blankBirth"
          >
            <FormItem class="gap-1 flex-2">
              <FormControl>
                <IconInput
                  v-bind="componentField"
                  :icon="true"
                  placeholder="дд.мм.гггг"
                  name="blankBirth"
                  type="tel"
                  v-mask="'##.##.####'"
                >
                  <template #icon>
                    <span
                      class="iconify f7--calendar md:size-6 size-5 dark:text-primary"
                    ></span> </template
                ></IconInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <TextSeparator class="md:*:text-base"> Дополнительно </TextSeparator>

        <!-- Group -->
        <FormField
          v-slot="{ componentField }"
          :validate-on-blur="!donorBlank.isFieldDirty"
          name="blankGroup"
        >
          <FormItem class="gap-1">
            <FormControl>
              <div class="flex flex-col">
                <CheckBlock
                  class="w-full"
                  v-bind="componentField"
                  label="От лица группы"
                  icon="f7--person-2"
                  :size="'lg'"
                />
              </div>
            </FormControl>
            <FormDescription>Отметьте, если участвует коллектив</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Desc -->
        <FormField
          v-slot="{ componentField }"
          :validate-on-blur="!donorBlank.isFieldDirty"
          name="blankDesc"
        >
          <FormItem class="gap-1">
            <FormControl>
              <Textarea
                :placeholder="placeholders.get(donorBlank.values.blankGroup || false)"
                v-bind="componentField"
                class="resize-none min-h-24 text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </CardTitledContent>
  </form>
</template>
