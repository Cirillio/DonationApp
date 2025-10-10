import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'

/**
 * Phone Country Selector Tests
 * Tests the phone country code dropdown functionality
 */

test.describe('Phone Country Selector', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test('should display default country code (+7 Russia)', async ({ page }) => {
    // Verify default country code is visible
    await expect(page.getByText('+7', { exact: true }).first()).toBeVisible()
  })

  test('should switch to Tajikistan country code', async ({ page }) => {
    // Click dropdown to open country selector
    await donationPage.phoneCodeDropdown.click()

    // Select Tajikistan
    await page.getByText('Таджикистан', { exact: true }).click()

    // Verify code changed to +992
    await expect(page.getByText('+992', { exact: true }).first()).toBeVisible()
  })

  test('should switch back to Russia after selecting Tajikistan', async ({ page }) => {
    // Switch to Tajikistan
    await donationPage.phoneCodeDropdown.click()
    await page.getByText('Таджикистан', { exact: true }).click()
    await expect(page.getByText('+992', { exact: true }).first()).toBeVisible()

    // Switch back to Russia
    await donationPage.phoneCodeDropdown.click()
    await page.getByText('Россия', { exact: true }).click()

    // Verify code is +7 again
    await expect(page.getByText('+7', { exact: true }).first()).toBeVisible()
  })

  test('should clear phone input when switching country', async ({ page }) => {
    // Fill Russian phone number
    await donationPage.fillPhone('9001234567')

    // Verify phone is filled with formatted value (auto-masked)
    await expect(donationPage.phoneInput).toHaveValue('(900) 123-45-67')

    // Switch to Tajikistan
    await donationPage.phoneCodeDropdown.click()
    await page.getByText('Таджикистан', { exact: true }).click()

    // Phone input should be cleared (because mask changed)
    await expect(donationPage.phoneInput).toHaveValue('')
  })

  test('should show correct placeholder mask for Russia', async ({ page }) => {
    // Russia uses mask: (###) ###-##-##
    const placeholder = await donationPage.phoneInput.getAttribute('placeholder')

    // Verify placeholder matches Russian mask
    expect(placeholder).toBe('(###) ###-##-##')
  })

  test('should show correct placeholder mask for Tajikistan', async ({ page }) => {
    // Switch to Tajikistan
    await donationPage.phoneCodeDropdown.click()
    await page.getByText('Таджикистан', { exact: true }).click()

    // Tajikistan uses mask: ## ### ## ##
    const placeholder = await donationPage.phoneInput.getAttribute('placeholder')

    // Verify placeholder matches Tajikistan mask
    expect(placeholder).toBe('## ### ## ##')
  })

  test('should complete donation with Tajikistan phone number', async ({ page }) => {
    // Switch to Tajikistan
    await donationPage.selectCountryCode('Таджикистан')

    // Fill Tajikistan phone number (9 digits)
    await donationPage.fillPhone('123456789')

    // Fill rest of form
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should show both countries in dropdown menu', async ({ page }) => {
    // Open dropdown
    await donationPage.phoneCodeDropdown.click()

    // Both countries should be visible
    await expect(page.getByText('Россия', { exact: true })).toBeVisible()
    await expect(page.getByText('Таджикистан', { exact: true })).toBeVisible()

    // Both codes should be visible
    await expect(page.getByText('(+7)', { exact: true })).toBeVisible()
    await expect(page.getByText('(+992)', { exact: true })).toBeVisible()
  })
})
