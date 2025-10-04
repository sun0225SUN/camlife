'use client'

import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { changePassword, signOut } from '@/lib/auth/client'

export function PasswordUpdate() {
  const t = useTranslations('settings')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSavePasswordSettings = async () => {
    if (!passwordData.currentPassword.trim()) {
      toast.error(t('current-password-required'))
      return
    }

    if (!passwordData.newPassword.trim()) {
      toast.error(t('new-password-required'))
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('passwords-do-not-match'))
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error(t('password-length'))
      return
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      toast.error(t('password-uppercase'))
      return
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(passwordData.newPassword)) {
      toast.error(t('password-lowercase'))
      return
    }

    // Check for number
    if (!/[0-9]/.test(passwordData.newPassword)) {
      toast.error(t('password-number'))
      return
    }

    setIsChangingPassword(true)

    try {
      const { error } = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      if (error) {
        toast.error(error.message || t('failed-to-update-password'))
        return
      }

      toast.success(t('password-updated-successfully'))

      // Clear the form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      // Sign out and redirect to login page
      await signOut()
      router.push('/sign-in')
    } catch (error) {
      toast.error(t('unexpected-error'))
      console.error('Password change error:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('change-password')}</CardTitle>
        <CardDescription>{t('change-password-description')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='current-password'>{t('current-password')}</Label>
          <div className='relative'>
            <Input
              id='current-password'
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              placeholder={t('current-password-placeholder')}
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='new-password'>{t('new-password')}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className='h-4 w-4 cursor-help text-muted-foreground' />
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  className='max-w-xs'
                >
                  <div className='space-y-2'>
                    <p className='font-medium'>{t('password-requirements')}:</p>
                    <ul className='space-y-1 text-sm'>
                      <li
                        className={`flex items-center gap-2 ${
                          passwordData.newPassword.length >= 8
                            ? 'text-green-600'
                            : ''
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            passwordData.newPassword.length >= 8
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        {t('at-least-8-characters')}
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          /[A-Z]/.test(passwordData.newPassword)
                            ? 'text-green-600'
                            : ''
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            /[A-Z]/.test(passwordData.newPassword)
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        {t('one-uppercase-letter')}
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          /[a-z]/.test(passwordData.newPassword)
                            ? 'text-green-600'
                            : ''
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            /[a-z]/.test(passwordData.newPassword)
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        {t('one-lowercase-letter')}
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          /[0-9]/.test(passwordData.newPassword)
                            ? 'text-green-600'
                            : ''
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            /[0-9]/.test(passwordData.newPassword)
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          }`}
                        />
                        {t('one-number')}
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='relative'>
            <Input
              id='new-password'
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              placeholder={t('new-password-placeholder')}
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent'
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirm-password'>{t('confirm-password')}</Label>
          <div className='relative'>
            <Input
              id='confirm-password'
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              placeholder={t('confirm-new-password-placeholder')}
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            className='w-16 cursor-pointer'
            onClick={handleSavePasswordSettings}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? <Spinner /> : t('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
