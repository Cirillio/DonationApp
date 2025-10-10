import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for DonationApp
 * Documentation: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /**
   * testDir: Directory where test files are located
   * Playwright will search for *.spec.ts files in this directory
   */
  testDir: './tests/e2e',

  /**
   * fullyParallel: Run all tests in parallel
   * - true: Runs tests from different files in parallel (faster)
   * - false: Runs tests sequentially (slower but more stable)
   * For your donation app: true is fine since tests are independent
   */
  fullyParallel: true,

  /**
   * forbidOnly: Prevents accidentally committing test.only()
   * - test.only() runs only that specific test (useful for debugging)
   * - On CI, this should error to ensure all tests run
   */
  forbidOnly: !!process.env.CI,

  /**
   * retries: Number of times to retry failed tests
   * - On CI: Retry 2 times (network issues, flakiness)
   * - Locally: Don't retry (0) - you want to see failures immediately
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * workers: Number of parallel worker processes
   * - On CI: 1 worker (limited resources, more stable)
   * - Locally: undefined = uses half of CPU cores (faster)
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * reporter: How to display test results
   * - 'html': Creates HTML report in playwright-report/
   * - 'list': Shows test progress in terminal
   * - 'dot': Minimal output (just dots)
   * - 'json': Machine-readable format for CI
   * You can use multiple: [['html'], ['list']]
   */
  reporter: 'html',

  /**
   * timeout: Global timeout for each test (default: 30000ms)
   * Increase if your app takes longer to load
   */
  timeout: 30000,

  /**
   * expect: Timeout for expect() assertions
   * How long to wait for conditions like expect(element).toBeVisible()
   */
  expect: {
    timeout: 5000,
  },

  /**
   * use: Shared settings for all tests
   */
  use: {
    /**
     * baseURL: Base URL for page.goto('/')
     * Instead of: page.goto('http://localhost:5173/')
     * You can: page.goto('/')
     */
    baseURL: 'http://localhost:5173',

    /**
     * trace: When to collect traces (timeline, screenshots, network)
     * - 'on-first-retry': Only when test is retried (saves space)
     * - 'on': Always collect (slower, but great for debugging)
     * - 'off': Never collect
     * View traces: pnpm test:report
     */
    trace: 'on-first-retry',

    /**
     * screenshot: When to take screenshots
     * - 'only-on-failure': Only when test fails (default)
     * - 'on': Always take screenshots
     * - 'off': Never take screenshots
     */
    screenshot: 'only-on-failure',

    /**
     * video: When to record videos
     * - 'retain-on-failure': Keep videos only for failed tests
     * - 'on': Always record (takes lots of space)
     * - 'off': Never record
     */
    video: 'retain-on-failure',

    /**
     * viewport: Browser window size
     * Default is 1280x720
     */
    viewport: { width: 1280, height: 720 },

    /**
     * actionTimeout: Timeout for actions (click, fill, etc.)
     * How long to wait for an action to complete
     */
    actionTimeout: 10000,

    /**
     * navigationTimeout: Timeout for page navigations
     * How long to wait for page.goto() to complete
     */
    navigationTimeout: 15000,

    /**
     * headless: Run browser in headless mode (no UI)
     * - true: Faster, for CI
     * - false: See the browser (useful for debugging)
     * Override with: pnpm test:e2e --headed
     */
    // headless: true, // Default is true
  },

  /**
   * projects: Different browser configurations
   * Each project runs all tests in a specific browser/device
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /**
     * Uncomment to test in Firefox
     * Install with: pnpm exec playwright install firefox
     */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    /**
     * Uncomment to test in WebKit (Safari)
     * Install with: pnpm exec playwright install webkit
     */
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /**
     * Mobile testing
     * Tests your responsive design on mobile viewports
     */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /**
     * Tablet testing
     */
    // {
    //   name: 'Tablet',
    //   use: { ...devices['iPad Pro'] },
    // },
  ],

  /**
   * webServer: Automatically start dev server before tests
   * This is CRITICAL for your Vue app!
   */
  webServer: {
    /**
     * command: Start your Vite dev server
     */
    command: 'pnpm dev',

    /**
     * url: URL to check if server is ready
     * Playwright will wait for this URL to respond before running tests
     */
    url: 'http://localhost:5173',

    /**
     * reuseExistingServer: Don't start new server if one is already running
     * - true locally: You might already have `pnpm dev` running
     * - false on CI: Always start fresh server
     */
    reuseExistingServer: !process.env.CI,

    /**
     * timeout: How long to wait for server to start (ms)
     * Vite is fast, but initial startup can take time
     */
    timeout: 120000, // 2 minutes

    /**
     * stdout: Show server output in console
     * - 'ignore': Don't show Vite logs (cleaner)
     * - 'pipe': Show Vite logs (useful for debugging server issues)
     */
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
