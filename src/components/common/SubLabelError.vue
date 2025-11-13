<script lang="ts" setup>
import { AutoAnimated } from "@/components/ui/auto-animated";

defineProps<{
  error: string;
}>();
</script>

<template>
  <AutoAnimated>
    <p v-if="error" class="text-destructive text-sm max-md:!text-sm">
      {{ error }}
    </p>
  </AutoAnimated>
</template>
