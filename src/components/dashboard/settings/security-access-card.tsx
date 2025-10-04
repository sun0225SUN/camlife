'use client'

import { Dot, Laptop, Loader2, Smartphone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { UAParser } from 'ua-parser-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { revokeSession } from '@/lib/auth/client'

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

interface SecurityAccessCardProps {
  session: Session | null
  activeSessions: Session[]
}

export function SecurityAccessCard({
  session,
  activeSessions,
}: SecurityAccessCardProps) {
  const router = useRouter()
  const [isTerminating, setIsTerminating] = useState<string>()
  const t = useTranslations()

  // Debug logging
  console.log('SecurityAccessCard - session:', session)
  console.log('SecurityAccessCard - activeSessions:', activeSessions)

  const handleRevokeSession = async (sessionToRevoke: Session) => {
    const isCurrentSession = sessionToRevoke.id === session?.id

    setIsTerminating(sessionToRevoke.id)

    try {
      const res = await revokeSession({
        token: sessionToRevoke.token,
      })

      if (res.error) {
        toast.error(res.error.message)
      } else {
        toast.success(
          isCurrentSession
            ? t('common.signed-out-successfully')
            : t('common.session-terminated-successfully'),
        )
      }
      router.refresh()
    } catch (_error) {
      toast.error(t('common.failed-to-revoke-session'))
    } finally {
      setIsTerminating(undefined)
    }
  }

  return (
    <div className='mt-6 space-y-8'>
      <div>
        <h2 className='mb-2 font-semibold text-xl'>
          {t('auth.active-sessions')}
        </h2>
        <p className='mb-4 text-muted-foreground text-xs'>
          {t('auth.manage-devices')}
        </p>

        <div className='space-y-4'>
          {activeSessions.length === 0 ? (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground text-sm'>
                {t('auth.no-active-sessions')}
              </p>
            </div>
          ) : (
            activeSessions
              .filter((sessionItem) => sessionItem.userAgent)
              .map((sessionItem) => {
                const userAgent = new UAParser(sessionItem.userAgent || '')
                const isCurrentSession = sessionItem.id === session?.id
                const deviceType = userAgent.getDevice().type
                const isMobile = deviceType === 'mobile'
                const browser = userAgent.getBrowser().name || 'Unknown'
                const os = userAgent.getOS().name || 'Unknown'

                return (
                  <Card
                    key={sessionItem.id}
                    className='overflow-hidden border border-border'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start gap-4'>
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

                        <div className='flex-1 space-y-1'>
                          <div className='flex items-center'>
                            <h3 className='font-medium'>
                              {isMobile
                                ? t('auth.mobile-app')
                                : `${browser} on ${os}`}
                            </h3>
                            {isCurrentSession && (
                              <span className='ml-2 flex items-center text-green-600 text-xs'>
                                <Dot
                                  size={20}
                                  className='text-green-500'
                                />
                                {t('auth.current-session')}
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

                        <Button
                          variant='outline'
                          size='sm'
                          className='cursor-pointer text-xs'
                          onClick={() => handleRevokeSession(sessionItem)}
                          disabled={isTerminating === sessionItem.id}
                        >
                          {isTerminating === sessionItem.id ? (
                            <Loader2
                              size={15}
                              className='animate-spin'
                            />
                          ) : isCurrentSession ? (
                            t('auth.sign-out')
                          ) : (
                            t('auth.terminate')
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
          )}
        </div>
      </div>
    </div>
  )
}
