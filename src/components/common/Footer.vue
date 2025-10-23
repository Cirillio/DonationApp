<template>
  <footer class="border-t border-border bg-muted/30">
    <div class="container mx-auto px-4 py-12">
      <div class="grid gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="md:col-span-1">
          <RouterLink
            to="/"
            class="flex items-center gap-2 font-bold text-foreground transition-colors hover:text-primary"
          >
            <AppLogo class="size-8" />
            <span class="text-lg">Фонд Чилгази</span>
          </RouterLink>

          <p class="text-pretty text-sm text-muted-foreground">
            Вместе делаем наш посёлок лучше. Каждое пожертвование идёт на благо нашего сообщества.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-foreground">Навигация</h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in mainRoutes" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-muted-foreground transition-colors hover:text-primary"
              >
                {{ link.meta?.title }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-foreground">Контакты</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li v-for="contact in CONTACTS" :key="contact.label">
              <a
                target="_blank"
                :href="contact.url"
                :type="contact.type"
                class="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon :class="[contact.icon, 'iconify size-5']" />
                <span>{{ contact.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-foreground">Информация</h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in infoLinks" :key="link.href">
              <RouterLink
                :to="link.href"
                class="text-muted-foreground transition-colors hover:text-primary"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {{ currentYear }} Наш Посёлок. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AppLogo from '../app/AppLogo.vue'
import { mainRoutes } from '@/router'
import { CONTACTS } from '@/lib/constants'

const currentYear = new Date().getFullYear()

interface FooterLink {
  href: string
  label: string
}

const infoLinks: FooterLink[] = [
  { href: '#', label: 'О проекте' },
  { href: '#', label: 'Отчёты' },
  { href: '#', label: 'Политика конфиденциальности' },
]
</script>
