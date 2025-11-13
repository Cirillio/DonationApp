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
    class="group shadow-none dark:bg-secondary-foreground/10 hover:dark:bg-secondary-foreground/25 bg-card/10 hover:bg-card/15 hover:shadow-xl active:shadow-xl backdrop-blur-xl border-2 border-border/5 active:bg-card/25 dark:active:bg-secondary-foreground/50 hover:border-primary/50 active:border-primary/50 duration-200 transition-all"
    > <CardHeader class="pb-3"
      >
      <div class="flex items-center justify-between">
         <CardTitle class="text-2xl md:text-3xl font-bold text-primary"> {{ value }} </CardTitle>
        <Icon
          variant="ghost"
          :class="[
            icon,
            'size-6 md:size-7 transition-all !duration-250 text-primary/75 group-hover:text-accent/80 group-active:text-accent/80',
          ]"
        />
      </div>
       </CardHeader
    > <CardContent
      >
      <p
        class="text-sm light:group-hover:text-secondary-foreground light:group-active:text-secondary-foreground group-hover:text-secondary group-active:text-secondary !duration-250 transition-all text-secondary/50 light:text-secondary-foreground/50"
      >
         {{ description }}
      </p>
       </CardContent
    > </Card
  >
</template>

