<script lang="ts" setup>
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-4 py-24">
    <div class="flex flex-col items-center justify-center gap-6 text-center max-w-md">
      <Icon class="f7--book size-20 text-muted-foreground/50" />
      <div class="space-y-2">
        <h1 class="text-3xl font-bold">Страница в разработке</h1>
        <p class="text-muted-foreground">
          Раздел новостей находится в разработке. Скоро здесь появятся актуальные новости и события
          фонда Чилгази.
        </p>
      </div>
      <Button as-child variant="default">
        <RouterLink to="/">Вернуться на главную</RouterLink>
      </Button>
    </div>
  </div>
</template>
