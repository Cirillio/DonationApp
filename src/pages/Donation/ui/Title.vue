<script lang="ts" setup>
import AppLogo from '@/app/ui/AppLogo.vue'
import { DONATION_TITLE, DONATION_DETAILS_BUTTON, DONATION_SUBTITLE } from '../data/title'
</script>

<template>
  <section
    class="flex max-md:flex-col flex-row-reverse items-center gap-4 w-full max-md:text-center"
  >
    <AppLogo class="size-20 drop-shadow-2xl drop-shadow-primary/10 md:mr-6" />

    <div class="flex flex-col gap-2 max-md:items-center">
      <h1
        class="text-2xl font-bold text-accent dark:text-primary drop-shadow-lg drop-shadow-accent/25 dark:drop-shadow-primary/25"
      >
        {{ DONATION_TITLE }}
      </h1>
      <h2 class="text-sm font-normal text-muted-foreground text-balance">
        {{ DONATION_SUBTITLE }}
      </h2>
      <Separator class="!w-1/3" />
      <Button size="sm" variant="ghost" class="">{{ DONATION_DETAILS_BUTTON }}</Button>
    </div>
  </section>
</template>
