<script lang="ts" setup>
import Title from './ui/Title.vue'
import DonationForm from './ui/DonationForm.vue'
import Body from './ui/Body.vue'
</script>
<template>
  <div class="min-h-full flex relative overflow-hidden pb-8">
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
