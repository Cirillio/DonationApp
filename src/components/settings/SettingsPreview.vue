<template>
  <div class="space-y-6">
    <!-- Кнопки -->
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-muted-foreground">Кнопки</h3>
      <div class="flex flex-wrap gap-2">
        <Button variant="default">Default</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="outline-primary">Outline Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button variant="text">Text</Button>
      </div>
    </div>

    <!-- Инпуты -->
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-muted-foreground">Поля ввода</h3>
      <div class="flex flex-wrap gap-4 max-w-2xl">
        <Input placeholder="Обычное поле" class="flex-1 min-w-[200px]" />
        <Input placeholder="Отключенное поле" disabled class="flex-1 min-w-[200px]" />
      </div>
    </div>

    <!-- Карточки -->
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-muted-foreground">Карточки</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Пример карточки</CardTitle>
            <CardDescription>С описанием и контентом</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Контент карточки адаптируется под выбранные настройки радиуса и темы.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>С бейджами</CardTitle>
            <CardDescription>Различные варианты</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="outline-primary">Outline Primary</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
</script>

<style></style>
