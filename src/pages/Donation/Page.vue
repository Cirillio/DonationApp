<script lang="ts" setup>
import DonationForm from '../../features/donation/ui/DonationForm.vue'
import Body from './ui/Body.vue'
</script>
<template>
  <div class="w-full min-h-full relative overflow-y-scroll pb-8">
    <div class="flex min-h-full backdrop-blur-xs w-full items-center">
      <Body>
        <template v-slot:body>
          <DonationForm />
        </template>
      </Body>
    </div>
  </div>
</template>
