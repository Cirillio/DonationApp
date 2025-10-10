import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'
import { invalidData } from '../fixtures/test-data'

/**
 * Simplified Form Validation Tests
 * Tests validation by checking submit button state and actual error messages that appear
 */

test.describe('Form Validation - Simplified', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test.describe('Required Fields', () => {
    test('should disable submit when phone is missing', async ({ page }) => {
      // Fill everything except phone
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })

    test('should disable submit when birth date is missing', async ({ page }) => {
      // Fill everything except birth
      await donationPage.fillPhone('9001234567')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })

    test('should disable submit when amount is missing', async ({ page }) => {
      // Fill everything except amount
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })

    test('should disable submit when payment method is missing', async ({ page }) => {
      // Fill everything except payment method
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })
  })

  test.describe('Phone Validation', () => {
    test('should show error and disable submit for invalid phone', async ({ page }) => {
      // Fill invalid phone
      await donationPage.fillPhone(invalidData.phone.tooShort)
      await donationPage.phoneInput.blur()

      // Fill other fields
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled due to invalid phone
      await expect(donationPage.submitButton).toBeDisabled()

      // Error message should appear
      await expect(page.getByText('Номер указан неверно.')).toBeVisible()
    })

    test('should accept valid phone and enable submit', async ({ page }) => {
      // Fill valid phone
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be enabled
      await expect(donationPage.submitButton).toBeEnabled()
    })
  })

  test.describe('Name Validation', () => {
    test('should show error for too short name', async ({ page }) => {
      await donationPage.fillName(invalidData.name.tooShort)
      await donationPage.nameInput.blur()

      // Error should appear
      await expect(page.getByText('Хотя бы 3 символа.')).toBeVisible()
    })

    test('should accept valid name', async ({ page }) => {
      await donationPage.fillName('Иван Иванов')
      await donationPage.nameInput.blur()

      // No error
      await expect(page.getByText('Хотя бы 3 символа.')).not.toBeVisible()
    })

    test('should allow empty name (optional)', async ({ page }) => {
      // Complete form without name
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be enabled
      await expect(donationPage.submitButton).toBeEnabled()
    })
  })

  test.describe('Birth Date Validation', () => {
    test('should show error for too young (under 18)', async ({ page }) => {
      await donationPage.fillBirth(invalidData.birth.tooYoung)
      await donationPage.birthInput.blur()

      // Error should appear
      await expect(page.getByText('Вам должно быть не менее 18 лет.')).toBeVisible()

      // Fill other fields
      await donationPage.fillPhone('9001234567')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })

    test('should show error for too old (over 100)', async ({ page }) => {
      await donationPage.fillBirth(invalidData.birth.tooOld)
      await donationPage.birthInput.blur()

      // Error should appear
      await expect(page.getByText('Возраст не может быть больше 100 лет.')).toBeVisible()

      // Fill other fields
      await donationPage.fillPhone('9001234567')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })

    test('should show error for invalid date format', async ({ page }) => {
      await donationPage.fillBirth(invalidData.birth.invalidFormat)
      await donationPage.birthInput.blur()

      // Error should appear
      await expect(page.getByText('Такой даты не существует.')).toBeVisible()
    })

    test('should accept valid birth date', async ({ page }) => {
      await donationPage.fillBirth('01.01.1990')
      await donationPage.birthInput.blur()

      // No errors
      await expect(page.getByText(/лет/i)).not.toBeVisible()

      // Complete form
      await donationPage.fillPhone('9001234567')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be enabled
      await expect(donationPage.submitButton).toBeEnabled()
    })
  })

  test.describe('Amount Validation', () => {
    test('should disable submit for amount below minimum', async ({ page }) => {
      // Fill all fields with valid data except amount
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.fillAmount('50')
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })

    test('should accept minimum amount (100)', async ({ page }) => {
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(100)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be enabled
      await expect(donationPage.submitButton).toBeEnabled()
    })

    test('should accept amount above minimum', async ({ page }) => {
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be enabled
      await expect(donationPage.submitButton).toBeEnabled()
    })
  })

  test.describe('Overall Form State', () => {
    test('should keep submit disabled until all required fields are valid', async ({ page }) => {
      // Initially disabled
      await expect(donationPage.submitButton).toBeDisabled()

      // Add phone
      await donationPage.fillPhone('9001234567')
      await expect(donationPage.submitButton).toBeDisabled()

      // Add birth
      await donationPage.fillBirth('01.01.1990')
      await expect(donationPage.submitButton).toBeDisabled()

      // Add amount
      await donationPage.selectPresetAmount(500)
      await expect(donationPage.submitButton).toBeDisabled()

      // Add payment method - NOW it should be enabled
      await donationPage.selectPaymentMethod('sbp')
      await expect(donationPage.submitButton).toBeEnabled()
    })

    test('should disable submit if valid field becomes invalid', async ({ page }) => {
      // Fill all fields validly
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')
      await expect(donationPage.submitButton).toBeEnabled()

      // Break birth date
      await donationPage.birthInput.clear()
      await donationPage.fillBirth(invalidData.birth.tooYoung)
      await donationPage.birthInput.blur()

      // Submit should be disabled
      await expect(donationPage.submitButton).toBeDisabled()
    })
  })
})
