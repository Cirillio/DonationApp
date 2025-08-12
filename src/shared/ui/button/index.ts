import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "inline-flex duration-150 ease-in-out w-fit cursor-pointer dark:shadow-xs items-center justify-center gap-1 whitespace-nowrap rounded-md  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary border border-primary/10 !shadow-sm text-primary-foreground  ',
        destructive:
          'bg-destructive text-white   hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-card   border-border dark:text-foreground text-primary-foreground   backdrop-blur-sm',
        secondary: 'bg-secondary border border-transparent text-secondary-foreground  ',
        ghost: 'backdrop-blur-lg border hover:bg-secondary/75    border-transparent bg-card/10',
        link: 'text-foreground hover:text-primary',
        ring: 'border border-ring  bg-card ring-ring/25 ring-[2px]  disabled:ring-ring/50 disabled:hover:bg-card/20 backdrop-blur-lg  text-foreground   ',
        text: 'bg-transparent text-foreground !shadow-none border border-transparent',
      },
      size: {
        default: 'h-10 px-4 !text-base py-2 has-[>svg]:px-3',
        sm: 'h-8 text-sm rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 !text-lg rounded-md px-6 has-[>svg]:px-4',
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
