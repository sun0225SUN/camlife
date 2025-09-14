'use client'

import { Loader2Icon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'
import { SIGN_IN_PAGE } from '@/routes'

export function LogoutButton() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await signOut()

      router.push(SIGN_IN_PAGE)
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      router.push(SIGN_IN_PAGE)
      router.refresh()
    }
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleLogout}
      disabled={isLoading}
      className='flex items-center gap-2'
    >
      {isLoading ? (
        <Loader2Icon className='h-4 w-4 animate-spin' />
      ) : (
        <LogOutIcon className='h-4 w-4' />
      )}
      {isLoading ? t('signingOut') : t('signOut')}
    </Button>
  )
}
