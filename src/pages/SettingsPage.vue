<template>
  <div className="container mx-auto max-w-4xl px-4 py-12">
    <div className="mb-8">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">Настройки</h1>
      <p className="mt-2 text-pretty text-muted-foreground">
        Настройте внешний вид сайта под свои предпочтения
      </p>
    </div>
    <div class="space-y-6">
      <SettingsSection
        title="Превью"
        description="Просмотрите различные элементы интерфейса с текущими настройками"
      >
        <template #icon>
          <icon class="f7--eye size-6" />
        </template>
        <SettingsPreview />
      </SettingsSection>

      <SettingsSection
        title="Тема оформления"
        description="Выберите светлую, тёмную тему или следуйте системным настройкам"
      >
        <template #icon>
          <icon class="f7--sun-min size-6" />
        </template>
        <theme-select class="flex-wrap" />
      </SettingsSection>

      <SettingsSection
        title="Скругление углов"
        description="Настройте радиус скругления элементов интерфейса"
      >
        <template #icon>
          <icon class="f7--square-on-circle size-6" />
        </template>
        <radius-select class="flex-wrap" />
      </SettingsSection>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SettingsSection, SettingsPreview, ThemeSelect, RadiusSelect } from '@/components/settings'
</script>

<style></style>
