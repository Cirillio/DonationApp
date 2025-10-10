import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'

/**
 * Preset Amount Buttons Tests
 * Tests all preset amount buttons work correctly and provide visual feedback
 */

test.describe('Preset Amount Buttons', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  // Test data: all preset amounts from config
  const presetAmounts = [
    { value: 100, label: '100,00' },
    { value: 500, label: '500,00' },
    { value: 1000, label: '1 000,00' },
    { value: 2500, label: '2 500,00' },
    { value: 5000, label: '5 000,00' },
    { value: 10000, label: '10 000,00' },
  ]

  test('should display all 6 preset amount buttons', async ({ page }) => {
    // Verify all buttons are visible
    for (const amount of presetAmounts) {
      const button = page.getByRole('button', { name: amount.label, exact: true })
      await expect(button).toBeVisible()
    }
  })

  test('should select 100₽ button', async ({ page }) => {
    await donationPage.selectPresetAmount(100)

    // Verify button has secondary variant (selected state)
    const button = page.getByRole('button', { name: '100,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  test('should select 500₽ button', async ({ page }) => {
    await donationPage.selectPresetAmount(500)

    const button = page.getByRole('button', { name: '500,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  test('should select 1000₽ button', async ({ page }) => {
    await donationPage.selectPresetAmount(1000)

    const button = page.getByRole('button', { name: '1 000,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  test('should select 2500₽ button', async ({ page }) => {
    await donationPage.selectPresetAmount(2500)

    const button = page.getByRole('button', { name: '2 500,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  test('should select 5000₽ button', async ({ page }) => {
    await donationPage.selectPresetAmount(5000)

    const button = page.getByRole('button', { name: '5 000,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  test('should select 10000₽ button', async ({ page }) => {
    await donationPage.selectPresetAmount(10000)

    const button = page.getByRole('button', { name: '10 000,00', exact: true })
    await expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  test('should switch between amount buttons', async ({ page }) => {
    // Select 500
    await donationPage.selectPresetAmount(500)
    let button500 = page.getByRole('button', { name: '500,00', exact: true })
    await expect(button500).toHaveAttribute('data-variant', 'secondary')

    // Select 1000
    await donationPage.selectPresetAmount(1000)
    let button1000 = page.getByRole('button', { name: '1 000,00', exact: true })
    await expect(button1000).toHaveAttribute('data-variant', 'secondary')

    // 500 should be deselected
    button500 = page.getByRole('button', { name: '500,00', exact: true })
    await expect(button500).toHaveAttribute('data-variant', 'outline')
  })

  test('should complete donation with each preset amount', async ({ page }) => {
    for (const amount of presetAmounts) {
      // Fill form
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(amount.value)
      await donationPage.selectPaymentMethod('sbp')

      // Submit should be enabled
      await expect(donationPage.submitButton).toBeEnabled()

      // Refresh for next iteration
      await page.reload()
    }
  })

  test('should enable submit button when amount is selected', async ({ page }) => {
    // Fill other required fields
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')

    // Submit disabled (no amount yet)
    await expect(donationPage.submitButton).toBeDisabled()

    // Select amount
    await donationPage.selectPresetAmount(500)

    // Still disabled (no payment method)
    await expect(donationPage.submitButton).toBeDisabled()

    // Add payment method
    await donationPage.selectPaymentMethod('sbp')

    // Now enabled
    await expect(donationPage.submitButton).toBeEnabled()
  })

  test('should show only one amount selected at a time', async ({ page }) => {
    // Click first button
    await donationPage.selectPresetAmount(100)

    // Click second button
    await donationPage.selectPresetAmount(500)

    // First should be outline (deselected)
    const button100 = page.getByRole('button', { name: '100,00', exact: true })
    await expect(button100).toHaveAttribute('data-variant', 'outline')

    // Second should be secondary (selected)
    const button500 = page.getByRole('button', { name: '500,00', exact: true })
    await expect(button500).toHaveAttribute('data-variant', 'secondary')
  })

  test('should work with minimum amount (100₽)', async ({ page }) => {
    // Use minimum amount
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(100)
    await donationPage.selectPaymentMethod('sbp')

    // Submit
    await donationPage.submit()

    // Success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should work with maximum preset amount (10000₽)', async ({ page }) => {
    // Use maximum amount
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(10000)
    await donationPage.selectPaymentMethod('sbp')

    // Submit
    await donationPage.submit()

    // Success
    await expect(donationPage.successDialog).toBeVisible()
  })
})
