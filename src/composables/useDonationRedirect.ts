import { useDonationStore } from '@/stores/donation'

/**
 * Композабл для обработки редиректов на странице доната
 */
export function useDonationRedirect() {
  const donationStore = useDonationStore()

  /**
   * Проверяет наличие платежного токена и переходит на страницу результата
   * @param paymentToken - токен платежа из URL параметров
   */
  const checkPaymentToken = (paymentToken: string | null) => {
    if (paymentToken) {
      // Переходим на шаг с результатом
      donationStore.goToStep(3)

      // TODO: В будущем здесь будет запрос на сервер для получения данных платежа
      // const paymentData = await fetchPaymentByToken(paymentToken)
      // donationStore.setPaymentResult(paymentData)
    }
  }

  return { checkPaymentToken }
}
