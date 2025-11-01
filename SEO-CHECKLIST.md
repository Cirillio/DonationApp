# SEO Checklist - DonationApp

> **Статус:** ✅ Базовая SEO оптимизация завершена
> **Дата:** 01.11.2025

---

## Выполнено ✅

### 1. Meta теги в index.html

- ✅ `<title>` добавлен (fallback для всех страниц)
- ✅ `<meta name="description">` с описанием фонда
- ✅ `<meta name="keywords">` с ключевыми словами
- ✅ `<meta name="author">`
- ✅ `<meta name="theme-color">` для браузеров
- ✅ Open Graph теги для социальных сетей
- ✅ Twitter Card теги
- ✅ Canonical URL
- ✅ Robots meta tags

**Файл:** `index.html:8-40`

---

### 2. robots.txt

- ✅ Создан файл `public/robots.txt`
- ✅ Разрешена индексация всего сайта
- ✅ Запрещена индексация служебных директорий (/api/, /\_redirects)
- ✅ Указан путь к sitemap
- ✅ Правила для популярных ботов (Googlebot, Yandex, Bingbot)

**Файл:** `public/robots.txt`

---

### 3. sitemap.xml

- ✅ Создан файл `public/sitemap.xml`
- ✅ Добавлены все основные страницы:
  - `/` (priority 1.0, weekly)
  - `/donate` (priority 0.9, monthly)
  - `/news` (priority 0.8, daily)
  - `/statistic` (priority 0.7, weekly)
  - `/settings` (priority 0.3, yearly)
- ✅ Указаны частоты обновления и приоритеты

**Файл:** `public/sitemap.xml`

⚠️ **TODO:** Обновлять `lastmod` дату при изменении страниц

---

### 4. Open Graph изображение

- ✅ Создан временный файл `public/og-image.jpg`
- ✅ Добавлены OG meta теги в index.html
- ✅ Настроен guards.ts для динамического OG image
- ✅ Создана инструкция по созданию правильного OG изображения

**Файлы:**

- `public/og-image.jpg` (временно hero.jpg)
- `public/OG-IMAGE-INSTRUCTIONS.md`
- `src/router/guards.ts:14-15,24`

⚠️ **TODO:** Создать правильное OG изображение 1200x630px перед production!

---

### 5. Structured Data (JSON-LD)

- ✅ Создан composable `useStructuredData`
- ✅ Добавлены функции для генерации structured data:
  - `getOrganizationStructuredData()` - NGO schema
  - `getWebSiteStructuredData()` - WebSite schema
  - `getDonateActionStructuredData()` - DonateAction schema
  - `getBreadcrumbStructuredData()` - Breadcrumb schema (готово для использования)
- ✅ Интегрировано в HomePage.vue (Organization + WebSite)
- ✅ Интегрировано в DonatePage.vue (DonateAction)

**Файлы:**

- `src/composables/useStructuredData.ts`
- `src/pages/HomePage.vue:6-16`
- `src/pages/DonatePage.vue:10,22`

---

### 6. Dynamic SEO

- ✅ Настроен guards.ts для динамического обновления мета-тегов
- ✅ Каждая страница обновляет title, description и OG теги
- ✅ Composable `useSEO` для управления мета-тегами

**Файл:** `src/router/guards.ts`

---

## Что нужно сделать перед production 🔧

### Критично:

1. **OG Image** (⚠️ ВАЖНО!)

   - Создать правильное изображение 1200x630px
   - Использовать инструкцию в `public/OG-IMAGE-INSTRUCTIONS.md`
   - Заменить `public/og-image.jpg`
   - Оптимизировать размер (< 300 KB)

2. **Обновить URL в meta тегах**

   - `index.html:18` - заменить `https://chilgazi.org/` на реальный домен
   - `index.html:21` - OG image URL
   - `index.html:29` - Twitter URL
   - `index.html:32` - Twitter image URL
   - `index.html:35` - Canonical URL

3. **Обновить sitemap.xml**

   - `public/sitemap.xml` - заменить все URL на реальный домен
   - Обновить `lastmod` даты

4. **Обновить robots.txt**

   - `public/robots.txt:12` - заменить URL sitemap

5. **Обновить structured data**

   - `src/composables/useStructuredData.ts:20` - реальный URL
   - `src/composables/useStructuredData.ts:21` - реальный URL logo
   - `src/composables/useStructuredData.ts:57` - реальный URL donate page

---

## Опционально (но рекомендуется):

6. **Добавить favicon набор**

   - favicon.ico (уже есть)
   - apple-touch-icon.png (180x180)
   - favicon-32x32.png
   - favicon-16x16.png
   - site.webmanifest

7. **Google Search Console**

   - Зарегистрировать сайт
   - Загрузить sitemap.xml
   - Настроить мониторинг индексации

8. **Yandex Webmaster**

   - Зарегистрировать сайт
   - Загрузить sitemap.xml
   - Настроить индексацию

9. **Schema.org дополнения**

   - Добавить ContactPoint с реальными контактами
   - Добавить sameAs ссылки на соцсети (когда будут)
   - Добавить address с полным адресом

10. **Analytics**

    - Google Analytics
    - Yandex Metrika

---

## Как проверить SEO после деплоя

### 1. Проверка мета-тегов

```bash
curl -I https://chilgazi.org/
```

### 2. Facebook Debugger

https://developers.facebook.com/tools/debug/

- Введите URL: `https://chilgazi.org/`
- Проверьте preview
- Нажмите "Scrape Again" если нужно обновить

### 3. Twitter Card Validator

https://cards-dev.twitter.com/validator

- Введите URL
- Проверьте preview

### 4. LinkedIn Post Inspector

https://www.linkedin.com/post-inspector/

- Проверьте preview для LinkedIn

### 5. Google Rich Results Test

https://search.google.com/test/rich-results

- Введите URL
- Проверьте structured data

### 6. Schema Markup Validator

https://validator.schema.org/

- Введите URL
- Проверьте JSON-LD

### 7. Google Lighthouse

Откройте Chrome DevTools → Lighthouse → Run audit
Проверьте раздел "SEO"

Цель: 90+ баллов

---

## SEO Best Practices (следуем ✅)

- ✅ Unique title для каждой страницы
- ✅ Meta description 120-160 символов
- ✅ Canonical URLs
- ✅ Structured data (JSON-LD)
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Open Graph tags
- ✅ Mobile-friendly (viewport meta)
- ✅ Semantic HTML
- ✅ HTTPS (TODO: настроить на сервере)
- ✅ Fast loading (Vite оптимизация)

---

## Команды для тестирования

### Локально:

```bash
# Запустить dev сервер
pnpm dev

# Открыть в браузере
http://localhost:5173

# Проверить robots.txt
http://localhost:5173/robots.txt

# Проверить sitemap.xml
http://localhost:5173/sitemap.xml

# Проверить OG image
http://localhost:5173/og-image.jpg
```

### После деплоя:

```bash
# Проверить robots.txt
curl https://chilgazi.org/robots.txt

# Проверить sitemap.xml
curl https://chilgazi.org/sitemap.xml

# Проверить headers
curl -I https://chilgazi.org/
```

---

## Итоговый чеклист перед production

- [ ] OG Image 1200x630px создано и оптимизировано
- [ ] Все URL заменены на реальный домен (index.html)
- [ ] sitemap.xml обновлен с реальными URL
- [ ] robots.txt обновлен с реальным URL
- [ ] structured data обновлен с реальными URL
- [ ] Проверено в Facebook Debugger
- [ ] Проверено в Twitter Card Validator
- [ ] Проверено в Google Rich Results Test
- [ ] Lighthouse SEO score 90+
- [ ] Google Search Console настроен
- [ ] Yandex Webmaster настроен
- [ ] Favicon набор добавлен
- [ ] Analytics настроена

---

## Дополнительные ресурсы

- **SEO Guide:** https://developers.google.com/search/docs
- **Schema.org:** https://schema.org/
- **Open Graph Protocol:** https://ogp.me/
- **Twitter Cards:** https://developer.twitter.com/en/docs/twitter-for-websites/cards
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

---

**Следующий шаг:** Создать правильное OG изображение и обновить все URL на production домен
