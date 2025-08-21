<script lang="ts" setup>
import AppLogo from '@/app/ui/AppLogo.vue'
import { DONATION_TITLE, DONATION_DETAILS_BUTTON, DONATION_SUBTITLE } from '../data/title'
</script>

<template>
  <section
    class="flex max-md:flex-col flex-row-reverse items-center gap-2 w-full max-md:text-center max-md:my-12 max-md:px-8"
  >
    <AppLogo class="size-16 md:size-20 drop-shadow-2xl drop-shadow-primary/10 md:mr-6" />

    <div class="flex flex-col gap-3 md:gap-2 max-md:items-center">
      <h1
        class="text-xl font-bold text-accent dark:text-primary drop-shadow-lg drop-shadow-accent/25 dark:drop-shadow-primary/25"
      >
        {{ DONATION_TITLE }}
      </h1>
      <h2 class="text-sm max-md:text-xs font-normal text-muted-foreground md:text-balance">
        {{ DONATION_SUBTITLE }}
      </h2>
      <Separator class="md:!w-1/3 !w-2/3" />
      <Button size="sm" variant="ghost" class="max-md:text-xs">{{
        DONATION_DETAILS_BUTTON
      }}</Button>
    </div>
  </section>
</template>
