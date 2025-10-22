export const CONTACTS = [
  {
    url: 'tel:+79991234567',
    icon: 'f7--phone-fill',
    colorClass: 'bg-green-500 hover:bg-green-500/90',
    label: '+79991234567',
    type: 'phone',
  },
  {
    url: 'mailto:support@example.com',
    icon: 'f7--envelope-fill',
    colorClass: 'bg-blue-500 hover:bg-blue-500/90',
    label: 'support@example.com',
    type: 'email',
  },
  {
    url: 'https://t.me/ExpenseTrackerSharp_bot',
    icon: 'f7--paperplane-fill',
    colorClass: 'bg-[#29a9ea] hover:bg-[#29a9ea]/90',
    label: 'Наш Telegram канал',
    type: 'telegram',
  },
  {
    url: 'https://youtube.com',
    icon: 'f7--play-rectangle',
    colorClass: 'bg-red-600 hover:bg-red-600/90',
    label: 'Наш YouTube канал',
    type: 'youtube',
  },
  {
    url: 'https://yandex.ru/maps',
    icon: 'f7--map-pin-ellipse',
    colorClass: 'bg-yellow-500 hover:bg-yellow-500/90',
    label: 'Наш посёлок',
    type: 'address',
  },
] as const
