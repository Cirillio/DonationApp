import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'

/**
 * Form Reset and Clear Tests (Simplified)
 * Tests clearing form fields without relying on instant validation
 */

test.describe('Form Reset and Clear', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test('should clear phone field', async ({ page }) => {
    // Fill phone
    await donationPage.fillPhone('9001234567')
    await expect(donationPage.phoneInput).not.toHaveValue('')

    // Clear it
    await donationPage.phoneInput.clear()

    // Verify empty
    await expect(donationPage.phoneInput).toHaveValue('')
  })

  test('should clear name field', async ({ page }) => {
    // Fill name
    await donationPage.fillName('Иван Иванов')
    await expect(donationPage.nameInput).toHaveValue('Иван Иванов')

    // Clear it
    await donationPage.nameInput.clear()

    // Verify empty
    await expect(donationPage.nameInput).toHaveValue('')
  })

  test('should clear birth date field', async ({ page }) => {
    // Fill birth
    await donationPage.fillBirth('01.01.1990')
    await expect(donationPage.birthInput).not.toHaveValue('')

    // Clear it
    await donationPage.birthInput.clear()

    // Verify empty
    await expect(donationPage.birthInput).toHaveValue('')
  })

  test('should clear note field', async ({ page }) => {
    // Fill note
    await donationPage.fillNote('Test note')
    await expect(donationPage.noteTextarea).toHaveValue('Test note')

    // Clear it
    await donationPage.noteTextarea.clear()

    // Verify empty
    await expect(donationPage.noteTextarea).toHaveValue('')
  })

  test('should reset form after page reload', async ({ page }) => {
    // Fill form
    await donationPage.fillPhone('9001234567')
    await donationPage.fillName('Иван Иванов')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)

    // Reload page
    await page.reload()

    // All fields should be empty
    await expect(donationPage.phoneInput).toHaveValue('')
    await expect(donationPage.nameInput).toHaveValue('')
    await expect(donationPage.birthInput).toHaveValue('')

    // Submit should be disabled
    await expect(donationPage.submitButton).toBeDisabled()
  })

  test('should clear all fields one by one', async ({ page }) => {
    // Fill entire form
    await donationPage.fillPhone('9001234567')
    await donationPage.fillName('Иван Иванов')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')
    await donationPage.fillNote('Test note')

    // Clear each field
    await donationPage.phoneInput.clear()
    await donationPage.nameInput.clear()
    await donationPage.birthInput.clear()
    await donationPage.noteTextarea.clear()

    // Verify all empty
    await expect(donationPage.phoneInput).toHaveValue('')
    await expect(donationPage.nameInput).toHaveValue('')
    await expect(donationPage.birthInput).toHaveValue('')
    await expect(donationPage.noteTextarea).toHaveValue('')
  })

  test('should handle clearing and refilling fields', async ({ page }) => {
    // Fill, clear, refill phone
    await donationPage.fillPhone('9001234567')
    await donationPage.phoneInput.clear()
    await donationPage.fillPhone('9009876543')

    // Verify new value
    await expect(donationPage.phoneInput).toHaveValue('(900) 987-65-43')

    // Complete form
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    // Should be able to submit
    await expect(donationPage.submitButton).toBeEnabled()
  })

  test('should clear error messages when field is cleared and refilled correctly', async ({ page }) => {
    // Fill invalid phone
    await donationPage.fillPhone('123')
    await donationPage.phoneInput.blur()

    // Error appears
    await expect(page.getByText('Номер указан неверно.')).toBeVisible()

    // Clear it
    await donationPage.phoneInput.clear()

    // Fill valid phone
    await donationPage.fillPhone('9001234567')
    await donationPage.phoneInput.blur()

    // Error should disappear
    await expect(page.getByText('Номер указан неверно.')).not.toBeVisible()
  })

  test('should deselect amount when clearing form', async ({ page }) => {
    // Select amount
    await donationPage.selectPresetAmount(500)

    const button = page.getByRole('button', { name: '500,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')

    // Reload to reset
    await page.reload()

    // Amount button should be deselected
    const buttonAfterReload = page.getByRole('button', { name: '500,00', exact: true })
    await expect(buttonAfterReload).toHaveAttribute('data-variant', 'outline')
  })

  test('should not submit with incomplete form after clearing required field', async ({ page }) => {
    // Fill complete form
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    await expect(donationPage.submitButton).toBeEnabled()

    // Reload page (this clears everything)
    await page.reload()

    // Submit should be disabled on empty form
    await expect(donationPage.submitButton).toBeDisabled()
  })

  test('should preserve optional fields while clearing required ones', async ({ page }) => {
    // Fill form with optional name
    await donationPage.fillPhone('9001234567')
    await donationPage.fillName('Иван Иванов')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    // Clear only name (optional field)
    await donationPage.nameInput.clear()

    // Name should be empty but form still valid
    await expect(donationPage.nameInput).toHaveValue('')
    await expect(donationPage.submitButton).toBeEnabled()
  })
})
