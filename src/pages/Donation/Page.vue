<script lang="ts" setup>
import DonationForm from '../../features/donation/ui/DonationForm.vue'
import Body from './ui/Body.vue'
</script>
<template>
  <div class="min-h-full flex relative overflow-hidden pb-8">
    <div class="flex min-h-full w-full items-center">
      <Body>
        <template v-slot:body>
          <DonationForm />
        </template>
      </Body>
    </div>
  </div>
</template>
