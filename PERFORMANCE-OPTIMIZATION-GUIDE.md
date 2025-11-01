# Руководство по оптимизации производительности

> Детальное объяснение каждого пункта из раздела "Performance Optimization" плана доработок

---

## 1. Оптимизация изображений

### Что это?

Процесс уменьшения размера файлов изображений без существенной потери качества. Включает сжатие и конвертацию в современные форматы.

### Зачем?

- Изображения часто составляют 50-70% веса страницы
- Быстрая загрузка = лучший UX и SEO
- Экономия трафика для пользователей

### Инструменты

**Онлайн сервисы:**
- [TinyPNG](https://tinypng.com/) - сжатие PNG/JPG
- [Squoosh](https://squoosh.app/) - конвертация в WebP/AVIF
- [Compressor.io](https://compressor.io/) - универсальный компрессор

**CLI инструменты:**
```bash
# Sharp (Node.js)
npm install -g sharp-cli
sharp input.jpg -o output.webp --webp

# ImageMagick
convert input.jpg -quality 85 -strip output.jpg

# cwebp (Google)
cwebp -q 80 input.jpg -o output.webp
```

**Библиотеки для Vite:**
```bash
pnpm add -D vite-plugin-imagemin
```

### Суть

1. **Сжатие** - уменьшение размера через оптимизацию алгоритма
2. **Конвертация** - использование современных форматов (WebP, AVIF)
3. **Адаптивность** - разные размеры для разных экранов

### Пример

**До оптимизации:**
```
hero.jpg - 2.5 MB (3840x2160px)
```

**После оптимизации:**
```
hero-large.webp  - 180 KB (1920x1080px) для десктопа
hero-medium.webp - 80 KB  (1024x576px)  для планшетов
hero-small.webp  - 35 KB  (640x360px)   для мобильных
hero.jpg         - 250 KB (fallback для старых браузеров)
```

**Использование в коде:**
```vue
<picture>
  <!-- WebP для современных браузеров -->
  <source
    srcset="
      /img/hero-small.webp 640w,
      /img/hero-medium.webp 1024w,
      /img/hero-large.webp 1920w
    "
    sizes="100vw"
    type="image/webp"
  />

  <!-- Fallback для старых браузеров -->
  <img
    src="/img/hero.jpg"
    alt="Hero image"
    loading="lazy"
  />
</picture>
```

**Экономия:** 2.5 MB → 180 KB = **92% уменьшение размера!**

---

## 2. Lazy Loading для изображений

### Что это?

Отложенная загрузка изображений - они загружаются только когда попадают во viewport (видимую область экрана).

### Зачем?

- Ускоряет первую загрузку страницы
- Экономит трафик (не загружаются изображения ниже fold)
- Улучшает Core Web Vitals (LCP, FCP)

### Инструменты

**Нативный HTML атрибут:**
```html
<img src="image.jpg" loading="lazy" alt="Description" />
```

**Библиотеки:**
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) - легковесная библиотека
- [@vueuse/core - useIntersectionObserver](https://vueuse.org/core/useIntersectionObserver/) - для Vue

### Суть

1. Браузер не загружает изображение сразу
2. Когда пользователь прокручивает страницу вниз
3. Изображение появляется в viewport → загружается
4. Показывается placeholder или blur эффект во время загрузки

### Пример

**Простой вариант (HTML5):**
```vue
<template>
  <img
    src="/img/hero.jpg"
    loading="lazy"
    alt="Hero image"
  />
</template>
```

**Продвинутый вариант (с placeholder):**
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const imgRef = ref<HTMLImageElement>()
const isLoaded = ref(false)

useIntersectionObserver(
  imgRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isLoaded.value) {
      isLoaded.value = true
    }
  }
)
</script>

<template>
  <div class="image-container">
    <!-- Blur placeholder -->
    <img
      v-if="!isLoaded"
      src="/img/hero-tiny.jpg"
      class="blur-lg"
      alt="Hero placeholder"
    />

    <!-- Реальное изображение -->
    <img
      v-show="isLoaded"
      ref="imgRef"
      :src="isLoaded ? '/img/hero.jpg' : ''"
      alt="Hero image"
      @load="isLoaded = true"
    />
  </div>
</template>
```

**Composable для переиспользования:**
```typescript
// src/composables/useLazyImage.ts
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useLazyImage() {
  const imgRef = ref<HTMLImageElement>()
  const isLoaded = ref(false)
  const hasError = ref(false)

  useIntersectionObserver(
    imgRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !isLoaded.value) {
        isLoaded.value = true
      }
    },
    { threshold: 0.1 }
  )

  const onError = () => {
    hasError.value = true
  }

  return {
    imgRef,
    isLoaded,
    hasError,
    onError
  }
}
```

---

## 3. Code Splitting

### Что это?

Разделение JavaScript бандла на отдельные чанки (chunks), которые загружаются по требованию (on-demand).

### Зачем?

- Уменьшает начальный размер загрузки
- Страницы загружаются быстрее
- Пользователь загружает только нужный код

### Инструменты

**Vite (встроено):**
- Автоматический code splitting для динамических импортов
- Tree-shaking для удаления неиспользуемого кода

**Vue Router:**
- Lazy loading для маршрутов

### Суть

Вместо одного большого `bundle.js` (2 MB):
```
app.js        - 500 KB  (основной код)
home.js       - 100 KB  (главная страница)
donate.js     - 200 KB  (форма донатов)
statistics.js - 150 KB  (графики и таблицы)
news.js       - 50 KB   (страница новостей)
```

Каждый маршрут загружает только свой чанк!

### Пример

**❌ Плохо (загружается всё сразу):**
```typescript
// router/index.ts
import HomePage from '@/pages/HomePage.vue'
import DonatePage from '@/pages/DonatePage.vue'
import NewsPage from '@/pages/NewsPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/donate', component: DonatePage },
  { path: '/news', component: NewsPage }
]
```

**✅ Хорошо (lazy loading):**
```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/donate',
    component: () => import('@/pages/DonatePage.vue')
  },
  {
    path: '/news',
    component: () => import('@/pages/NewsPage.vue')
  }
]
```

**Продвинутый вариант (с названиями чанков):**
```typescript
const routes = [
  {
    path: '/',
    component: () => import(
      /* webpackChunkName: "home" */
      '@/pages/HomePage.vue'
    )
  },
  {
    path: '/donate',
    component: () => import(
      /* webpackChunkName: "donate" */
      '@/pages/DonatePage.vue'
    )
  }
]
```

**Для компонентов:**
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Lazy loading тяжелого компонента
const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
)
</script>

<template>
  <Suspense>
    <template #default>
      <HeavyChart />
    </template>
    <template #fallback>
      <div>Загрузка графика...</div>
    </template>
  </Suspense>
</template>
```

---

## 4. Проверка Bundle Size

### Что это?

Анализ размера итогового JavaScript бандла и выявление "тяжелых" зависимостей.

### Зачем?

- Выявить слишком большие библиотеки
- Найти дублирующиеся зависимости
- Оптимизировать импорты

### Инструменты

**Rollup Plugin Visualizer (для Vite):**
```bash
pnpm add -D rollup-plugin-visualizer
```

**Vite Bundle Visualizer:**
```bash
pnpm add -D vite-bundle-visualizer
```

**Webpack Bundle Analyzer (если используется Webpack):**
```bash
pnpm add -D webpack-bundle-analyzer
```

### Суть

Визуализирует размер каждой зависимости в виде диаграммы. Позволяет увидеть:
- Какие пакеты занимают больше всего места
- Можно ли заменить тяжелую библиотеку на легкую
- Есть ли дублирование кода

### Пример

**Настройка в Vite:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true, // автоматически открыть отчет
      gzipSize: true, // показать gzip размер
      brotliSize: true, // показать brotli размер
      filename: 'dist/stats.html' // где сохранить отчет
    })
  ]
})
```

**Запуск анализа:**
```bash
pnpm build
# Автоматически откроется браузер с визуализацией
```

**Пример отчета:**
```
Total Bundle Size: 850 KB (250 KB gzipped)

Крупнейшие зависимости:
- @tanstack/vue-table  - 180 KB (большая таблица)
- axios                - 120 KB (HTTP клиент)
- zod                  - 100 KB (валидация)
- lucide-vue-next      - 90 KB  (иконки)
- vue-router           - 80 KB  (роутинг)
- pinia                - 50 KB  (state management)
```

**Оптимизация после анализа:**
```typescript
// ❌ Плохо - импортируется вся библиотека иконок (2 MB)
import * as icons from 'lucide-vue-next'

// ✅ Хорошо - импортируются только нужные иконки
import { Heart, Home, Settings } from 'lucide-vue-next'
```

---

## 5. Compression (gzip/brotli)

### Что это?

Сжатие статических файлов (JS, CSS, HTML) на сервере перед отправкой клиенту.

### Зачем?

- Уменьшает размер передаваемых данных на 70-80%
- Ускоряет загрузку страницы
- Экономит трафик

### Инструменты

**Nginx:**
```nginx
# Встроенная поддержка gzip и brotli
```

**Vite Plugin:**
```bash
pnpm add -D vite-plugin-compression
```

### Суть

Браузер отправляет заголовок:
```
Accept-Encoding: gzip, deflate, br
```

Сервер отвечает сжатым файлом:
```
Content-Encoding: br
```

Браузер автоматически распаковывает.

### Пример

**Nginx конфигурация:**
```nginx
# /etc/nginx/nginx.conf или sites-available/your-app

server {
  listen 80;
  server_name your-domain.com;
  root /var/www/donation-app/dist;

  # Gzip сжатие
  gzip on;
  gzip_comp_level 6;
  gzip_min_length 1000;
  gzip_proxied any;
  gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml+rss
    application/x-javascript
    font/truetype
    font/opentype
    image/svg+xml;
  gzip_vary on;
  gzip_disable "msie6";

  # Brotli сжатие (требует модуль ngx_brotli)
  brotli on;
  brotli_comp_level 6;
  brotli_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml+rss
    application/x-javascript
    font/truetype
    font/opentype
    image/svg+xml;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

**Vite Plugin (предсжатие при сборке):**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // Gzip
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // Brotli
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
})
```

После сборки:
```
dist/
├── index.html
├── index.html.gz      (gzip версия)
├── index.html.br      (brotli версия)
├── assets/
│   ├── index-abc123.js
│   ├── index-abc123.js.gz
│   ├── index-abc123.js.br
│   ├── style-def456.css
│   ├── style-def456.css.gz
│   └── style-def456.css.br
```

**Результат:**
```
Без сжатия:
index.js - 850 KB

С gzip:
index.js.gz - 250 KB (сжатие 70%)

С brotli:
index.js.br - 200 KB (сжатие 76%)
```

---

## 6. Кеширование статики (Cache-Control)

### Что это?

HTTP заголовки, указывающие браузеру как долго хранить файлы в кеше.

### Зачем?

- При повторном посещении файлы грузятся из кеша (мгновенно)
- Снижает нагрузку на сервер
- Экономит трафик пользователей

### Инструменты

**Nginx:**
- Настройка через `Cache-Control` и `Expires` заголовки

**Vite:**
- Автоматический file hashing (`index-abc123.js`)

### Суть

Файлы делятся на 2 типа:

1. **Изменяемые** (HTML) - короткий кеш (1 час) или no-cache
2. **Неизменяемые** (JS/CSS с хешем) - долгий кеш (1 год)

При изменении кода Vite генерирует новый хеш → браузер загружает новую версию.

### Пример

**Nginx конфигурация:**
```nginx
server {
  root /var/www/donation-app/dist;

  # HTML - короткий кеш или no-cache
  location ~* \.html$ {
    expires -1;
    add_header Cache-Control "public, no-cache, must-revalidate";
  }

  # JS и CSS с хешем - долгий кеш (1 год)
  location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Изображения - средний кеш (1 месяц)
  location ~* \.(jpg|jpeg|png|gif|webp|svg|ico)$ {
    expires 1M;
    add_header Cache-Control "public, max-age=2592000";
  }

  # Шрифты - долгий кеш (1 год)
  location ~* \.(woff|woff2|ttf|otf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

**Стратегия кеширования:**
```
index.html                  → no-cache (всегда проверять сервер)
assets/index-abc123.js      → 1 год (immutable, хеш в имени)
assets/style-def456.css     → 1 год (immutable, хеш в имени)
img/logo.png                → 1 месяц (редко меняется)
fonts/roboto.woff2          → 1 год (никогда не меняется)
```

**Cache-Control заголовки:**
```
Cache-Control: public            - может кешироваться браузером и CDN
Cache-Control: private           - только браузер (не CDN)
Cache-Control: no-cache          - проверять сервер перед использованием
Cache-Control: no-store          - не кешировать вообще
Cache-Control: max-age=3600      - кеш на 1 час (3600 секунд)
Cache-Control: immutable         - файл никогда не изменится
Cache-Control: must-revalidate   - проверить актуальность после истечения
```

---

## 7. CDN для статических ресурсов

### Что это?

Content Delivery Network - распределенная сеть серверов по всему миру, которая доставляет статические файлы с ближайшего к пользователю сервера.

### Зачем?

- Быстрая загрузка для пользователей из разных стран
- Снижает нагрузку на основной сервер
- Защита от DDoS атак
- Автоматическое масштабирование

### Инструменты

**Популярные CDN:**
- [Cloudflare](https://www.cloudflare.com/) - бесплатный план, easy setup
- [Amazon CloudFront](https://aws.amazon.com/cloudfront/) - AWS CDN
- [Vercel](https://vercel.com/) - автоматический CDN при деплое
- [Netlify](https://www.netlify.com/) - автоматический CDN при деплое

**Для изображений:**
- [Cloudinary](https://cloudinary.com/) - оптимизация + CDN
- [imgix](https://imgix.com/) - on-the-fly оптимизация

### Суть

**Без CDN:**
```
Пользователь в Москве → Сервер в Москве (10ms)
Пользователь во Владивостоке → Сервер в Москве (150ms)
Пользователь в США → Сервер в Москве (250ms)
```

**С CDN:**
```
Пользователь в Москве → CDN Москва (10ms)
Пользователь во Владивостоке → CDN Владивосток (10ms)
Пользователь в США → CDN США (10ms)
```

### Пример

**Cloudflare настройка:**

1. Зарегистрироваться на Cloudflare
2. Добавить домен
3. Изменить NS записи у регистратора
4. Включить CDN (оранжевое облако)

**Vite настройка для CDN:**
```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? 'https://cdn.your-domain.com/'
    : '/'
})
```

**Nginx настройка (собственный CDN сервер):**
```nginx
# cdn.your-domain.com
server {
  listen 80;
  server_name cdn.your-domain.com;
  root /var/www/cdn/donation-app;

  # CORS для шрифтов
  location ~* \.(woff|woff2|ttf|otf|eot)$ {
    add_header Access-Control-Allow-Origin "*";
    expires 1y;
  }

  # Кеширование статики
  location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Использование в коде:**
```vue
<template>
  <!-- Изображения с CDN -->
  <img src="https://cdn.your-domain.com/img/hero.jpg" alt="Hero" />

  <!-- Шрифты с CDN -->
  <link
    rel="preload"
    href="https://cdn.your-domain.com/fonts/roboto.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</template>
```

**Environment variables:**
```env
# .env.production
VITE_CDN_URL=https://cdn.your-domain.com
```

```typescript
// Использование в коде
const cdnUrl = import.meta.env.VITE_CDN_URL || ''
const imageUrl = `${cdnUrl}/img/hero.jpg`
```

---

## 8. Preload для критических ресурсов

### Что это?

HTML тег `<link rel="preload">`, который указывает браузеру загрузить важные ресурсы раньше, чем они понадобятся.

### Зачем?

- Ускоряет загрузку критических ресурсов
- Улучшает LCP (Largest Contentful Paint)
- Устраняет задержки в рендеринге

### Инструменты

**HTML:**
```html
<link rel="preload" href="..." as="..." />
```

**Vite Plugin:**
```bash
pnpm add -D vite-plugin-html
```

### Суть

Типы preload:
- `as="font"` - шрифты
- `as="image"` - критические изображения
- `as="script"` - важный JavaScript
- `as="style"` - критические CSS

Браузер загружает эти ресурсы с высоким приоритетом, параллельно с HTML.

### Пример

**Preload шрифтов:**
```html
<!-- index.html -->
<head>
  <link
    rel="preload"
    href="/fonts/roboto-regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <link
    rel="preload"
    href="/fonts/roboto-bold.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

**Preload критического изображения:**
```html
<head>
  <!-- Hero изображение загрузится раньше -->
  <link
    rel="preload"
    href="/img/hero.webp"
    as="image"
    type="image/webp"
  />
</head>
```

**Preload критического CSS:**
```html
<head>
  <link
    rel="preload"
    href="/assets/critical.css"
    as="style"
  />
  <link rel="stylesheet" href="/assets/critical.css" />
</head>
```

**Vite Plugin для автоматизации:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: '/fonts/roboto-regular.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            },
            injectTo: 'head'
          }
        ]
      }
    })
  ]
})
```

**⚠️ Важно - не злоупотреблять!**
```html
<!-- ❌ Плохо - preload всего подряд -->
<link rel="preload" href="/img/image1.jpg" as="image" />
<link rel="preload" href="/img/image2.jpg" as="image" />
<link rel="preload" href="/img/image3.jpg" as="image" />
<!-- ... 50+ preload тегов -->

<!-- ✅ Хорошо - только критические ресурсы -->
<link rel="preload" href="/fonts/main-font.woff2" as="font" crossorigin />
<link rel="preload" href="/img/hero.webp" as="image" />
```

---

## 9. Оптимизация загрузки шрифтов

### Что это?

Стратегия загрузки веб-шрифтов, минимизирующая FOIT (Flash of Invisible Text) и FOUT (Flash of Unstyled Text).

### Зачем?

- Шрифты блокируют рендеринг текста
- Могут весить 100-500 KB
- Плохая загрузка = плохой UX (невидимый текст)

### Инструменты

**CSS свойства:**
- `font-display: swap` - показывает fallback шрифт сразу
- `font-display: optional` - использует системный шрифт при медленной сети

**Форматы шрифтов:**
- WOFF2 - современный, лучшее сжатие (поддержка 95%+ браузеров)
- WOFF - fallback для старых браузеров

**Сервисы:**
- [Google Fonts](https://fonts.google.com/) - бесплатные шрифты
- [Fontsource](https://fontsource.org/) - self-hosted версии Google Fonts

### Суть

Стратегии `font-display`:
```
swap     - показать fallback сразу, заменить когда загрузится (рекомендуется)
block    - блокировать текст до загрузки (плохо для UX)
fallback - показать fallback, если шрифт не загрузится за 100ms
optional - использовать системный шрифт при медленной сети
```

### Пример

**❌ Плохо:**
```css
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto.ttf'); /* TTF - большой размер */
  /* Нет font-display - текст будет невидимым 3 секунды */
}

body {
  font-family: 'Roboto'; /* Нет fallback */
}
```

**✅ Хорошо:**
```css
/* Preload в HTML */
<link
  rel="preload"
  href="/fonts/roboto-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

/* CSS */
@font-face {
  font-family: 'Roboto';
  src:
    url('/fonts/roboto-regular.woff2') format('woff2'),
    url('/fonts/roboto-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Показывать fallback сразу */
}

@font-face {
  font-family: 'Roboto';
  src:
    url('/fonts/roboto-bold.woff2') format('woff2'),
    url('/fonts/roboto-bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               'Helvetica Neue', Arial, sans-serif; /* Fallback стек */
}
```

**Self-hosting Google Fonts (Fontsource):**
```bash
pnpm add @fontsource/roboto
```

```typescript
// main.ts
import '@fontsource/roboto/400.css' // Regular
import '@fontsource/roboto/700.css' // Bold
```

**Variable Fonts (еще лучше):**
```css
/* Один файл для всех весов */
@font-face {
  font-family: 'Roboto Flex';
  src: url('/fonts/roboto-flex.woff2') format('woff2-variations');
  font-weight: 100 900; /* Все веса в одном файле */
  font-display: swap;
}
```

**Subset шрифтов (только нужные символы):**
```css
/* Только латиница и кириллица */
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-latin-cyrillic.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0400-045F, U+0490-0491, U+04B0-04B1;
  font-display: swap;
}
```

**Результат оптимизации:**
```
До:
roboto-all.ttf - 450 KB (TTF, все символы, все веса)

После:
roboto-regular-subset.woff2 - 25 KB (WOFF2, латиница+кириллица, 400)
roboto-bold-subset.woff2    - 28 KB (WOFF2, латиница+кириллица, 700)
```

---

## 10. Checklist оптимизации

### Быстрая проверка производительности:

```bash
# 1. Проверить размер бандла
pnpm build
ls -lh dist/assets/*.js

# 2. Анализ с visualizer
pnpm add -D rollup-plugin-visualizer
pnpm build

# 3. Lighthouse audit
# DevTools → Lighthouse → Generate report

# 4. Проверить загрузку на медленном соединении
# DevTools → Network → Throttling: Slow 3G

# 5. Проверить кеширование
# DevTools → Network → Disable cache (should use cache on reload)
```

### Целевые метрики:

```
✅ First Contentful Paint (FCP):    < 1.8s
✅ Largest Contentful Paint (LCP):  < 2.5s
✅ Time to Interactive (TTI):       < 3.8s
✅ Total Blocking Time (TBT):       < 200ms
✅ Cumulative Layout Shift (CLS):   < 0.1

Bundle sizes:
✅ JS (initial):  < 200 KB (gzipped)
✅ CSS:           < 50 KB (gzipped)
✅ Images:        < 500 KB (per page)
```

---

## Итоговая стратегия внедрения

### Этап 1: Быстрые wins (1-2 дня)
1. ✅ Добавить `loading="lazy"` ко всем изображениям ниже fold
2. ✅ Сжать изображения через TinyPNG/Squoosh
3. ✅ Добавить `font-display: swap` в CSS
4. ✅ Проверить lazy loading маршрутов в Vue Router

### Этап 2: Сервер (1 день)
5. ✅ Настроить gzip/brotli в Nginx
6. ✅ Настроить Cache-Control заголовки
7. ✅ Добавить preload для шрифтов

### Этап 3: Глубокая оптимизация (2-3 дня)
8. ✅ Проанализировать bundle size (visualizer)
9. ✅ Заменить тяжелые библиотеки на легкие (если нужно)
10. ✅ Создать WebP версии всех изображений
11. ✅ Настроить CDN (опционально)

### Этап 4: Мониторинг (постоянно)
12. ✅ Регулярные Lighthouse audits
13. ✅ Мониторинг Real User Metrics (RUM)
14. ✅ Проверка Core Web Vitals в Google Search Console

---

## Полезные ссылки

- [Web.dev - Performance](https://web.dev/performance/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Can I Use](https://caniuse.com/) - проверка поддержки браузерами
- [Bundle Phobia](https://bundlephobia.com/) - размер npm пакетов
