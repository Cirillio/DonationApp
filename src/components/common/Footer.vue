<template>
  <footer class="border-t border-border bg-muted/20 light:bg-secondary">
    <div class="container mx-auto px-4 py-12">
      <div class="grid gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="md:col-span-1">
          <RouterLink
            to="/"
            class="flex items-center gap-2 font-bold text-foreground light:text-secondary-foreground transition-colors hover:text-primary light:hover:text-primary"
          >
            <AppLogo class="size-8" />
            <span class="text-lg">Фонд Чилгази</span>
          </RouterLink>

          <p class="text-pretty text-sm text-muted-foreground light:text-secondary-foreground/80">
            Вместе делаем наш посёлок лучше. Каждое пожертвование идёт на благо нашего сообщества.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-foreground light:text-secondary-foreground">
            Навигация
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in mainRoutes" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-muted-foreground light:text-secondary-foreground/80 transition-colors hover:text-primary light:hover:text-primary"
              >
                {{ link.meta?.title }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-foreground light:text-secondary-foreground">
            Контакты
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-for="contact in CONTACTS" :key="contact.label">
              <a
                target="_blank"
                :href="contact.url"
                :type="contact.type"
                class="flex items-center gap-2 text-muted-foreground light:text-secondary-foreground/80 transition-colors hover:text-primary light:hover:text-primary"
              >
                <Icon :class="[contact.icon, 'iconify size-5']" />
                <span>{{ contact.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h3 class="mb-4 text-sm font-semibold text-foreground light:text-secondary-foreground">
            Информация
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in infoLinks" :key="link.href">
              <RouterLink
                :to="link.href"
                class="text-muted-foreground light:text-secondary-foreground/80 transition-colors hover:text-primary light:hover:text-primary"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground light:text-secondary-foreground/70"
      >
        <p>&copy; {{ currentYear }} Фонд Чилгази. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AppLogo from '../app/AppLogo.vue'
import { Icon } from '@/components/ui/icon'
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
