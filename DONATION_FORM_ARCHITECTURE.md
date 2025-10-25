# Donation Form Architecture

## 📋 Overview

Multi-step donation form with persistent state management and validation.

**Steps:**
1. **Анкета (Blank)** - Personal information (phone, name, birth date)
2. **Оплата (Payment)** - Amount and payment method selection
3. **Результат (Result)** - Success message and donation details

---

## 🏗️ Architecture

### Key Components

```
DonatePage.vue
└── DonationForm.vue (Stepper orchestrator)
    ├── DonationBlank.vue (Step 1)
    ├── DonationPay.vue (Step 2)
    └── DonationResult.vue (Step 3)

Store: donation.ts (State management)
```

### State Management Pattern: **Hybrid Approach**

#### Problem Solved
Previously stored vee-validate `FormContext` references, causing:
- ❌ Memory leaks (circular refs, DOM retention)
- ❌ Incomplete form reset (meta wouldn't clear)
- ❌ Race conditions on remount

#### Solution
Store holds **plain values + meta**, NOT FormContext:

```typescript
// Store structure
{
  formData: {
    blank: { phone, name, birth, ... },
    payment: { amount, type, note }
  },
  formMeta: {
    blank: { valid, dirty, touched },
    payment: { valid, dirty, touched }
  }
}
```

---

## 🔄 Data Flow

### Initialization
```
Component mounts
  → useForm({ initialValues: store.formData.blank })
  → Setup watchers for two-way sync
```

### User Input
```
User types
  → vee-validate updates form.values
  → Watcher detects change
  → store.updateFormValues() called
  → Store updated (persistence achieved)
```

### Validation Sync
```
vee-validate validates
  → form.meta.valid changes
  → Watcher detects change
  → store.syncFormMeta() called
  → stepsValidity computed updates
  → Navigation buttons enable/disable
```

### Navigation
```
User clicks "Продолжить"
  → Disabled if !stepsValidity[currentStep]
  → store.nextStep() called
  → Component unmounts (watchers cleaned up)
  → Next component mounts with store values
```

### Reset
```
User clicks "Сделать ещё одно пожертвование"
  → store.resetForm() called
  → Object.assign(formData.blank, DEFAULT_BLANK_FORM)
  → Object.assign(formMeta.blank, { valid: false, ... })
  → Components reinitialize with clean values
```

---

## 🧩 Component Details

### DonationBlank.vue

**Fields:**
- `phone` - Required, country-validated (libphonenumber-js)
- `phoneCountry` - RU/TJ selector
- `name` - Optional, 3-50 chars
- `birth` - Required, DD.MM.YYYY, 18-100 years
- `isGroup` - Boolean checkbox

**Special Features:**
- Phone paste detection and parsing
- Auto-reset phone on country change
- Silent validation on field blur (not on input)

**Watchers (3):**
1. `form.values` → `updateFormValues('blank', values)`
2. `form.meta` → `syncFormMeta('blank', meta)`
3. `selectedSpec` → Reset phone field on country change

### DonationPay.vue

**Fields:**
- `amount` - Required, min 100 RUB
- `type` - СБП or Bank Card
- `note` - Optional, max 200 chars

**Special Features:**
- Quick-select buttons (100, 500, 1000, 2500, 5000, 10000)
- Custom input with vue-currency-input
- Bidirectional sync between buttons and input

**Watchers (4):**
1. `form.values` → `updateFormValues('payment', values)`
2. `form.meta` → `syncFormMeta('payment', meta)`
3. `numberValue` → Sync currency input to form
4. `form.values.amount` → Sync form to currency input

### DonationResult.vue

**Display:**
- Loading state (spinner) while payment processes
- Success message with donation details
- Payment ID, amount, name, note

**Actions:**
- "Сделать ещё одно пожертвование" → `resetForm()`
- "Вернуться на главную" → Navigate home

---

## 🛡️ Memory Leak Prevention

### Critical: Watcher Cleanup

Every component with watchers **MUST** clean them up:

```typescript
const stopWatchValues = watch(...)
const stopWatchMeta = watch(...)

onUnmounted(() => {
  stopWatchValues()
  stopWatchMeta()
  // ... stop all watchers
})
```

**Why?**
Without cleanup, watchers continue running after component destruction:
- Memory leaks
- Unexpected store updates
- Performance degradation

---

## ✅ Form Validation

### Validation Strategy

**Per-field config:**
```typescript
:validate-on-blur="!form.isFieldDirty"  // Only on blur if pristine
:validate-on-input="false"              // Never while typing
:validate-on-model-update="false"       // Never on programmatic change
```

**Benefits:**
- No eager validation (user-friendly)
- Validates on blur when field hasn't been touched
- Always validates when field is dirty

### Validation Libraries
- **vee-validate** - Form validation framework
- **Zod** - Schema validation (via `toTypedSchema()`)
- **libphonenumber-js** - Phone number validation

---

## 🔄 Form Persistence

### How it Works

1. **NO** `keepValuesOnUnmount` in vee-validate
   ```typescript
   useForm({
     keepValuesOnUnmount: false  // We handle manually
   })
   ```

2. **Store is single source of truth**
   - Values synced via watchers
   - Form initializes from store on mount

3. **Survives:**
   - ✅ Step navigation (component unmount/remount)
   - ✅ Form reset (clean state restoration)
   - ❌ Page reload (in-memory only)

---

## 🚀 Reset Mechanism

### store.resetForm()

**What it does:**
```typescript
function resetForm() {
  currentStep.value = 1
  Object.assign(formData.blank, { ...DEFAULT_BLANK_FORM })
  Object.assign(formData.payment, { ...DEFAULT_PAY_FORM })
  Object.assign(formMeta.blank, { valid: false, dirty: false, touched: false })
  Object.assign(formMeta.payment, { valid: false, dirty: false, touched: false })
  paymentResult.value = null
}
```

**Result:**
- Step back to 1
- All fields cleared
- Validation reset (forms become invalid)
- Payment result cleared
- Components reinitialize automatically

**Why Object.assign()?**
- Maintains reactivity (reactive object reference stays same)
- Triggers computed properties to recompute
- Efficient (no object recreation)

---

## 📊 Stepper Logic

### Step Validity

```typescript
const stepsValidity = computed(() => ({
  1: formMeta.blank.valid,
  2: formMeta.payment.valid,
  3: false  // Always invalid (prevents back navigation)
}))
```

### Navigation Rules

- **Next button:** Disabled if `!stepsValidity[currentStep]`
- **Back button:** Always enabled (except step 1)
- **Result step:** No navigation (terminal state)

### Visual States

- **Completed:** Green checkmark (step < currentStep)
- **Active + Valid:** Solid primary color + icon
- **Active + Invalid:** Outlined + icon + disabled next
- **Inactive:** Muted color

---

## 🎯 Best Practices

### ✅ DO
- Always clean up watchers in `onUnmounted()`
- Use `Object.assign()` for reactive updates
- Initialize forms from `store.formData.X`
- Keep `keepValuesOnUnmount: false`
- Return watcher stop functions

### ❌ DON'T
- Store FormContext references
- Forget watcher cleanup
- Mutate store state directly (use actions)
- Use `keepValuesOnUnmount: true`
- Rely on vee-validate's internal persistence

---

## 🐛 Debugging Tips

### Form values not persisting?
- Check watcher is calling `updateFormValues()`
- Verify `initialValues: store.formData.X`
- Ensure `deep: true` on value watcher

### Form stays valid after reset?
- Check `resetForm()` updates `formMeta`
- Verify computed `stepsValidity` is recomputing
- Ensure no cached FormContext references

### Memory leaks?
- Check all watchers have `onUnmounted()` cleanup
- Verify no FormContext stored in reactive state
- Use Vue DevTools to check component cleanup

### Validation not working?
- Check Zod schema is correct
- Verify `toTypedSchema()` wrapper used
- Check validation trigger config (blur/input)

---

## 📝 Future Improvements

1. **Persistent Storage**
   - Add localStorage/sessionStorage backup
   - Implement session recovery on page reload

2. **Real Payment Integration**
   - Replace setTimeout with API call
   - Add error handling and retry logic

3. **Analytics**
   - Track step completion rates
   - Monitor form abandonment points

4. **Accessibility**
   - Add ARIA labels to stepper
   - Ensure keyboard navigation works
   - Screen reader announcements

5. **Internationalization**
   - Extract hard-coded Russian strings
   - Use i18n library for multi-language support

---

## 📚 Related Files

### Core
- `/src/stores/donation.ts` - Main store
- `/src/components/donation/forms/DonationForm.vue` - Orchestrator
- `/src/components/donation/views/DonationBlank.vue` - Step 1
- `/src/components/donation/views/DonationPay.vue` - Step 2
- `/src/components/donation/views/DonationResult.vue` - Step 3

### Utilities
- `/src/lib/validations/blank.ts` - Blank form schemas
- `/src/lib/validations/payment.ts` - Payment form schemas
- `/src/lib/constants/blank.ts` - Default values
- `/src/lib/constants/payment.ts` - Payment config
- `/src/composables/usePageLeaveConfirm.ts` - Unsaved data protection
- `/src/composables/usePhone.ts` - Phone input helper

---

## 🤝 Contributing

When modifying the form:

1. **Adding new field:**
   - Add to type definition (`BlankFormValues`/`PaymentFormValues`)
   - Add to `DEFAULT_X_FORM` constant
   - Create Zod validation schema
   - Add FormField to component template

2. **Adding new step:**
   - Create new component in `views/`
   - Add to `DONATE_STEPS` constant
   - Update `MAX_STEPS`
   - Add to stepper template in `DonationForm.vue`

3. **Modifying validation:**
   - Update Zod schema in `/src/lib/validations/`
   - Test with valid/invalid inputs
   - Check error messages display correctly

---

**Last Updated:** 2025-10-25
**Architecture Version:** 2.0 (Hybrid Approach)
