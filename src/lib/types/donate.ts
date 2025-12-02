import { BlankFormValues } from './blank'
import { PaymentFormValues } from './payment'

export type DonationStatus = 'blank' | 'payment' | 'confirm' | 'result'

export interface DonationFormData {
  currentStep: number
  blankForm: BlankFormValues
  paymentForm: PaymentFormValues
}
