<script lang="ts" setup>
import DonationForm from '@/components/donation/forms/DonationForm.vue'
</script>
<template>
  <div class="container min-h-screen mx-auto px-4 py-8 md:py-16">
    <div class="mx-auto flex flex-col gap-4 max-w-4xl">
      <div class="mb-12 text-center">
        <h1 class="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Поддержите наш посёлок
        </h1>
        <p class="text-pretty text-lg text-muted-foreground md:text-xl">
          Ваше пожертвование поможет сделать наш посёлок лучше. Каждый вклад имеет значение.
        </p>
      </div>

      <DonationForm />

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <div class="rounded-lg bg-card p-6 text-center shadow-sm">
          <div class="mb-2 text-3xl font-bold text-primary">100%</div>
          <p class="text-sm text-muted-foreground">Прозрачность использования средств</p>
        </div>
        <div class="rounded-lg bg-card p-6 text-center shadow-sm">
          <div class="mb-2 text-3xl font-bold text-primary">24/7</div>
          <p class="text-sm text-muted-foreground">Безопасные платежи</p>
        </div>
        <div class="rounded-lg bg-card p-6 text-center shadow-sm">
          <div class="mb-2 text-3xl font-bold text-primary">1000+</div>
          <p class="text-sm text-muted-foreground">Благодарных жителей</p>
        </div>
      </div>
    </div>
  </div>
</template>
