import { onMounted, onUnmounted } from 'vue'

/**
 * Composable для добавления structured data (JSON-LD) на страницу
 */
export function useStructuredData(data: Record<string, any>) {
  let scriptElement: HTMLScriptElement | null = null

  const addStructuredData = () => {
    // Создаем script элемент
    scriptElement = document.createElement('script')
    scriptElement.type = 'application/ld+json'
    scriptElement.textContent = JSON.stringify(data, null, 2)
    scriptElement.id = 'structured-data'

    // Добавляем в head
    document.head.appendChild(scriptElement)
  }

  const removeStructuredData = () => {
    if (scriptElement && scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement)
      scriptElement = null
    }
  }

  onMounted(() => {
    addStructuredData()
  })

  onUnmounted(() => {
    removeStructuredData()
  })

  return {
    addStructuredData,
    removeStructuredData,
  }
}

/**
 * Structured data для организации (Organization)
 */
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Фонд Чилгази',
    alternateName: 'Chilgazi Foundation',
    url: 'https://chilgazi.org',
    logo: 'https://chilgazi.org/logo.png',
    description:
      'Благотворительный фонд развития посёлка Чилгази. Поддержка социальных проектов, инфраструктуры и образования.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Чилгази',
      addressCountry: 'TJ',
    },
    sameAs: [
      // Добавить ссылки на соцсети когда будут
      // 'https://facebook.com/chilgazi',
      // 'https://instagram.com/chilgazi',
      // 'https://vk.com/chilgazi',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Russian', 'Tajik'],
    },
  }
}

/**
 * Structured data для действия пожертвования (DonateAction)
 */
export function getDonateActionStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    agent: {
      '@type': 'NGO',
      name: 'Фонд Чилгази',
    },
    description: 'Сделайте пожертвование на развитие посёлка Чилгази',
    url: 'https://chilgazi.org/donate',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'RUB',
      minPrice: '100',
    },
  }
}

/**
 * Structured data для хлебных крошек (BreadcrumbList)
 */
export function getBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Structured data для веб-сайта (WebSite)
 */
export function getWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Фонд Чилгази',
    url: 'https://chilgazi.org',
    description:
      'Благотворительный фонд развития посёлка Чилгази. Каждое пожертвование помогает улучшить жизнь нашего сообщества.',
    inLanguage: 'ru-RU',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://chilgazi.org/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
