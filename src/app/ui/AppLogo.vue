<script lang="ts" setup>
import { APP_TITLE, Logo } from '../shared/config/logo'
</script>

<template>
  <div class="w-fit flex gap-1 select-none pointer-events-none items-center">
    <img class="size-8" :src="Logo" alt="chilgazi_fund-logo" />
    <span class="text-2xl font-bold tracking-tight text-foreground">{{ APP_TITLE }}</span>
  </div>
</template>
