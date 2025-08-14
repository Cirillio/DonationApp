import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "inline-flex duration-150 ease-in-out w-fit cursor-pointer shadow-xs items-center justify-center gap-1 whitespace-nowrap rounded-md  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary border border-primary/10 text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/20',

        destructive:
          'bg-destructive border border-destructive/10 text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20',

        outline:
          'bg-transparent border border-border text-foreground hover:bg-input hover:text-foreground',

        secondary:
          'bg-secondary border border-secondary/10 text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary/20',

        ghost: 'bg-transparent border border-transparent text-foreground hover:bg-input/75',

        link: 'bg-transparent text-foreground hover:text-primary !shadow-none',

        text: 'bg-transparent border border-transparent text-foreground !shadow-none',
      },
      size: {
        default: 'px-4 py-2 text-base has-[>svg]:px-3',
        sm: 'text-sm  gap-1.5 px-3 py-1.5 has-[>svg]:px-2.5',
        lg: 'text-lg px-6 py-2 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
