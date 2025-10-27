import { test, expect } from '@playwright/test'
import { DonationPage, NavigationPage } from '../utils/page-objects'

/**
 * Leave Confirmation Dialog Tests
 * Tests the confirmation dialog that appears when user tries to leave with unsaved data
 */

test.describe('Leave Confirmation', () => {
  let donationPage: DonationPage
  let navigationPage: NavigationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    navigationPage = new NavigationPage(page)
    await donationPage.goto()
  })

  test.describe('Dialog Should Appear', () => {
    test('should show dialog when leaving with unsaved phone data', async ({ page }) => {
      // Fill only phone
      await donationPage.fillPhone('9001234567')

      // Try to navigate away
      await page
        .getByRole('navigation')
        .getByRole('link', { name: /главная/i })
        .click()

      // Dialog should appear
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
      await expect(page.getByText('Вы уверены, что хотите выйти?')).toBeVisible()
      await expect(page.getByText('Все введённые данные будут утеряны.')).toBeVisible()
    })

    test('should show dialog when leaving with unsaved birth data', async ({ page }) => {
      // Fill only birth date
      await donationPage.fillBirth('01.01.1990')

      // Try to navigate away
      await navigationPage.gotoNews()

      // Dialog should appear
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
    })

    test('should show dialog when leaving with unsaved amount', async ({ page }) => {
      // Fill only amount
      await donationPage.selectPresetAmount(500)

      // Try to navigate away
      await navigationPage.gotoStats()

      // Dialog should appear
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
    })

    test('should show dialog when leaving with unsaved payment method', async ({ page }) => {
      // Fill only payment method
      await donationPage.selectPaymentMethod('sbp')

      // Try to navigate away
      await page
        .getByRole('navigation')
        .getByRole('link', { name: /главная/i })
        .click()

      // Dialog should appear
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
    })

    test('should show dialog when leaving with partially filled form', async ({ page }) => {
      // Fill some fields
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)

      // Try to navigate away
      await navigationPage.gotoNews()

      // Dialog should appear
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
    })

    test('should show dialog when leaving with optional name field filled', async ({ page }) => {
      // Fill only optional name (should still trigger dialog)
      await donationPage.fillName('Иван Иванов')

      // Try to navigate away
      await navigationPage.gotoStats()

      // Dialog should appear (name is significant data)
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
    })
  })

  test.describe('Dialog Should NOT Appear', () => {
    test('should not show dialog when form is completely empty', async ({ page }) => {
      // Don't fill anything

      // Navigate away
      await navigationPage.gotoNews()

      // Dialog should NOT appear
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()

      // Should successfully navigate to news page
      await expect(page).toHaveURL(/.*news/)
    })

    test('should not show dialog after clearing all filled data', async ({ page }) => {
      // Fill form
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)

      // Clear everything back to default
      await donationPage.phoneInput.clear()
      await donationPage.birthInput.clear()
      await page.reload() // Reload to reset amount selection

      // Navigate away
      await navigationPage.gotoNews()

      // Dialog should NOT appear
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()
    })

    test('should not show dialog after successful submission', async ({ page }) => {
      // Complete full donation
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)
      await donationPage.selectPaymentMethod('sbp')
      await donationPage.submit()

      // Wait for success
      await expect(donationPage.successDialog).toBeVisible()

      // Close success dialog
      await donationPage.dialogCloseButton.click()

      // Navigate away
      await navigationPage.gotoNews()

      // Dialog should NOT appear (payment was successful)
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()
    })

    test('should not show dialog when navigating with payment-token', async ({ page }) => {
      // Navigate to donate page with payment token
      await page.goto('/donate?payment-token=test123')

      // Try to navigate away immediately
      await navigationPage.gotoNews()

      // Dialog should NOT appear (we're on result step)
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()
    })
  })

  test.describe('Dialog Actions', () => {
    test('should stay on page when clicking "Остаться"', async ({ page }) => {
      // Fill some data
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')

      // Try to navigate
      await navigationPage.gotoNews()

      // Dialog appears
      await expect(donationPage.leaveConfirmDialog).toBeVisible()

      // Click stay button
      await donationPage.leaveConfirmStayButton.click()

      // Dialog should close
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()

      // Should still be on donate page
      await expect(page).toHaveURL(/.*donate/)

      // Data should still be there
      await expect(donationPage.phoneInput).toHaveValue('(900) 123-45-67')
    })

    test('should leave page and clear data when clicking "Выйти"', async ({ page }) => {
      // Fill some data
      await donationPage.fillPhone('9001234567')
      await donationPage.fillBirth('01.01.1990')
      await donationPage.selectPresetAmount(500)

      // Try to navigate
      await navigationPage.gotoNews()

      // Dialog appears
      await expect(donationPage.leaveConfirmDialog).toBeVisible()

      // Click leave button
      await donationPage.leaveConfirmLeaveButton.click()

      // Should navigate to news page
      await expect(page).toHaveURL(/.*news/)

      // Go back to donate page
      await navigationPage.gotoDonation()

      // Form should be empty (data was cleared)
      await expect(donationPage.phoneInput).toHaveValue('')
      await expect(donationPage.birthInput).toHaveValue('')
    })

    test('should close dialog on escape key press', async ({ page }) => {
      // Fill some data
      await donationPage.fillPhone('9001234567')

      // Try to navigate
      await navigationPage.gotoNews()

      // Dialog appears
      await expect(donationPage.leaveConfirmDialog).toBeVisible()

      // Press Escape
      await page.keyboard.press('Escape')

      // Dialog should close
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()

      // Should stay on donate page
      await expect(page).toHaveURL(/.*donate/)
    })
  })

  test.describe('Edge Cases', () => {
    test('should handle multiple navigation attempts', async ({ page }) => {
      // Fill data
      await donationPage.fillPhone('9001234567')

      // First navigation attempt
      await navigationPage.gotoNews()
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
      await donationPage.leaveConfirmStayButton.click()

      // Second navigation attempt
      await navigationPage.gotoStats()
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
      await donationPage.leaveConfirmStayButton.click()

      // Data should still be there
      await expect(donationPage.phoneInput).toHaveValue('(900) 123-45-67')
    })

    test('should not show dialog when only ignored fields are changed', async ({ page }) => {
      // phoneCountry and isGroup are ignored fields

      // Toggle isGroup checkbox
      await donationPage.toggleGroupDonation()

      // Try to navigate
      await navigationPage.gotoNews()

      // Dialog should NOT appear (isGroup is ignored)
      await expect(donationPage.leaveConfirmDialog).not.toBeVisible()
    })

    test('should show dialog when clearing and then refilling data', async ({ page }) => {
      // Fill and clear
      await donationPage.fillPhone('9001234567')
      await donationPage.phoneInput.clear()

      // Refill with different value
      await donationPage.fillPhone('9009876543')

      // Try to navigate
      await navigationPage.gotoNews()

      // Dialog should appear (data has changed from default)
      await expect(donationPage.leaveConfirmDialog).toBeVisible()
    })
  })
})
