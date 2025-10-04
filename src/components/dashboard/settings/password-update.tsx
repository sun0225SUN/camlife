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
  const t = useTranslations('Settings')
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
      toast.error('Current password is required')
      return
    }

    if (!passwordData.newPassword.trim()) {
      toast.error('New password is required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      toast.error('Password must contain at least one uppercase letter')
      return
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(passwordData.newPassword)) {
      toast.error('Password must contain at least one lowercase letter')
      return
    }

    // Check for number
    if (!/[0-9]/.test(passwordData.newPassword)) {
      toast.error('Password must contain at least one number')
      return
    }

    setIsChangingPassword(true)

    try {
      const { error } = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      if (error) {
        toast.error(error.message || 'Failed to change password')
        return
      }

      toast.success(
        'Password changed successfully. Please log in again with your new password.',
      )

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
      toast.error('An unexpected error occurred')
      console.error('Password change error:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('changePassword')}</CardTitle>
        <CardDescription>{t('changePasswordDescription')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='current-password'>Current Password</Label>
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
              placeholder='Enter current password'
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
            <Label htmlFor='new-password'>New Password</Label>
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
                    <p className='font-medium'>Password requirements:</p>
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
                        At least 8 characters
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
                        One uppercase letter
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
                        One lowercase letter
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
                        One number
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
              placeholder='Enter new password'
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
          <Label htmlFor='confirm-password'>Confirm Password</Label>
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
              placeholder='Confirm new password'
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
