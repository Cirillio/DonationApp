<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'

interface StatsCardProps {
  value: string | number
  description: string
  icon: string
}

defineProps<StatsCardProps>()
</script>

<template>
  <Card
    class="group hover:shadow-xl active:shadow-2xl shadow-lg dark:bg-background/25 bg-secondary/50 backdrop-blur-xl border-primary/10 hover:border-primary active:border-primary transition-all"
  >
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-2xl md:text-3xl font-bold text-primary">
          {{ value }}
        </CardTitle>
        <Icon
          variant="ghost"
          :class="[
            icon,
            'size-6 md:size-7 text-primary/75 group-hover:text-primary group-active:text-primary',
          ]"
        />
      </div>
    </CardHeader>
    <CardContent>
      <p
        class="text-sm light:group-hover:text-secondary-foreground light:group-active:text-secondary-foreground group-hover:text-secondary group-active:text-secondary transition-all text-secondary/50 light:text-secondary-foreground/50"
      >
        {{ description }}
      </p>
    </CardContent>
  </Card>
</template>
