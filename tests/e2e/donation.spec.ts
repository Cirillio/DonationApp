import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'
import { testUsers, testPayments } from '../fixtures/test-data'

/**
 * Main Donation Flow Test
 * Tests the complete user journey: fill form and make a donation
 */

test.describe('Donation Flow', () => {
  let donationPage: DonationPage

  // Run before each test - navigate to donation page
  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test('should successfully complete donation with valid data', async ({ page }) => {
    // Step 1: Fill blank form (Анкета)
    await donationPage.fillPhone(testUsers.validAdult.phone)
    await donationPage.fillName(testUsers.validAdult.name)
    await donationPage.fillBirth(testUsers.validAdult.birth)

    // Step 2: Fill payment form (Оплата)
    await donationPage.selectPresetAmount(testPayments.standardAmount.amount)
    await donationPage.selectPaymentMethod(testPayments.standardAmount.type)
    await donationPage.fillNote(testPayments.standardAmount.note)

    // Step 3: Submit
    await donationPage.submit()

    // Step 4: Verify success dialog appears
    await expect(donationPage.successDialog).toBeVisible()
    await expect(page.getByText('donation sends successfully')).toBeVisible()
  })
})
