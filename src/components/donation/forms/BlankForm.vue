<script lang="ts" setup>
import { computed } from 'vue'
import { usePhone } from '@/composables/usePhone'
import { DEFAULT_BLANK_FORM, DEFAULT_PHONE_SPEC, PHONE_SPECS } from '@/lib/constants'
import { useDonationStore } from '@/stores/donation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CheckBlock from '@/components/ui/checkblock/CheckBlock.vue'
import { AutoAnimated } from '@/components/ui/auto-animated'
import DateInput from '@/components/common/DateInput.vue'

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
  donationStore.clearFieldError('blank', '')
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

</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Phone Field -->
    <div class="flex flex-col gap-1">
      <label class="label-required gap-1 text-lg flex items-center font-medium text-foreground"
        :class="[errors.phone && '!text-destructive']">
        <span class="iconify f7--phone size-6"></span>
        Телефон
      </label>

      <div class="flex rounded-md overflow-hidden shadow-xs *:text-lg">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button :variant="'outline'" class="gap-2 !bg-card shadow-none rounded-r-none border-r-0 px-3">
              {{ selectedSpec.code }}
              <Icon class="f7--chevron-down size-4.5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent :align="'start'"
            class="duration-150 shadow-muted dark:shadow-black/50 shadow-md bg-card gap-1.5 p-1 ease-linear flex flex-col min-w-[220px]">
            <DropdownMenuItem v-for="spec in PHONE_SPECS" :key="spec.id" @select="onCountryChange(spec.id)"
              class="cursor-pointer p-0 rounded-md">
              <Button variant="text" :class="[selectedSpec?.code === spec.code ? '!text-primary' : '']"
                class="w-full hover:!bg-border/5 dark:hover:!bg-muted/50 text-base justify-start gap-3 md:gap-2 px-2 py-1.5 h-auto">
                <Badge :variant="selectedSpec?.code === spec.code ? 'outline-primary' : 'outline'"
                  class="font-mono font-semibold min-w-[3.5rem] h-7 md:h-5 justify-center max-md:text-base">
                  {{ spec.code }}
                </Badge>
                <span class="max-md:text-lg">{{ spec.name }}</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input v-model="form.phone" @paste="onPastePhone" @input="donationStore.clearFieldError('blank', 'phone')"
          :placeholder="selectedSpec.mask" v-mask="currentMask" name="phone" inputmode="tel" type="tel"
          :aria-invalid="!!errors.phone" class="text-lg max-md:min-h-11 rounded-l-none shadow-none" />
      </div>

      <AutoAnimated>
        <p v-if="errors.phone" class="text-destructive text-sm max-md:!text-sm">
          {{ errors.phone }}
        </p>
      </AutoAnimated>
    </div>

    <!-- Name Field -->
    <div class="flex flex-col gap-1">
      <label class="label-optional gap-1 text-lg flex items-center font-medium text-foreground"
        :class="[errors.name && '!text-destructive']">
        <span class="iconify f7--person size-6"></span>
        Имя
      </label>

      <Input v-model="form.name" @input="donationStore.clearFieldError('blank', 'name')" placeholder="Хотя бы 3 символа"
        type="text" :aria-invalid="!!errors.name" class="max-md:min-h-11 text-lg" name="name" />

      <AutoAnimated>
        <p v-if="errors.name" class="text-destructive text-base">
          {{ errors.name }}
        </p>
      </AutoAnimated>
      <p class="text-muted-foreground text-base max-md:!text-sm">Оставьте пустым для анонимности</p>
    </div>

    <!-- Birth Date Field -->
    <div class="flex flex-col gap-1">
      <label class="label-required gap-1 text-lg flex items-center font-medium text-foreground"
        :class="[errors.birth && '!text-destructive']">
        <span class="iconify f7--calendar-today size-6"></span>
        Дата рождения
      </label>

      <DateInput v-model="form.birth" :aria-invalid="!!errors.birth"
      @input="donationStore.clearFieldError('blank', 'birth')"
      class="max-md:min-h-11 text-lg" />

      <AutoAnimated>
        <p v-if="errors.birth" class="text-destructive text-sm">
          {{ errors.birth }}
        </p>
      </AutoAnimated>
    </div>


    <!-- Group Checkbox -->
    <div class="flex flex-col gap-1">
      <CheckBlock v-model="form.isGroup" class="w-full text-foreground min-h-12" :size="'default'">
        <template v-slot:content>
          <Icon class="f7--person-2 size-7" />
          <span class="text-lg font-normal">От лица группы</span>
        </template>
      </CheckBlock>

      <p class="text-muted-foreground max-md:!text-sm">Отметьте, если участвует коллектив</p>
    </div>
  </div>
</template>
