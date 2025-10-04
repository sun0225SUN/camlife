'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
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
import { updateUser } from '@/lib/auth/client'

interface ProfileUpdateProps {
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

export function ProfileUpdate({ user }: ProfileUpdateProps) {
  const t = useTranslations('settings')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    image: '',
  })

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
      })
    }
  }, [user])

  const handleSaveProfileSettings = async () => {
    if (!profileData.name.trim()) {
      toast.error(t('name-required'))
      return
    }

    setIsUpdatingProfile(true)

    try {
      // Update name and image
      const { error: updateError } = await updateUser({
        name: profileData.name.trim(),
        image: profileData.image.trim() || undefined,
      })

      if (updateError) {
        toast.error(`Failed to update profile: ${updateError.message}`)
        return
      }

      toast.success(t('profile-updated-successfully'))
    } catch (error) {
      toast.error(t('unexpected-error'))
      console.error('Profile update error:', error)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile-information')}</CardTitle>
        <CardDescription>
          {t('profile-information-description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='profile-name'>{t('name')}</Label>
          <Input
            id='profile-name'
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            placeholder={t('enter-your-name')}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='profile-email'>{t('email-address')}</Label>
          <Input
            id='profile-email'
            type='email'
            value={profileData.email}
            readOnly
            className='cursor-not-allowed bg-muted'
            placeholder={t('email-address')}
          />
          <p className='text-muted-foreground text-sm'>
            {t('email-cannot-be-changed')}
          </p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='profile-image'>{t('profile-picture-url')}</Label>
          <Input
            id='profile-image'
            value={profileData.image}
            onChange={(e) =>
              setProfileData({ ...profileData, image: e.target.value })
            }
            placeholder={t('enter-image-url')}
          />
          <div className='flex items-center space-x-4'>
            <div className='space-y-1'>
              <Label className='text-muted-foreground text-sm'>
                {t('preview')}
              </Label>
              <div className='relative h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-muted'>
                {profileData.image ? (
                  <Image
                    src={profileData.image}
                    alt={t('profile-preview')}
                    width={64}
                    height={64}
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                    <span className='text-xs'>{t('no-image')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            className='w-16 cursor-pointer'
            onClick={handleSaveProfileSettings}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? <Spinner /> : t('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
