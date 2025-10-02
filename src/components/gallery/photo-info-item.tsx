import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const InfoItem = forwardRef<
  HTMLDivElement,
  {
    title: string
    children: React.ReactNode
  } & React.HTMLAttributes<HTMLDivElement>
>(({ title, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-4 py-2',
        'cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60',
        'transition-all duration-300',
        props.className,
      )}
    >
      <div className='text-muted-foreground text-xs md:text-sm'>{title}</div>
      <div className='text-sm md:text-base'>{children}</div>
    </div>
  )
})

InfoItem.displayName = 'InfoItem'
