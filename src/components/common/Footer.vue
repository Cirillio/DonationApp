<template>
  <footer class="bg-background flex w-full py-12 justify-center border-t border-border">
    <div class="container flex justify-between">
      <div class="flex justify-between flex-col gap-16">
        <!-- Brand -->
        <div class="md:col-span-1">
          <RouterLink to="/" class="font-bold text-foreground transition-colors hover:text-primary">
            <span class="text-4xl">Чилгази</span>
          </RouterLink>

          <p class="text-pretty text-lg text-muted-foreground">
            Вместе делаем наш посёлок лучше. Каждое пожертвование идёт на благо нашего сообщества.
          </p>
        </div>
        <!-- Contact -->
        <div>
          <ul class="flex gap-2 text-sm">
            <li v-for="contact in CONTACTS" :key="contact.label">
              <a
                target="_blank"
                :href="contact.url"
                :type="contact.type"
                class="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Button variant="outline">
                  <Icon :class="[contact.icon, 'iconify size-5']" />
                  <span>{{ contact.label }}</span>
                </Button>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Info -->
      <div>
        <h3 class="text-lg text-end mb-4 font-semibold text-foreground">Информация</h3>
        <ul class="flex flex-col gap-2 items-end text-lg">
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
  </footer>
</template>

<script setup lang="ts">
import Button from '../ui/button/Button.vue'
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
