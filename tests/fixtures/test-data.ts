/**
 * Test Data Fixtures
 * Reusable test data for your DonationApp tests
 */

/**
 * Valid test users with different scenarios
 */
export const testUsers = {
  validAdult: {
    phone: '9001234567',
    name: 'Иван Иванов',
    birth: '01.01.1990', // 35 years old
    isGroup: false,
  },

  validYoungAdult: {
    phone: '9009876543',
    name: 'Мария Петрова',
    birth: '15.06.2000', // 25 years old
    isGroup: false,
  },

  groupDonation: {
    phone: '9005551234',
    name: 'Команда разработчиков',
    birth: '20.03.1985',
    isGroup: true,
  },

  anonymous: {
    phone: '9007778899',
    name: '', // Anonymous donation (name is optional)
    birth: '10.10.1995',
    isGroup: false,
  },
} as const

/**
 * Invalid test data for validation testing
 */
export const invalidData = {
  phone: {
    tooShort: '123',
    incomplete: '90012345',
    letters: 'abc1234567',
    empty: '',
  },

  birth: {
    tooYoung: '01.01.2015', // Under 18
    tooOld: '01.01.1900', // Over 100
    invalidFormat: '32.13.2000', // Invalid date
    incomplete: '01.01',
    empty: '',
  },

  name: {
    tooShort: 'Ив', // Less than 3 characters
  },

  amount: {
    tooLow: '50', // Below minimum (100₽)
    negative: '-100',
    zero: '0',
    empty: '',
  },
} as const

/**
 * Payment test data
 */
export const testPayments = {
  minAmount: {
    amount: 100, // Minimum allowed
    type: 'sbp' as const,
    note: '',
  },

  standardAmount: {
    amount: 500,
    type: 'sbp' as const,
    note: 'Спасибо за вашу работу!',
  },

  largeAmount: {
    amount: 5000,
    type: 'card' as const,
    note: 'От лица всей команды',
  },

  customAmount: {
    amount: 750,
    type: 'sbp' as const,
    note: '',
  },
} as const

/**
 * Phone country codes
 */
export const phoneCountries = {
  russia: {
    name: 'Россия',
    code: '+7',
    mask: '(000) 000-00-00',
  },
  belarus: {
    name: 'Беларусь',
    code: '+375',
    mask: '(00) 000-00-00',
  },
  kazakhstan: {
    name: 'Казахстан',
    code: '+7',
    mask: '(000) 000-00-00',
  },
  ukraine: {
    name: 'Украина',
    code: '+380',
    mask: '(00) 000-00-00',
  },
} as const

/**
 * Predefined donation amounts (buttons)
 */
export const presetAmounts = [100, 200, 500, 1000, 2000, 5000] as const
