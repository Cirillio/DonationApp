import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for Donation Form
 * Encapsulates all interactions with the donation form
 * Makes tests more readable and maintainable
 *
 * Usage:
 * const donationPage = new DonationPage(page)
 * await donationPage.fillPhone('9001234567')
 */
export class DonationPage {
  readonly page: Page

  // Blank Form Fields (Анкета)
  readonly phoneInput: Locator
  readonly phoneCodeDropdown: Locator
  readonly nameInput: Locator
  readonly birthInput: Locator
  readonly isGroupCheckbox: Locator

  // Payment Form Fields (Оплата)
  readonly amountInput: Locator
  readonly noteTextarea: Locator
  readonly submitButton: Locator

  // Form Cards
  readonly blankFormCard: Locator
  readonly paymentFormCard: Locator

  // Dialog
  readonly successDialog: Locator
  readonly dialogCloseButton: Locator

  constructor(page: Page) {
    this.page = page

    // Blank Form Locators
    this.phoneInput = page.getByLabel('Телефон')
    this.phoneCodeDropdown = page.locator('button:has(.f7--chevron-down)')
    this.nameInput = page.getByLabel('Имя')
    this.birthInput = page.getByLabel('Дата рождения')
    this.isGroupCheckbox = page.getByText('От лица группы')

    // Payment Form Locators
    this.amountInput = page.getByLabel('Сумма')
    this.noteTextarea = page.getByPlaceholder(/Можете указать пожелания/)
    this.submitButton = page.getByRole('button', { name: 'Пожертвовать' })

    // Cards
    this.blankFormCard = page.locator('section').filter({ hasText: 'Анкета' })
    this.paymentFormCard = page.locator('section').filter({ hasText: 'Оплата' })

    // Dialog
    this.successDialog = page.locator('[role="dialog"]')
    this.dialogCloseButton = page.getByRole('button', { name: 'Закрыть' })
  }

  /**
   * Navigate to donation page
   */
  async goto() {
    await this.page.goto('/')
  }

  /**
   * Fill phone number (without country code)
   */
  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone)
  }

  /**
   * Select country code from dropdown
   */
  async selectCountryCode(countryName: string) {
    await this.phoneCodeDropdown.click()
    await this.page.getByText(countryName, { exact: true }).click()
  }

  /**
   * Fill name field
   */
  async fillName(name: string) {
    await this.nameInput.fill(name)
  }

  /**
   * Fill birth date (format: дд.мм.гггг)
   */
  async fillBirth(birth: string) {
    await this.birthInput.fill(birth)
  }

  /**
   * Toggle group donation checkbox
   */
  async toggleGroupDonation() {
    await this.isGroupCheckbox.click()
  }

  /**
   * Select preset amount by clicking button
   * Formats the amount to match button labels like "500,00" or "1 000,00"
   */
  async selectPresetAmount(amount: number) {
    // Format number to match button labels with Russian locale
    // 500 → "500,00"
    // 1000 → "1 000,00"
    const formatted = amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    await this.page.getByRole('button', { name: formatted, exact: true }).click()
  }

  /**
   * Fill custom amount
   */
  async fillAmount(amount: string) {
    await this.amountInput.fill(amount)
  }

  /**
   * Select payment method (СБП or Банк карта)
   */
  async selectPaymentMethod(method: 'sbp' | 'card') {
    const methodText = method === 'sbp' ? 'СБП' : 'Банк карта'
    await this.page.getByText(methodText, { exact: true }).click()
  }

  /**
   * Fill note/comment field
   */
  async fillNote(note: string) {
    await this.noteTextarea.fill(note)
  }

  /**
   * Submit the donation form
   */
  async submit() {
    await this.submitButton.click()
  }

  /**
   * Fill complete blank form
   */
  async fillBlankForm(data: { phone: string; name?: string; birth: string; isGroup?: boolean }) {
    await this.fillPhone(data.phone)
    if (data.name) {
      await this.fillName(data.name)
    }
    await this.fillBirth(data.birth)
    if (data.isGroup) {
      await this.toggleGroupDonation()
    }
  }

  /**
   * Fill complete payment form
   */
  async fillPaymentForm(data: { amount: number | string; type: 'sbp' | 'card'; note?: string }) {
    if (typeof data.amount === 'number') {
      await this.selectPresetAmount(data.amount)
    } else {
      await this.fillAmount(data.amount)
    }
    await this.selectPaymentMethod(data.type)
    if (data.note) {
      await this.fillNote(data.note)
    }
  }

  /**
   * Complete full donation flow
   */
  async completeDonation(
    blankData: {
      phone: string
      name?: string
      birth: string
      isGroup?: boolean
    },
    paymentData: {
      amount: number | string
      type: 'sbp' | 'card'
      note?: string
    }
  ) {
    await this.fillBlankForm(blankData)
    await this.fillPaymentForm(paymentData)
    await this.submit()
  }

  /**
   * Get error message by field name
   */
  getErrorMessage(fieldName: string): Locator {
    return this.page.locator(`text=/.*${fieldName}.*/i`).first()
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled()
  }
}

/**
 * Page Object for Navigation
 */
export class NavigationPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async gotoNews() {
    await this.page.getByRole('link', { name: /новости/i }).click()
  }

  async gotoStats() {
    await this.page.getByRole('link', { name: /статистика/i }).click()
  }

  async gotoDonation() {
    await this.page.getByRole('link', { name: /пожертвование/i }).click()
  }
}
