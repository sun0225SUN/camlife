import { cn } from '@/lib/utils'

interface InfoItemProps {
  title: string
  children: React.ReactNode
}

export const InfoItem = ({
  title,
  children,
  ...props
}: InfoItemProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-4 py-2',
        'cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60',
      )}
    >
      <div className='text-muted-foreground text-xs md:text-sm'>{title}</div>
      <div className='text-sm md:text-base'>{children}</div>
    </div>
  )
}
