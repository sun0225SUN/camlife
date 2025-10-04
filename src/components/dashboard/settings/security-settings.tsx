'use client'

import {
  Dot,
  Eye,
  EyeOff,
  HelpCircle,
  Laptop,
  Shield,
  Smartphone,
} from 'lucide-react'
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

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

interface SecuritySettingsProps {
  session?: {
    id: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    token: string
    ipAddress?: string | null
    userAgent?: string | null
  } | null
  activeSessions?: Session[]
  onSessionsUpdate?: () => void
}

export function SecuritySettings({
  session,
  activeSessions = [],
  onSessionsUpdate,
}: SecuritySettingsProps) {
  const t = useTranslations('settings')
  const router = useRouter()

  // Password change states
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Session management states
  const [isTerminating, setIsTerminating] = useState<string>()

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

  const handleRevokeSession = async (sessionToRevoke: Session) => {
    const isCurrentSession = sessionToRevoke.id === session?.id

    setIsTerminating(sessionToRevoke.id)

    try {
      const { revokeSession } = await import('@/lib/auth/client')
      const res = await revokeSession({
        token: sessionToRevoke.token,
      })

      if (res.error) {
        toast.error(res.error.message)
      } else {
        toast.success(
          isCurrentSession
            ? t('signed-out-successfully')
            : t('session-terminated-successfully'),
        )

        // Refresh sessions list
        if (onSessionsUpdate) {
          onSessionsUpdate()
        }

        // If it's the current session, redirect to login
        if (isCurrentSession) {
          router.push('/sign-in')
        }
      }
    } catch (_error) {
      toast.error(t('failed-to-revoke-session'))
    } finally {
      setIsTerminating(undefined)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('security')}
        </h2>
        <p className='text-muted-foreground'>{t('security-description')}</p>
      </div>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            {t('change-password-title')}
          </CardTitle>
          <CardDescription>
            {t('change-password-security-description')}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='current-password'>
              {t('current-password-label')}
            </Label>
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
                      <p className='font-medium'>
                        {t('password-requirements')}:
                      </p>
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
            <Label htmlFor='confirm-password'>
              {t('confirm-password-label')}
            </Label>
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

      {/* Session Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('active-sessions-title')}</CardTitle>
          <CardDescription>
            {t('active-sessions-manage-description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {activeSessions.length === 0 ? (
              <div className='py-8 text-center'>
                <p className='text-muted-foreground text-sm'>
                  {t('no-active-sessions-found')}
                </p>
              </div>
            ) : (
              activeSessions
                .filter((sessionItem) => sessionItem.userAgent)
                .map((sessionItem) => {
                  const { UAParser } = require('ua-parser-js')
                  const userAgent = new UAParser(sessionItem.userAgent || '')
                  const isCurrentSession = sessionItem.id === session?.id
                  const deviceType = userAgent.getDevice().type
                  const isMobile = deviceType === 'mobile'
                  const browser = userAgent.getBrowser().name || 'Unknown'
                  const os = userAgent.getOS().name || 'Unknown'

                  return (
                    <div
                      key={sessionItem.id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center justify-center rounded-md bg-gray-100 p-2 dark:bg-gray-800'>
                          {isMobile ? (
                            <Smartphone
                              size={24}
                              className='text-gray-700 dark:text-gray-300'
                            />
                          ) : (
                            <Laptop
                              size={24}
                              className='text-gray-700 dark:text-gray-300'
                            />
                          )}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <h3 className='font-medium'>
                              {isMobile
                                ? t('mobile-app')
                                : `${browser} on ${os}`}
                            </h3>
                            {isCurrentSession && (
                              <span className='ml-2 flex items-center text-green-600 text-xs'>
                                <Dot
                                  size={20}
                                  className='text-green-500'
                                />
                                {t('current-session')}
                              </span>
                            )}
                          </div>
                          <p className='text-muted-foreground text-xs'>
                            {sessionItem.ipAddress || t('unknown-location')} •{' '}
                            {new Date(
                              sessionItem.updatedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className='cursor-pointer text-xs'
                        onClick={() => handleRevokeSession(sessionItem)}
                        disabled={isTerminating === sessionItem.id}
                      >
                        {isTerminating === sessionItem.id ? (
                          <Spinner className='h-4 w-4' />
                        ) : isCurrentSession ? (
                          t('sign-out')
                        ) : (
                          t('terminate')
                        )}
                      </Button>
                    </div>
                  )
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
