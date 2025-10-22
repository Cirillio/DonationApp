<script lang="ts" setup>
import DonationForm from '@/components/donation/forms/DonationForm.vue'
</script>
<template>
  <div class="w-full min-h-full relative overflow-y-scroll">
    <div class="flex min-h-full w-full items-center">
      <div
        class="flex w-full px-2 sm:px-4 xl:px-0 h-fit justify-center items-center max-[459px]:w-full min-[460px]:max-w-[446px] md:max-w-[760px] lg:max-w-[868px] mx-auto"
      >
        <DonationForm />
      </div>
    </div>
  </div>
</template>
