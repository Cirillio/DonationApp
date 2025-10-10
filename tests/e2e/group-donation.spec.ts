import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'
import { testUsers, testPayments } from '../fixtures/test-data'

/**
 * Group Donation Tests
 * Tests the "От лица группы" checkbox functionality
 */

test.describe('Group Donation', () => {
  let donationPage: DonationPage

  test.beforeEach(async ({ page }) => {
    donationPage = new DonationPage(page)
    await donationPage.goto()
  })

  test('should display "От лица группы" checkbox', async ({ page }) => {
    // Verify checkbox is visible
    await expect(donationPage.isGroupCheckbox).toBeVisible()

    // Verify checkbox has proper label/icon
    await expect(page.getByText('От лица группы')).toBeVisible()

    // Verify icon is present (person-2 icon)
    await expect(page.locator('.f7--person-2')).toBeVisible()
  })

  test('should show "Отметьте, если участвует коллектив" description', async ({ page }) => {
    // Verify description text is visible
    await expect(page.getByText('Отметьте, если участвует коллектив')).toBeVisible()
  })

  test('should be unchecked by default', async ({ page }) => {
    // Get the checkbox inside the CheckBlock button
    const checkbox = donationPage.isGroupCheckbox.locator('[role="checkbox"]')
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')
  })

  test('should toggle checkbox on click', async ({ page }) => {
    const button = donationPage.isGroupCheckbox
    const checkbox = button.locator('[role="checkbox"]')

    // Initially unchecked
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')

    // Click button to check
    await donationPage.toggleGroupDonation()
    await expect(checkbox).toHaveAttribute('data-state', 'checked')

    // Click button again to uncheck
    await donationPage.toggleGroupDonation()
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')
  })

  test('should complete donation as a group', async ({ page }) => {
    // Fill form
    await donationPage.fillPhone(testUsers.groupDonation.phone)
    await donationPage.fillName(testUsers.groupDonation.name)
    await donationPage.fillBirth(testUsers.groupDonation.birth)

    // Toggle group checkbox
    await donationPage.toggleGroupDonation()
    const checkbox = donationPage.isGroupCheckbox.locator('[role="checkbox"]')
    await expect(checkbox).toHaveAttribute('data-state', 'checked')

    // Fill payment
    await donationPage.selectPresetAmount(testPayments.largeAmount.amount)
    await donationPage.selectPaymentMethod(testPayments.largeAmount.type)
    await donationPage.fillNote(testPayments.largeAmount.note)

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
    await expect(page.getByText('donation sends successfully')).toBeVisible()
  })

  test('should allow group donation with list of members in note', async ({ page }) => {
    // Fill form
    await donationPage.fillPhone('9005551234')
    await donationPage.fillName('Команда разработчиков')
    await donationPage.fillBirth('15.08.1985')

    // Toggle group
    await donationPage.toggleGroupDonation()

    // Fill payment with member list
    await donationPage.selectPresetAmount(2500)
    await donationPage.selectPaymentMethod('sbp')
    await donationPage.fillNote('Участники:\n1. Иван Иванов\n2. Петр Петров\n3. Мария Сидорова')

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should allow anonymous group donation', async ({ page }) => {
    // Fill form without name (anonymous group)
    await donationPage.fillPhone('9007654321')
    // Skip name
    await donationPage.fillBirth('20.03.1990')

    // Toggle group checkbox
    await donationPage.toggleGroupDonation()
    const checkbox = donationPage.isGroupCheckbox.locator('[role="checkbox"]')
    await expect(checkbox).toHaveAttribute('data-state', 'checked')

    // Fill payment
    await donationPage.selectPresetAmount(1000)
    await donationPage.selectPaymentMethod('card')

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should uncheck group checkbox if clicked twice', async ({ page }) => {
    const button = donationPage.isGroupCheckbox
    const checkbox = button.locator('[role="checkbox"]')
    // Check
    await donationPage.toggleGroupDonation()
    await expect(checkbox).toHaveAttribute('data-state', 'checked')

    // Uncheck
    await donationPage.toggleGroupDonation()
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')

    // Complete donation as individual (not group)
    await donationPage.fillPhone('9001234567')
    await donationPage.fillBirth('01.01.1990')
    await donationPage.selectPresetAmount(500)
    await donationPage.selectPaymentMethod('sbp')

    await donationPage.submit()
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should allow group donation with minimum amount', async ({ page }) => {
    // Fill form
    await donationPage.fillPhone('9008887766')
    await donationPage.fillName('Студенческая группа')
    await donationPage.fillBirth('10.10.2000')

    // Toggle group
    await donationPage.toggleGroupDonation()

    // Use minimum amount (100₽)
    await donationPage.selectPresetAmount(100)
    await donationPage.selectPaymentMethod('sbp')

    // Submit
    await donationPage.submit()

    // Verify success
    await expect(donationPage.successDialog).toBeVisible()
  })

  test('should visually indicate when group checkbox is checked', async ({ page }) => {
    const button = donationPage.isGroupCheckbox
    const checkbox = button.locator('[role="checkbox"]')

    // Click to check
    await donationPage.toggleGroupDonation()

    // Verify checkbox has checked state
    await expect(checkbox).toHaveAttribute('data-state', 'checked')

    // Uncheck
    await donationPage.toggleGroupDonation()

    // Verify it's unchecked
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')
  })
})
