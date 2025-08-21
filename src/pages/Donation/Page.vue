<script lang="ts" setup>
import Title from './ui/Title.vue'
import DonationForm from './ui/DonationForm.vue'
import Body from './ui/Body.vue'
import Overlay from './ui/Overlay.vue'
import { useCardFocus } from '@/pages/Donation/composables/useCardFocus'
import { provide } from 'vue'

const { focused, bindFocus, isActive } = useCardFocus<'blank' | 'payment'>()

provide('useCardFocus', { bindFocus, isActive })
</script>
<template>
  <div class="min-h-full flex relative overflow-hidden pb-8">
    <Transition name="overlay-fade">
      <Overlay v-if="focused" />
    </Transition>
    <div class="flex min-h-full w-full items-center">
      <Body>
        <template v-slot:body>
          <Title />
          <DonationForm />
        </template>
      </Body>
    </div>
  </div>
</template>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 150ms ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
