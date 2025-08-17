<script lang="ts" setup>
import { useHeaderTimer } from '@/app/composables/useHeaderTimer'
const { headerTimer } = useHeaderTimer()
</script>

<template>
  <div class="text-muted-foreground flex max-xl:text-sm items-center gap-1">
    <Icon class="f7--clock size-4" />
    {{ headerTimer.time }} |
    {{ headerTimer.date }}
  </div>
</template>
