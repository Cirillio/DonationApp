import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'

/**
 * Payment Method Tests
 * Tests СБП and Картой онлайн payment method selection and switching
 */

test.describe('Payment Methods', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test('should display both payment methods', async ({ page }) => {
    // Verify both payment methods are visible
    await expect(page.getByText('СБП', { exact: true })).toBeVisible()
    await expect(page.getByText('Картой онлайн', { exact: true })).toBeVisible()
  })

  test('should select СБП payment method', async ({ page }) => {
    await donationPage.selectPaymentMethod('sbp')

    // Verify СБП button is selected (secondary variant)
    const sbpButton = page.getByRole('button').filter({ hasText: 'СБП' })
    await expect(sbpButton).toHaveAttribute('data-variant', 'secondary')
  })

  test('should select Картой онлайн payment method', async ({ page }) => {
    await donationPage.selectPaymentMethod('card')

    // Verify Картой онлайн button is selected (secondary variant)
    const cardButton = page.getByRole('button').filter({ hasText: 'Картой онлайн' })
    await expect(cardButton).toHaveAttribute('data-variant', 'secondary')
  })

  test('should switch from СБП to Картой онлайн', async ({ page }) => {
    // Select СБП first
    await donationPage.selectPaymentMethod('sbp')

    const sbpButton = page.getByRole('button').filter({ hasText: 'СБП' })
    await expect(sbpButton).toHaveAttribute('data-variant', 'secondary')

    // Switch to Картой онлайн
    await donationPage.selectPaymentMethod('card')

    const cardButton = page.getByRole('button').filter({ hasText: 'Картой онлайн' })
    await expect(cardButton).toHaveAttribute('data-variant', 'secondary')

    // СБП should be deselected (outline)
    await expect(sbpButton).toHaveAttribute('data-variant', 'outline')
  })

  test('should switch from Картой онлайн to СБП', async ({ page }) => {
    // Select Картой онлайн first
    await donationPage.selectPaymentMethod('card')

    const cardButton = page.getByRole('button').filter({ hasText: 'Картой онлайн' })
    await expect(cardButton).toHaveAttribute('data-variant', 'secondary')

    // Switch to СБП
    await donationPage.selectPaymentMethod('sbp')

    const sbpButton = page.getByRole('button').filter({ hasText: 'СБП' })
    await expect(sbpButton).toHaveAttribute('data-variant', 'secondary')

    // Картой онлайн should be deselected (outline)
    await expect(cardButton).toHaveAttribute('data-variant', 'outline')
  })

  test('should only allow one payment method selected at a time', async ({ page }) => {
    // Select СБП
    await donationPage.selectPaymentMethod('sbp')

    // Get both buttons
    const sbpButton = page.getByRole('button').filter({ hasText: 'СБП' })
    const cardButton = page.getByRole('button').filter({ hasText: 'Картой онлайн' })

    // Only СБП should be selected (secondary)
    await expect(sbpButton).toHaveAttribute('data-variant', 'secondary')
    await expect(cardButton).toHaveAttribute('data-variant', 'outline')

    // Select Картой онлайн
    await donationPage.selectPaymentMethod('card')

    // Only Картой онлайн should be selected
    await expect(sbpButton).toHaveAttribute('data-variant', 'outline')
    await expect(cardButton).toHaveAttribute('data-variant', 'secondary')
  })

  test('should complete donation with СБП', async ({ page }) => {
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    await donationPage.submit()

    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should complete donation with Картой онлайн', async ({ page }) => {
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(1000)
    await donationPage.selectPaymentMethod('card')

    await donationPage.submit()

    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should enable submit button when payment method is selected', async ({ page }) => {
    // Fill all fields except payment method
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)

    // Submit should be disabled
    await expect(donationPage.submitButton).toBeDisabled()

    // Select payment method
    await donationPage.selectPaymentMethod('sbp')

    // Submit should be enabled
    await expect(donationPage.submitButton).toBeEnabled()
  })

  test('should keep submit enabled when switching payment methods', async ({ page }) => {
    // Fill form with СБП
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    await expect(donationPage.submitButton).toBeEnabled()

    // Switch to Картой онлайн
    await donationPage.selectPaymentMethod('card')

    // Still enabled
    await expect(donationPage.submitButton).toBeEnabled()
  })

  test('should display payment method icons', async ({ page }) => {
    // Check for payment icons (images)
    const sbpButton = page.getByRole('button').filter({ hasText: 'СБП' })
    const cardButton = page.getByRole('button').filter({ hasText: 'Картой онлайн' })

    // Both should have icons (img elements)
    await expect(sbpButton.locator('img')).toBeVisible()
    await expect(cardButton.locator('img')).toBeVisible()
  })
})
