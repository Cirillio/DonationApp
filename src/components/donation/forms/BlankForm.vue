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
 * Form Management:
 * - Direct v-model binding to store.formData.blank
 * - No vee-validate, no watchers, no complexity
 * - Validation happens on submit via store.validateBlank()
 *
 * Special Features:
 * - Phone number paste detection and parsing
 * - Country-specific phone validation and masking
 * - Auto-reset phone field when country changes
 */
import { computed } from 'vue'
import { usePhone } from '@/composables/usePhone'
import { DEFAULT_BLANK_FORM, DEFAULT_PHONE_SPEC, PHONE_SPECS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CheckBlock from '@/components/ui/checkblock/CheckBlock.vue'
import { AutoAnimated } from '@/components/ui/auto-animated'

const donationStore = useDonationStore()

const form = computed(() => donationStore.formData.blank)
const errors = computed(() => donationStore.fieldErrors.blank)

const {
  selectedSpec,
  currentMask,
  selectById: selectPhoneCodeById,
  parsePhoneFromClipboard,
} = usePhone({
  defaultId: form.value.phoneCountry || DEFAULT_PHONE_SPEC.id,
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
const onCountryChange = (countryId: string) => {
  selectPhoneCodeById(countryId)
  form.value.phoneCountry = countryId.toUpperCase() as 'RU' | 'TJ'
  resetPhoneField()
}

// Computed для преобразования Date в строку формата YYYY-MM-DD для input[type="date"]
const birthDateString = computed({
  get: () => {
    if (!form.value.birth) return ''
    const date = form.value.birth
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },
  set: (value: string) => {
    if (!value) {
      form.value.birth = null
    } else {
      form.value.birth = new Date(value)
    }
    donationStore.clearFieldError('blank', 'birth')
  },
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Phone Field -->
    <div class="flex flex-col gap-1">
      <label class="label-required gap-1 text-lg flex items-center font-medium text-foreground">
        <span class="iconify f7--phone size-6"></span>
        Телефон
      </label>

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
              @select="onCountryChange(spec.id)"
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

        <Input
          v-model="form.phone"
          @paste="onPastePhone"
          @input="donationStore.clearFieldError('blank', 'phone')"
          :placeholder="selectedSpec.mask"
          v-mask="currentMask"
          name="phone"
          inputmode="tel"
          type="tel"
          :aria-invalid="!!errors.phone"
          class="text-lg max-md:min-h-11"
        />
      </div>

      <AutoAnimated>
        <p v-if="errors.phone" class="text-destructive text-sm max-md:!text-sm">
          {{ errors.phone }}
        </p>
      </AutoAnimated>
    </div>

    <!-- Name Field -->
    <div class="flex flex-col gap-1">
      <label class="label-optional gap-1 text-lg flex items-center font-medium text-foreground">
        <span class="iconify f7--person size-6"></span>
        Имя
      </label>

      <Input
        v-model="form.name"
        @input="donationStore.clearFieldError('blank', 'name')"
        placeholder="Хотя бы 3 символа"
        type="text"
        :aria-invalid="!!errors.name"
        class="max-md:min-h-11 text-lg"
        name="name"
      />

      <AutoAnimated>
        <p v-if="errors.name" class="text-destructive text-base">
          {{ errors.name }}
        </p>
      </AutoAnimated>
      <p class="text-muted-foreground text-base max-md:!text-sm">Оставьте пустым для анонимности</p>
    </div>

    <!-- Birth Date Field -->
    <div class="flex flex-col gap-1">
      <label class="label-required gap-1 text-lg flex items-center font-medium text-foreground">
        <span class="iconify f7--calendar-today size-6"></span>
        Дата рождения
      </label>

      <Input
        v-model="birthDateString"
        type="date"
        name="birth"
        :aria-invalid="!!errors.birth"
        class="max-md:min-h-11 text-lg"
      />

      <AutoAnimated>
        <p v-if="errors.birth" class="text-destructive text-sm">
          {{ errors.birth }}
        </p>
      </AutoAnimated>
    </div>

    <!-- Group Checkbox -->
    <div class="flex flex-col gap-1">
      <CheckBlock v-model="form.isGroup" class="w-full min-h-12" :size="'default'">
        <template v-slot:content>
          <Icon class="f7--person-2 size-7" />
          <span class="text-lg font-normal">От лица группы</span>
        </template>
      </CheckBlock>

      <p class="text-muted-foreground max-md:!text-sm">Отметьте, если участвует коллектив</p>
    </div>
  </div>
</template>
