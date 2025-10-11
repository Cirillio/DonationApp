export type PageSliderSlide = 'slide-up' | 'slide-down' | 'slide-initial'
export type PageSliderDirection = 'up' | 'down' | 'initial'

export type PageSliderObj = {
  [key in PageSliderSlide]: PageSliderDirection
}

export const pageSliderObj: PageSliderObj = {
  'slide-down': 'down',
  'slide-up': 'up',
  'slide-initial': 'initial',
} as const
