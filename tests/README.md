# Playwright Testing Guide for DonationApp

## Configuration Explained

Your `playwright.config.ts` has been configured with detailed comments. Here's a quick reference:

### Key Settings

| Setting | Value | Why |
|---------|-------|-----|
| `testDir` | `./tests/e2e` | Where test files live |
| `fullyParallel` | `true` | Run tests faster in parallel |
| `baseURL` | `http://localhost:5173` | Your Vite dev server URL |
| `retries` | 0 local, 2 on CI | Retry flaky tests only on CI |
| `workers` | Auto (½ CPU cores) | Parallel test execution |
| `reporter` | `html` | Beautiful HTML reports |
| `webServer` | Auto-starts `pnpm dev` | Starts your app automatically |

### Important Timeouts

- **Test timeout**: 30s (entire test must complete)
- **Expect timeout**: 5s (assertions like `toBeVisible()`)
- **Action timeout**: 10s (clicks, fills, etc.)
- **Navigation timeout**: 15s (page loads)

## Running Tests

```bash
# Run all tests (headless)
pnpm test

# Run tests with browser UI visible
pnpm test --headed

# Run in UI mode (interactive, recommended for development)
pnpm test:ui

# Run specific test file
pnpm test tests/e2e/donation.spec.ts

# Run tests matching pattern
pnpm test --grep "phone"

# Debug mode (stops at debugger statements)
pnpm test:debug

# View last test report
pnpm test:report
```

## Test Structure

```
tests/
├── e2e/                    # Test files
│   ├── donation.spec.ts    # Main donation flow tests
│   ├── validation.spec.ts  # Form validation tests
│   └── ...
├── fixtures/               # Test data
│   └── test-data.ts        # Reusable test data
└── utils/                  # Helpers
    └── page-objects.ts     # Page object models
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test('test description', async ({ page }) => {
  // 1. Navigate
  await page.goto('/')

  // 2. Interact
  await page.getByLabel('Телефон').fill('9001234567')

  // 3. Assert
  await expect(page.getByLabel('Телефон')).toHaveValue('9001234567')
})
```

### Using Page Objects (Recommended)

```typescript
import { test, expect } from '@playwright/test'
import { DonationPage } from '../utils/page-objects'
import { testUsers, testPayments } from '../fixtures/test-data'

test('make donation', async ({ page }) => {
  const donationPage = new DonationPage(page)

  await donationPage.goto()
  await donationPage.fillBlankForm(testUsers.validAdult)
  await donationPage.fillPaymentForm(testPayments.standardAmount)
  await donationPage.submit()

  await expect(donationPage.successDialog).toBeVisible()
})
```

## Locator Strategies

Playwright uses **user-facing** locators (recommended):

```typescript
// ✅ GOOD - User-facing selectors (stable)
page.getByRole('button', { name: 'Пожертвовать' })  // Accessibility role
page.getByLabel('Телефон')                          // Form labels
page.getByPlaceholder('дд.мм.гггг')                 // Placeholder text
page.getByText('СБП')                               // Visible text

// ❌ AVOID - Implementation details (fragile)
page.locator('#phone-input')                        // CSS IDs
page.locator('.form-control')                       // CSS classes
page.locator('div > input[type="tel"]')             // Complex CSS
```

## Common Assertions

```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Values
await expect(input).toHaveValue('value')
await expect(element).toHaveText('text')
await expect(element).toContainText('partial')

// States
await expect(button).toBeEnabled()
await expect(button).toBeDisabled()
await expect(checkbox).toBeChecked()

// URLs
await expect(page).toHaveURL('/stats')
await expect(page).toHaveTitle('DonationApp')

// Count
await expect(page.getByRole('button')).toHaveCount(5)
```

## Best Practices

### 1. Use Auto-waiting
Playwright automatically waits - no need for manual waits!

```typescript
// ❌ DON'T
await page.waitForTimeout(1000)
await element.click()

// ✅ DO
await element.click()  // Automatically waits until element is ready
```

### 2. Use Page Objects
Encapsulate page interactions in page objects for reusability.

### 3. Use Test Data Fixtures
Store test data in `fixtures/test-data.ts` instead of hardcoding.

### 4. Test User Flows, Not Implementation
Focus on what users do, not how your code works.

```typescript
// ✅ GOOD - Tests user flow
test('user can make donation', async ({ page }) => {
  // Fill form -> Submit -> See success
})

// ❌ AVOID - Tests Vue internals
test('donation form emits submit event', async ({ page }) => {
  // This should be a unit test, not E2E
})
```

### 5. Keep Tests Independent
Each test should work standalone - don't depend on other tests.

```typescript
// ❌ DON'T - Tests depend on each other
test('fill phone', async ({ page }) => {
  await page.fill('phone', '9001234567')
})

test('submit form', async ({ page }) => {
  await page.click('submit')  // Phone not filled!
})

// ✅ DO - Each test is complete
test('submit form', async ({ page }) => {
  await page.fill('phone', '9001234567')
  await page.click('submit')
})
```

### 6. Use Descriptive Test Names

```typescript
// ❌ AVOID
test('test 1', ...)

// ✅ GOOD
test('shows error when phone number is too short', ...)
test('successfully submits donation with valid data', ...)
```

## Debugging

### 1. UI Mode (Best for development)
```bash
pnpm test:ui
```
- Interactive test runner
- See browser and code side-by-side
- Time travel debugging

### 2. Debug Mode
```bash
pnpm test:debug
```
- Runs in headed mode
- Opens Playwright Inspector
- Step through tests

### 3. Pause in Test
```typescript
test('debug test', async ({ page }) => {
  await page.goto('/')
  await page.pause()  // Pauses here - you can interact manually
  await page.click('button')
})
```

### 4. Screenshots on Failure
Screenshots are automatically saved to `test-results/` on failure.

### 5. Trace Viewer
```bash
pnpm test:report
```
View timeline, screenshots, network requests for failed tests.

## CI/CD Integration

Your config is already CI-ready. For GitHub Actions:

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright Browsers
  run: pnpm exec playwright install chromium --with-deps

- name: Run tests
  run: pnpm test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Next Steps

1. Run your first test: `pnpm test`
2. Open UI mode: `pnpm test:ui`
3. Write more tests in `tests/e2e/`
4. View reports: `pnpm test:report`

## Resources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
