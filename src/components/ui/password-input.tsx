'use client'

import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * Reusable password input with visibility toggle
 */
export const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({  ...props }, ref) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className='relative'>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className='h-10 pr-10'
          {...props}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            '-translate-y-1/2 absolute top-1/2 right-3',
            'cursor-pointer text-muted-foreground transition-all duration-300 hover:text-foreground',
          )}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
