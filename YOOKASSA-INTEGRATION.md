# План интеграции YooKassa для DonationApp

> **Дата:** 01.11.2025
> **Версия YooKassa API:** v3
> **Документация:** https://yookassa.ru/developers/api

---

## Обзор интеграции

**YooKassa (ЮKassa)** — платежная система от Яндекса, поддерживающая:
- Банковские карты (Visa, Mastercard, МИР)
- СБП (Система Быстрых Платежей)
- Электронные кошельки (ЮMoney, QIWI)
- Рассрочка и кредиты
- Apple Pay / Google Pay

**Выбранный сценарий интеграции:** API с собственной формой (максимальный контроль над UX)

---

## Этап 0: Подготовка

### 0.1 Регистрация в YooKassa

**Задачи:**
- [ ] Зарегистрироваться на https://yookassa.ru
- [ ] Подписать договор и предоставить документы
- [ ] Получить доступ к личному кабинету
- [ ] Активировать тестовый режим

**Результат:**
- Доступ к личному кабинету YooKassa
- Возможность тестирования платежей

---

### 0.2 Получение API ключей

**Задачи:**
- [ ] В личном кабинете YooKassa перейти в "Настройки" → "Интеграция"
- [ ] Получить `shopId` (ID магазина)
- [ ] Сгенерировать `secretKey` (секретный ключ)
- [ ] Сохранить ключи в безопасном месте

**Где хранить:**
```bash
# .env.local (НЕ КОММИТИТЬ!)
VITE_YOOKASSA_SHOP_ID=123456
VITE_YOOKASSA_SECRET_KEY=live_xxxxxxxxxxxxx

# Для тестового режима
VITE_YOOKASSA_TEST_SHOP_ID=123456
VITE_YOOKASSA_TEST_SECRET_KEY=test_xxxxxxxxxxxxx
```

**⚠️ ВАЖНО:**
- Секретный ключ НЕ передается на фронтенд!
- Все запросы к YooKassa API выполняются ТОЛЬКО с бэкенда!

---

## Этап 1: Архитектура решения

### 1.1 Выбор архитектуры

**Вариант 1: Полный Backend (Рекомендуется)**
```
Frontend (Vue) → Backend API (Node.js/PHP/Python) → YooKassa API
                      ↓
                  База данных
```

**Плюсы:**
- Полный контроль над платежами
- Безопасность (секретный ключ на сервере)
- Возможность сохранения данных
- Обработка webhook уведомлений

**Минусы:**
- Требуется разработка бэкенда

---

**Вариант 2: Serverless Functions (Проще для старта)**
```
Frontend (Vue) → Vercel/Netlify Functions → YooKassa API
                      ↓
              Firebase/Supabase DB
```

**Плюсы:**
- Не нужен полноценный сервер
- Быстрое развертывание
- Дешевле на старте

**Минусы:**
- Ограничения по времени выполнения
- Более сложная отладка

---

**Выбор для DonationApp:** Вариант 1 (Backend API)

**Стек бэкенда (рекомендуется):**
- **Node.js + Express** (быстрый старт, JavaScript)
- **База данных:** PostgreSQL или MongoDB
- **ORM:** Prisma (для PostgreSQL) или Mongoose (для MongoDB)

---

### 1.2 Flow платежа

```
1. Пользователь заполняет форму (BlankForm + PaymentForm)
   ↓
2. Frontend отправляет данные на Backend API
   POST /api/donations
   ↓
3. Backend создает платеж через YooKassa API
   POST https://api.yookassa.ru/v3/payments
   ↓
4. YooKassa возвращает confirmation_url
   ↓
5. Backend сохраняет donation в БД и возвращает confirmation_url
   ↓
6. Frontend перенаправляет пользователя на confirmation_url
   (платежная форма YooKassa)
   ↓
7. Пользователь вводит данные карты и оплачивает
   ↓
8. YooKassa обрабатывает платеж
   ↓
9. YooKassa отправляет webhook на Backend
   POST /api/webhooks/yookassa
   ↓
10. Backend обновляет статус donation в БД
    ↓
11. YooKassa перенаправляет пользователя на return_url
    https://your-domain.com/donate?payment_id=xxx
    ↓
12. Frontend показывает ResultForm с результатом платежа
```

---

## Этап 2: Backend разработка

### 2.1 Настройка Backend проекта

**Структура проекта:**
```
donation-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Подключение к БД
│   │   └── yookassa.ts          # Конфиг YooKassa
│   ├── models/
│   │   └── Donation.ts          # Модель пожертвования
│   ├── services/
│   │   ├── yookassaService.ts   # Работа с YooKassa API
│   │   └── donationService.ts   # Бизнес-логика пожертвований
│   ├── controllers/
│   │   ├── donationController.ts
│   │   └── webhookController.ts
│   ├── routes/
│   │   ├── donations.ts
│   │   └── webhooks.ts
│   ├── middleware/
│   │   ├── validateRequest.ts   # Валидация запросов
│   │   └── errorHandler.ts      # Обработка ошибок
│   ├── types/
│   │   └── yookassa.types.ts    # Типы YooKassa
│   └── server.ts                # Entry point
├── prisma/
│   └── schema.prisma            # Database schema
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

### 2.2 Модель данных (Prisma Schema)

**Файл:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Donation {
  id                String   @id @default(uuid())

  // Данные донора
  phone             String
  phoneCountry      String   // 'RU' | 'TJ'
  name              String?
  birthDate         DateTime
  isGroup           Boolean  @default(false)

  // Данные платежа
  amount            Int      // Сумма в копейках (100 = 1 руб)
  currency          String   @default("RUB")
  paymentMethod     String   // 'sbp' | 'bankcard'
  note              String?

  // YooKassa данные
  yookassaPaymentId String?  @unique
  yookassaStatus    String?  // 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  confirmationUrl   String?

  // Метаданные
  status            String   @default("created") // 'created' | 'pending' | 'succeeded' | 'failed'
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  paidAt            DateTime?

  @@index([yookassaPaymentId])
  @@index([phone])
  @@index([status])
  @@index([createdAt])
}
```

**Миграция:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 2.3 YooKassa Service

**Файл:** `src/services/yookassaService.ts`

```typescript
import axios, { AxiosInstance } from 'axios'
import { v4 as uuidv4 } from 'uuid'

interface CreatePaymentParams {
  amount: number // в рублях
  currency: string
  description: string
  returnUrl: string
  paymentMethodType?: 'bank_card' | 'sbp'
  metadata?: Record<string, any>
}

interface YooKassaPayment {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  paid: boolean
  amount: {
    value: string
    currency: string
  }
  confirmation: {
    type: 'redirect'
    confirmation_url: string
  }
  created_at: string
  description: string
  metadata?: Record<string, any>
}

class YooKassaService {
  private client: AxiosInstance
  private shopId: string
  private secretKey: string

  constructor() {
    this.shopId = process.env.YOOKASSA_SHOP_ID!
    this.secretKey = process.env.YOOKASSA_SECRET_KEY!

    if (!this.shopId || !this.secretKey) {
      throw new Error('YooKassa credentials not configured')
    }

    // Создаем axios instance с базовой конфигурацией
    this.client = axios.create({
      baseURL: 'https://api.yookassa.ru/v3',
      auth: {
        username: this.shopId,
        password: this.secretKey,
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': uuidv4(), // Для идемпотентности
      },
    })
  }

  /**
   * Создание платежа в YooKassa
   */
  async createPayment(params: CreatePaymentParams): Promise<YooKassaPayment> {
    const { amount, currency, description, returnUrl, paymentMethodType, metadata } = params

    const payload = {
      amount: {
        value: amount.toFixed(2), // "100.00"
        currency: currency,
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      capture: true, // Автоматическое списание
      description: description,
      metadata: metadata,
      ...(paymentMethodType && {
        payment_method_data: {
          type: paymentMethodType,
        },
      }),
    }

    try {
      const response = await this.client.post<YooKassaPayment>('/payments', payload, {
        headers: {
          'Idempotence-Key': uuidv4(),
        },
      })

      return response.data
    } catch (error: any) {
      console.error('YooKassa create payment error:', error.response?.data || error.message)
      throw new Error('Failed to create payment')
    }
  }

  /**
   * Получение информации о платеже
   */
  async getPayment(paymentId: string): Promise<YooKassaPayment> {
    try {
      const response = await this.client.get<YooKassaPayment>(`/payments/${paymentId}`)
      return response.data
    } catch (error: any) {
      console.error('YooKassa get payment error:', error.response?.data || error.message)
      throw new Error('Failed to get payment info')
    }
  }

  /**
   * Отмена платежа
   */
  async cancelPayment(paymentId: string): Promise<YooKassaPayment> {
    try {
      const response = await this.client.post<YooKassaPayment>(
        `/payments/${paymentId}/cancel`,
        {},
        {
          headers: {
            'Idempotence-Key': uuidv4(),
          },
        }
      )
      return response.data
    } catch (error: any) {
      console.error('YooKassa cancel payment error:', error.response?.data || error.message)
      throw new Error('Failed to cancel payment')
    }
  }
}

export const yookassaService = new YooKassaService()
```

---

### 2.4 Donation Controller

**Файл:** `src/controllers/donationController.ts`

```typescript
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { yookassaService } from '../services/yookassaService'
import { z } from 'zod'

// Zod схема для валидации (та же что и на фронтенде)
const createDonationSchema = z.object({
  phone: z.string().min(10),
  phoneCountry: z.enum(['RU', 'TJ']),
  name: z.string().min(3).max(50).optional(),
  birthDate: z.string().transform((val) => new Date(val)),
  isGroup: z.boolean(),
  amount: z.number().min(100),
  paymentMethod: z.enum(['sbp', 'bankcard']),
  note: z.string().max(200).optional(),
})

export class DonationController {
  /**
   * Создание нового пожертвования
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация входных данных
      const validatedData = createDonationSchema.parse(req.body)

      // 1. Создаем запись в БД
      const donation = await prisma.donation.create({
        data: {
          phone: validatedData.phone,
          phoneCountry: validatedData.phoneCountry,
          name: validatedData.name,
          birthDate: validatedData.birthDate,
          isGroup: validatedData.isGroup,
          amount: Math.round(validatedData.amount * 100), // В копейках
          currency: 'RUB',
          paymentMethod: validatedData.paymentMethod,
          note: validatedData.note,
          status: 'created',
        },
      })

      // 2. Создаем платеж в YooKassa
      const paymentMethodType = validatedData.paymentMethod === 'sbp' ? 'sbp' : 'bank_card'
      const returnUrl = `${process.env.FRONTEND_URL}/donate?payment_id=${donation.id}`

      const yookassaPayment = await yookassaService.createPayment({
        amount: validatedData.amount,
        currency: 'RUB',
        description: `Пожертвование #${donation.id.slice(0, 8)}`,
        returnUrl: returnUrl,
        paymentMethodType: paymentMethodType,
        metadata: {
          donationId: donation.id,
          phone: validatedData.phone,
        },
      })

      // 3. Обновляем donation с данными YooKassa
      const updatedDonation = await prisma.donation.update({
        where: { id: donation.id },
        data: {
          yookassaPaymentId: yookassaPayment.id,
          yookassaStatus: yookassaPayment.status,
          confirmationUrl: yookassaPayment.confirmation.confirmation_url,
          status: 'pending',
        },
      })

      // 4. Возвращаем результат
      res.status(201).json({
        success: true,
        data: {
          donationId: updatedDonation.id,
          paymentId: yookassaPayment.id,
          confirmationUrl: yookassaPayment.confirmation.confirmation_url,
          amount: validatedData.amount,
          currency: 'RUB',
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Получение информации о пожертвовании
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const donation = await prisma.donation.findUnique({
        where: { id },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          yookassaStatus: true,
          paymentMethod: true,
          createdAt: true,
          paidAt: true,
          name: true,
          isGroup: true,
        },
      })

      if (!donation) {
        return res.status(404).json({
          success: false,
          error: 'Donation not found',
        })
      }

      res.json({
        success: true,
        data: {
          ...donation,
          amount: donation.amount / 100, // Переводим обратно в рубли
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Получение статуса платежа
   */
  async getPaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const donation = await prisma.donation.findUnique({
        where: { id },
        select: {
          yookassaPaymentId: true,
          status: true,
        },
      })

      if (!donation || !donation.yookassaPaymentId) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
        })
      }

      // Получаем актуальную информацию из YooKassa
      const yookassaPayment = await yookassaService.getPayment(donation.yookassaPaymentId)

      // Обновляем статус в БД если изменился
      if (yookassaPayment.status !== donation.status) {
        await prisma.donation.update({
          where: { id },
          data: {
            yookassaStatus: yookassaPayment.status,
            status: yookassaPayment.paid ? 'succeeded' : donation.status,
            paidAt: yookassaPayment.paid ? new Date() : null,
          },
        })
      }

      res.json({
        success: true,
        data: {
          paymentId: yookassaPayment.id,
          status: yookassaPayment.status,
          paid: yookassaPayment.paid,
          amount: yookassaPayment.amount.value,
          currency: yookassaPayment.amount.currency,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export const donationController = new DonationController()
```

---

### 2.5 Webhook Controller

**Файл:** `src/controllers/webhookController.ts`

```typescript
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import crypto from 'crypto'

export class WebhookController {
  /**
   * Обработка webhook от YooKassa
   */
  async handleYooKassaWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = req.body

      // 1. Валидация webhook (опционально, но рекомендуется)
      // const isValid = this.validateWebhookSignature(req)
      // if (!isValid) {
      //   return res.status(400).json({ error: 'Invalid signature' })
      // }

      // 2. Проверяем тип события
      if (notification.event !== 'payment.succeeded' && notification.event !== 'payment.canceled') {
        return res.status(200).json({ received: true })
      }

      const payment = notification.object

      // 3. Находим donation по yookassaPaymentId
      const donation = await prisma.donation.findUnique({
        where: { yookassaPaymentId: payment.id },
      })

      if (!donation) {
        console.error(`Donation not found for payment ${payment.id}`)
        return res.status(404).json({ error: 'Donation not found' })
      }

      // 4. Обновляем статус donation
      const updateData: any = {
        yookassaStatus: payment.status,
        updatedAt: new Date(),
      }

      if (notification.event === 'payment.succeeded') {
        updateData.status = 'succeeded'
        updateData.paidAt = new Date(payment.created_at)
      } else if (notification.event === 'payment.canceled') {
        updateData.status = 'failed'
      }

      await prisma.donation.update({
        where: { id: donation.id },
        data: updateData,
      })

      console.log(`Donation ${donation.id} updated: ${updateData.status}`)

      // 5. Здесь можно отправить email уведомление донору
      // await emailService.sendDonationConfirmation(donation)

      // 6. Отправляем 200 OK чтобы YooKassa знала что webhook обработан
      res.status(200).json({ received: true })
    } catch (error) {
      console.error('Webhook processing error:', error)
      next(error)
    }
  }

  /**
   * Валидация подписи webhook (опционально)
   */
  private validateWebhookSignature(req: Request): boolean {
    // Реализация зависит от настроек YooKassa
    // См. документацию: https://yookassa.ru/developers/using-api/webhooks
    return true
  }
}

export const webhookController = new WebhookController()
```

---

### 2.6 Routes

**Файл:** `src/routes/donations.ts`

```typescript
import { Router } from 'express'
import { donationController } from '../controllers/donationController'

const router = Router()

// POST /api/donations - Создать новое пожертвование
router.post('/', (req, res, next) => donationController.create(req, res, next))

// GET /api/donations/:id - Получить информацию о пожертвовании
router.get('/:id', (req, res, next) => donationController.getById(req, res, next))

// GET /api/donations/:id/status - Получить статус платежа
router.get('/:id/status', (req, res, next) => donationController.getPaymentStatus(req, res, next))

export default router
```

**Файл:** `src/routes/webhooks.ts`

```typescript
import { Router } from 'express'
import { webhookController } from '../controllers/webhookController'

const router = Router()

// POST /api/webhooks/yookassa - Webhook от YooKassa
router.post('/yookassa', (req, res, next) =>
  webhookController.handleYooKassaWebhook(req, res, next)
)

export default router
```

---

### 2.7 Server Entry Point

**Файл:** `src/server.ts`

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import donationRoutes from './routes/donations'
import webhookRoutes from './routes/webhooks'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/donations', donationRoutes)
app.use('/api/webhooks', webhookRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
```

---

## Этап 3: Frontend интеграция

### 3.1 Environment Variables

**Файл:** `.env.example` (обновить)

```bash
# YooKassa (только для тестирования, НЕ использовать в production!)
# В production все запросы идут через Backend API

# Backend API
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_URL=http://localhost:5173
```

---

### 3.2 API Client

**Файл:** `src/services/api/apiClient.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Можно добавить auth token если нужно
        // const token = localStorage.getItem('token')
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Обработка ошибок
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  get instance() {
    return this.client
  }
}

export const apiClient = new ApiClient().instance
```

---

### 3.3 Payment Service

**Файл:** `src/services/api/paymentService.ts`

```typescript
import { apiClient } from './apiClient'
import type { BlankFormValues, PaymentFormValues } from '@/lib/types'

export interface CreatePaymentRequest {
  // Данные из BlankForm
  phone: string
  phoneCountry: 'RU' | 'TJ'
  name?: string
  birthDate: Date
  isGroup: boolean

  // Данные из PaymentForm
  amount: number
  paymentMethod: 'sbp' | 'bankcard'
  note?: string
}

export interface CreatePaymentResponse {
  success: boolean
  data: {
    donationId: string
    paymentId: string
    confirmationUrl: string
    amount: number
    currency: string
  }
}

export interface PaymentStatusResponse {
  success: boolean
  data: {
    paymentId: string
    status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
    paid: boolean
    amount: string
    currency: string
  }
}

export interface DonationDetailsResponse {
  success: boolean
  data: {
    id: string
    amount: number
    currency: string
    status: string
    yookassaStatus: string
    paymentMethod: string
    createdAt: string
    paidAt: string | null
    name?: string
    isGroup: boolean
  }
}

class PaymentService {
  /**
   * Создание платежа
   */
  async createPayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const response = await apiClient.post<CreatePaymentResponse>('/donations', {
      phone: data.phone,
      phoneCountry: data.phoneCountry,
      name: data.name,
      birthDate: data.birthDate.toISOString(),
      isGroup: data.isGroup,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      note: data.note,
    })

    return response.data
  }

  /**
   * Получение статуса платежа
   */
  async getPaymentStatus(donationId: string): Promise<PaymentStatusResponse> {
    const response = await apiClient.get<PaymentStatusResponse>(`/donations/${donationId}/status`)
    return response.data
  }

  /**
   * Получение информации о пожертвовании
   */
  async getDonationDetails(donationId: string): Promise<DonationDetailsResponse> {
    const response = await apiClient.get<DonationDetailsResponse>(`/donations/${donationId}`)
    return response.data
  }
}

export const paymentService = new PaymentService()
```

---

### 3.4 Обновление Donation Store

**Файл:** `src/stores/donation.ts` (добавить методы)

```typescript
// Добавить в useDonationStore:

import { paymentService } from '@/services/api/paymentService'

// ... existing code ...

/**
 * Отправка данных на сервер и создание платежа
 */
async function submitPayment() {
  try {
    // Валидация перед отправкой
    if (!validateForm('blank') || !validateForm('payment')) {
      return { success: false, error: 'Validation failed' }
    }

    // Формируем запрос
    const paymentRequest = {
      phone: formData.blank.phone!,
      phoneCountry: formData.blank.phoneCountry,
      name: formData.blank.name,
      birthDate: formData.blank.birth!,
      isGroup: formData.blank.isGroup,
      amount: formData.payment.amount!,
      paymentMethod: formData.payment.type!,
      note: formData.payment.note,
    }

    // Отправляем на backend
    const response = await paymentService.createPayment(paymentRequest)

    if (response.success) {
      // Сохраняем данные платежа
      paymentResult.value = {
        success: true,
        paymentId: response.data.paymentId,
        donationId: response.data.donationId,
        amount: response.data.amount,
        currency: response.data.currency,
      }

      // Перенаправляем пользователя на страницу оплаты YooKassa
      window.location.href = response.data.confirmationUrl
    }

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error('Payment submission error:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create payment',
    }
  }
}

/**
 * Проверка статуса платежа по donation ID
 */
async function checkPaymentStatus(donationId: string) {
  try {
    const response = await paymentService.getPaymentStatus(donationId)

    if (response.success) {
      const isPaid = response.data.paid
      const status = response.data.status

      setPaymentResult({
        success: isPaid,
        paymentId: response.data.paymentId,
        status: status,
      })

      if (isPaid) {
        paymentCompleted.value = true
        currentStep.value = 3
      }

      return { success: true, data: response.data }
    }

    return { success: false }
  } catch (error: any) {
    console.error('Check payment status error:', error)
    return { success: false, error: error.message }
  }
}

// Экспортируем новые методы
return {
  // ... existing exports ...
  submitPayment,
  checkPaymentStatus,
}
```

---

### 3.5 Обновление PaymentForm.vue

**Файл:** `src/components/donation/forms/PaymentForm.vue` (добавить обработку submit)

В разделе `<script setup>`:

```typescript
// Добавить обработчик отправки формы
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

async function handleSubmit() {
  // Эта функция будет вызываться из DonateLayout при нажатии "Далее"
  // на шаге 2 (PaymentForm)

  isSubmitting.value = true
  submitError.value = null

  try {
    const result = await donationStore.submitPayment()

    if (!result.success) {
      submitError.value = result.error || 'Не удалось создать платеж'
      return false
    }

    // submitPayment сам перенаправит на страницу YooKassa
    return true
  } catch (error: any) {
    submitError.value = error.message || 'Произошла ошибка'
    return false
  } finally {
    isSubmitting.value = false
  }
}

// Экспортируем для DonateLayout
defineExpose({ handleSubmit })
```

---

### 3.6 Обновление DonateLayout.vue

**Файл:** `src/components/donation/DonateLayout.vue`

```typescript
// В методе handleNext() добавить обработку для шага 2:

async function handleNext() {
  const currentStatus = donationStore.currentStatus

  // Шаг 1: Валидация анкеты
  if (currentStatus === 'blank') {
    const isValid = donationStore.validateForm('blank')
    if (isValid) {
      donationStore.nextStep()
      scrollToForm()
    }
    return
  }

  // Шаг 2: Отправка платежа
  if (currentStatus === 'payment') {
    const isValid = donationStore.validateForm('payment')
    if (!isValid) return

    // Вызываем handleSubmit из PaymentForm
    const paymentFormRef = ref<{ handleSubmit: () => Promise<boolean> } | null>(null)

    if (paymentFormRef.value) {
      const success = await paymentFormRef.value.handleSubmit()
      if (success) {
        // Пользователь будет перенаправлен на YooKassa
        // После оплаты вернется на /donate?payment_id=xxx
      }
    }
    return
  }
}
```

---

### 3.7 Обновление DonatePage.vue

**Файл:** `src/pages/DonatePage.vue`

```typescript
// Добавить обработку return URL от YooKassa

import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useDonationStore } from '@/stores/donation'

const route = useRoute()
const donationStore = useDonationStore()

onMounted(async () => {
  // Проверяем есть ли payment_id в URL (возврат от YooKassa)
  const paymentId = route.query.payment_id as string

  if (paymentId) {
    // Проверяем статус платежа
    await donationStore.checkPaymentStatus(paymentId)

    // Переходим на шаг Result
    donationStore.goToStep(3)
  }
})
```

---

### 3.8 Обновление ResultForm.vue

**Файл:** `src/components/donation/forms/ResultForm.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useDonationStore } from '@/stores/donation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'

const donationStore = useDonationStore()

const paymentResult = computed(() => donationStore.paymentResult)
const isSuccess = computed(() => paymentResult.value?.success === true)

const handleNewDonation = () => {
  donationStore.resetForm()
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="flex items-center gap-3">
          <Icon
            :class="[
              'size-10',
              isSuccess ? 'f7--checkmark-circle text-green-500' : 'f7--xmark-circle text-red-500',
            ]"
          />
          <span>{{ isSuccess ? 'Платеж успешен!' : 'Платеж не выполнен' }}</span>
        </CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <div v-if="paymentResult">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-muted-foreground">ID платежа:</span>
              <span class="font-mono">{{ paymentResult.paymentId }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-muted-foreground">Сумма:</span>
              <span class="font-semibold">
                {{ paymentResult.amount }} {{ paymentResult.currency || 'RUB' }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-muted-foreground">Статус:</span>
              <span :class="[isSuccess ? 'text-green-600' : 'text-red-600']">
                {{ isSuccess ? 'Оплачено' : paymentResult.status }}
              </span>
            </div>
          </div>

          <div v-if="isSuccess" class="mt-6 p-4 bg-green-50 rounded-md">
            <p class="text-green-800">
              Спасибо за ваше пожертвование! Вы помогаете развитию нашего посёлка.
            </p>
          </div>

          <div v-else class="mt-6 p-4 bg-red-50 rounded-md">
            <p class="text-red-800">
              К сожалению, платеж не был завершен. Попробуйте еще раз или свяжитесь с поддержкой.
            </p>
          </div>
        </div>

        <Button @click="handleNewDonation" variant="outline" class="w-full mt-4">
          Сделать новое пожертвование
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
```

---

## Этап 4: Настройка YooKassa

### 4.1 Настройка уведомлений (Webhooks)

**Задачи:**
- [ ] Войти в личный кабинет YooKassa
- [ ] Перейти в "Настройки" → "Уведомления"
- [ ] Добавить URL для webhook: `https://your-domain.com/api/webhooks/yookassa`
- [ ] Выбрать события для уведомлений:
  - `payment.succeeded` - Платеж успешно завершен
  - `payment.canceled` - Платеж отменен
- [ ] Сохранить настройки

**Важно:**
- URL должен быть доступен из интернета (не localhost)
- Для локальной разработки использовать ngrok или локалтоннель

---

### 4.2 Настройка Return URL

**Задачи:**
- [ ] В настройках YooKassa указать разрешенные return URLs:
  - Production: `https://your-domain.com/donate`
  - Staging: `https://staging.your-domain.com/donate`
  - Dev (для тестов): `http://localhost:5173/donate`

---

### 4.3 Настройка способов оплаты

**Задачи:**
- [ ] Включить нужные методы оплаты:
  - ✅ Банковские карты (Visa, Mastercard, МИР)
  - ✅ СБП (Система Быстрых Платежей)
  - ⬜ ЮMoney (опционально)
  - ⬜ QIWI (опционально)
- [ ] Настроить комиссию (берется ли с донора или нет)
- [ ] Настроить минимальную сумму платежа

---

## Этап 5: Тестирование

### 5.1 Локальное тестирование

**Задачи:**
- [ ] Запустить backend в dev режиме
  ```bash
  cd donation-backend
  npm run dev
  ```
- [ ] Запустить frontend в dev режиме
  ```bash
  pnpm dev
  ```
- [ ] Настроить ngrok для webhook
  ```bash
  ngrok http 3000
  # Скопировать URL и добавить в YooKassa webhook settings
  ```
- [ ] Протестировать flow:
  1. Заполнить BlankForm
  2. Заполнить PaymentForm
  3. Нажать "Далее"
  4. Проверить редирект на YooKassa
  5. Использовать тестовую карту (см. ниже)
  6. Проверить возврат на сайт
  7. Проверить ResultForm

---

### 5.2 Тестовые данные YooKassa

**Тестовые карты:**

✅ **Успешная оплата:**
```
Номер: 5555 5555 5555 4444
Срок: 12/24 (любая будущая дата)
CVC: 123
```

❌ **Отклоненная оплата:**
```
Номер: 5555 5555 5555 5599
Срок: 12/24
CVC: 123
```

⏳ **3-D Secure (требует подтверждения):**
```
Номер: 5555 5555 5555 4477
Срок: 12/24
CVC: 123
Код подтверждения: любой (в тестовом режиме)
```

**Тестовые суммы:**
- Любая сумма от 100 рублей работает в тестовом режиме

---

### 5.3 E2E тесты (Playwright)

**Файл:** `tests/e2e/yookassa-payment.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('YooKassa Payment Flow', () => {
  test('should complete successful payment', async ({ page }) => {
    // 1. Открываем страницу пожертвования
    await page.goto('/donate')

    // 2. Заполняем BlankForm
    await page.fill('input[name="phone"]', '9123456789')
    await page.fill('input[name="birth"]', '1990-01-01')
    await page.click('button:has-text("Далее")')

    // 3. Заполняем PaymentForm
    await page.click('button:has-text("1 000,00")')
    await page.click('text=СБП')
    await page.click('button:has-text("Далее")')

    // 4. Ожидаем редирект на YooKassa (в тестах можем мокнуть)
    // Или использовать тестовую среду YooKassa

    // 5. Проверяем ResultForm (после мока или реального платежа)
    await expect(page.locator('text=Платеж успешен!')).toBeVisible()
  })
})
```

---

## Этап 6: Deployment

### 6.1 Backend Deployment

**Варианты хостинга:**
- **Railway.app** (Рекомендуется для старта)
- **Heroku**
- **DigitalOcean App Platform**
- **VPS (Ubuntu + PM2 + Nginx)**

**Шаги для Railway.app:**
```bash
# 1. Установить Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Init проект
railway init

# 4. Добавить environment variables
railway variables set YOOKASSA_SHOP_ID=your_shop_id
railway variables set YOOKASSA_SECRET_KEY=your_secret_key
railway variables set DATABASE_URL=postgresql://...
railway variables set FRONTEND_URL=https://your-frontend.com

# 5. Deploy
railway up
```

---

### 6.2 Frontend Deployment

**Обновить `.env.production`:**
```bash
VITE_API_URL=https://your-backend.railway.app/api
VITE_APP_URL=https://your-domain.com
```

**Deploy на Vercel/Netlify:**
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

## Этап 7: Мониторинг и безопасность

### 7.1 Логирование

**Задачи:**
- [ ] Добавить логирование всех платежей
- [ ] Логировать webhook события
- [ ] Настроить алерты для failed платежей
- [ ] Интегрировать Sentry для ошибок

---

### 7.2 Безопасность

**Чеклист:**
- [ ] Секретный ключ YooKassa только на backend
- [ ] HTTPS на production
- [ ] Валидация webhook signature
- [ ] Rate limiting на API endpoints
- [ ] CORS настроен правильно
- [ ] Input санитизация
- [ ] SQL injection protection (Prisma ORM)

---

## Контрольный список (Checklist)

### Backend
- [ ] Prisma schema создана
- [ ] YooKassaService реализован
- [ ] DonationController реализован
- [ ] WebhookController реализован
- [ ] Routes настроены
- [ ] Error handling добавлен
- [ ] Environment variables настроены
- [ ] Database migrations выполнены

### Frontend
- [ ] API client настроен
- [ ] PaymentService реализован
- [ ] DonationStore обновлен (submitPayment, checkPaymentStatus)
- [ ] PaymentForm обновлен (handleSubmit)
- [ ] DonateLayout обновлен (обработка шага 2)
- [ ] DonatePage обновлен (return URL)
- [ ] ResultForm обновлен (отображение результата)

### YooKassa
- [ ] Аккаунт создан и активирован
- [ ] API ключи получены
- [ ] Webhook URL настроен
- [ ] Return URLs настроены
- [ ] Способы оплаты включены
- [ ] Тестовый режим активен

### Testing
- [ ] Локальное тестирование успешно
- [ ] Тестовые карты проверены
- [ ] E2E тесты написаны
- [ ] Webhook тестирование (ngrok)

### Production
- [ ] Backend задеплоен
- [ ] Frontend задеплоен
- [ ] Environment variables настроены
- [ ] Webhook URL обновлен на production
- [ ] Return URLs обновлены на production
- [ ] Мониторинг настроен
- [ ] Логирование работает

---

## Полезные ссылки

- **YooKassa API Документация:** https://yookassa.ru/developers/api
- **Quick Start:** https://yookassa.ru/developers/payment-acceptance/getting-started/quick-start
- **Тестирование:** https://yookassa.ru/developers/using-api/testing
- **Webhook:** https://yookassa.ru/developers/using-api/webhooks
- **SDK (если нужно):** https://github.com/yoomoney/yookassa-sdk-nodejs

---

## Поддержка

При возникновении проблем:
1. Проверить логи backend
2. Проверить статус платежа в личном кабинете YooKassa
3. Обратиться в поддержку YooKassa: support@yookassa.ru
4. Изучить примеры: https://github.com/yoomoney

---

**Следующий шаг:** Начать с Этапа 0 (регистрация и получение ключей)
