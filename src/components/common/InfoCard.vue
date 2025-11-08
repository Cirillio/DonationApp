<template>
   <Card
    class="group z-0 shadow-sm hover:shadow-xs border-2 border-transparent hover:border-primary/50 bg-card md:flex-1 md:hover:rotate-3 max-md:hover:-translate-y-2 md:hover:scale-105 transition-all duration-200 ease-in-out"
    > <slot /> </Card
  >
</template>

<script lang="ts" setup>
import { Card } from '@/components/ui/card'
</script>

