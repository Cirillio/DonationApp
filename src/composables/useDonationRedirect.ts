import { useToast } from '@/components/ui/toast'
import { useDonationStore } from '@/stores/donation'
import { useRouter } from 'vue-router'
import { START_STATUS } from '@/lib/constants'
import { DonationStatus } from '@/lib/types/donate'

export function useDonationRedirect() {
  const donationStore = useDonationStore()
  const router = useRouter()
  const { toast } = useToast()

  const checkAndRedirect = (currentStatus: DonationStatus) => {
    // Если на payment, но анкета не заполнена
    if (currentStatus === 'payment' && !donationStore.stepsValidity[1]) {
      toast({
        title: 'Сначала заполните анкету',
        description: 'Для перехода к оплате необходимо заполнить обязательные поля',
        variant: 'destructive',
      })

      router.replace({
        path: '/donate',
        query: { status: START_STATUS },
      })
      return false
    }

    return true
  }

  return { checkAndRedirect }
}
