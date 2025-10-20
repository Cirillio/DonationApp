<script lang="ts" setup></script>

<template>
  <div class="flex gap-2 items-center">
    <Separator class="shrink mx-2" />

    <span class="text-nowrap text-sm text-muted-foreground">
      <slot />
    </span>

    <Separator class="shrink mx-2" />
  </div>
</template>
