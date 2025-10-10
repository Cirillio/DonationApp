import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'
import { testUsers, testPayments } from '../fixtures/test-data'

/**
 * Anonymous Donation Tests
 * Tests that users can donate without providing a name
 */

test.describe('Anonymous Donation', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test('should allow donation without name (anonymous)', async ({ page }) => {
    // Fill only required fields (phone, birth, amount, payment type)
    await donationPage.fillPhone(testUsers.anonymous.phone)
    // Skip name field - leave it empty
    await donationPage.fillBirth(testUsers.anonymous.birth)
    await donationPage.selectPresetAmount(testPayments.minAmount.amount)
    await donationPage.selectPaymentMethod(testPayments.minAmount.type)

    // Submit button should be enabled (name is optional)
    await expect(donationPage.submitButton).toBeEnabled()

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
    await expect(page.getByText('donation sends successfully')).toBeVisible()
  })

  test('should show "Оставьте пустым для анонимности" hint', async ({ page }) => {
    // Verify the description text is visible
    await expect(page.getByText('Оставьте пустым для анонимности')).toBeVisible()
  })

  test('should allow anonymous donation with custom amount', async ({ page }) => {
    // Fill form without name
    await donationPage.fillPhone('9005551234')
    await donationPage.fillBirth('15.03.1985')

    // Use custom amount instead of preset
    await donationPage.fillAmount('750,00')
    await donationPage.selectPaymentMethod('card')

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should allow anonymous donation with note', async ({ page }) => {
    // Fill form without name but with note
    await donationPage.fillPhone('9007778899')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(1000)
    await donationPage.selectPaymentMethod('sbp')
    await donationPage.fillNote('Анонимное пожертвование на благое дело')

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should keep name field empty if user does not fill it', async ({ page }) => {
    // Don't fill name
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('10.10.1995')

    // Verify name field is still empty
    await expect(donationPage.nameInput).toHaveValue('')
  })

  test('should allow clearing name field to make donation anonymous', async ({ page }) => {
    // Fill name first
    await donationPage.fillName('Иван Иванов')
    await expect(donationPage.nameInput).toHaveValue('Иван Иванов')

    // Clear name to make it anonymous
    await donationPage.nameInput.clear()
    await expect(donationPage.nameInput).toHaveValue('')

    // Complete donation
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    // Should still be able to submit
    await donationPage.submit()
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should work with minimum required fields only', async ({ page }) => {
    // Only fill the 4 required fields:
    // 1. Phone
    await donationPage.fillPhone('9009998877')

    // 2. Birth date
    await donationPage.fillBirth('20.05.1988')

    // 3. Amount
    await donationPage.selectPresetAmount(100)

    // 4. Payment type
    await donationPage.selectPaymentMethod('sbp')

    // Name and note are optional - don't fill them
    await expect(donationPage.nameInput).toHaveValue('')
    await expect(donationPage.noteTextarea).toHaveValue('')

    // Submit should work
    await donationPage.submit()
    await expect(donationPage.successDialog).toBeVisible()
  })
})
