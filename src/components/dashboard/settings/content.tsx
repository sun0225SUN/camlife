'use client'

import {
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  HelpCircle,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { appConfig } from '@/config/app'
import {
  changePassword,
  signOut,
  updateUser,
  useSession,
} from '@/lib/auth/client'
import { api } from '@/trpc/react'

interface SettingsContentProps {
  activeSection: string
}

export function SettingsContent({ activeSection }: SettingsContentProps) {
  const t = useTranslations('Settings')
  const router = useRouter()
  const { data: session } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    image: '',
  })

  // Get settings data
  const { data: siteSettings, isLoading: siteLoading } =
    api.settings.getByCategory.useQuery('site')
  const { data: appSettings, isLoading: appLoading } =
    api.settings.getByCategory.useQuery('app')

  // Update settings mutation
  const updateSettingsMutation = api.settings.updateBatch.useMutation({
    onSuccess: () => {
      toast.success('Settings saved successfully')
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`)
    },
  })

  const [siteData, setSiteData] = useState({
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
  })

  const [appConstantsData, setAppConstantsData] = useState({
    imageSizeLimit: 0,
    enableFileCompression: false,
    compressQuality: 0.6,
    defaultPhotoRating: 3,
    addressLanguage: 'zh',
    perPagePhotosCountInfinite: 10,
    shufflePhotosCount: 20,
  })

  // Update state when data is loaded
  useEffect(() => {
    if (siteSettings) {
      setSiteData({
        siteName: siteSettings['site.name'] || 'CamLife',
        siteDescription:
          siteSettings['site.description'] ||
          'A platform focused on photography sharing and exploration',
        siteKeywords:
          siteSettings['site.keywords'] ||
          'photography,photos,sharing,exploration,camera',
      })
    }
  }, [siteSettings])

  // Initialize profile data from session
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
      })
    }
  }, [session])

  useEffect(() => {
    if (appSettings) {
      setAppConstantsData({
        imageSizeLimit: Number(appSettings['app.image_size_limit']) || 10,
        enableFileCompression:
          appSettings['app.enable_file_compression'] === 'true',
        compressQuality: Number(appSettings['app.compress_quality']) || 0.6,
        defaultPhotoRating:
          Number(appSettings['app.default_photo_rating']) || 3,
        addressLanguage: appSettings['app.address_language'] || 'zh',
        perPagePhotosCountInfinite:
          Number(appSettings['app.per_page_photos_count_infinite']) || 10,
        shufflePhotosCount:
          Number(appSettings['app.shuffle_photos_count']) || 20,
      })
    }
  }, [appSettings])

  const handleSaveSiteSettings = () => {
    updateSettingsMutation.mutate([
      { key: 'site.name', value: siteData.siteName },
      { key: 'site.description', value: siteData.siteDescription },
      { key: 'site.keywords', value: siteData.siteKeywords },
    ])
  }

  const handleSaveAppSettings = () => {
    updateSettingsMutation.mutate([
      {
        key: 'app.image_size_limit',
        value: appConstantsData.imageSizeLimit.toString(),
      },
      {
        key: 'app.enable_file_compression',
        value: appConstantsData.enableFileCompression.toString(),
      },
      {
        key: 'app.compress_quality',
        value: appConstantsData.compressQuality.toString(),
      },
      {
        key: 'app.default_photo_rating',
        value: appConstantsData.defaultPhotoRating.toString(),
      },
      { key: 'app.address_language', value: appConstantsData.addressLanguage },
      {
        key: 'app.per_page_photos_count_infinite',
        value: appConstantsData.perPagePhotosCountInfinite.toString(),
      },
      {
        key: 'app.shuffle_photos_count',
        value: appConstantsData.shufflePhotosCount.toString(),
      },
    ])
  }

  const handleSaveProfileSettings = async () => {
    if (!profileData.name.trim()) {
      toast.error('Name is required')
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

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Profile update error:', error)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const [isChangingPassword, setIsChangingPassword] = useState(false)

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

  const renderAccountSettings = () => (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('account')}
        </h2>
        <p className='text-muted-foreground'>
          Manage your profile and account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='profile-name'>Name</Label>
            <Input
              id='profile-name'
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              placeholder='Enter your name'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='profile-email'>Email</Label>
            <Input
              id='profile-email'
              type='email'
              value={profileData.email}
              readOnly
              className='cursor-not-allowed bg-muted'
              placeholder='Email address'
            />
            <p className='text-muted-foreground text-sm'>
              Email address cannot be changed
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='profile-image'>Profile Picture URL</Label>
            <Input
              id='profile-image'
              value={profileData.image}
              onChange={(e) =>
                setProfileData({ ...profileData, image: e.target.value })
              }
              placeholder='Enter image URL'
            />
            <div className='flex items-center space-x-4'>
              <div className='space-y-1'>
                <Label className='text-muted-foreground text-sm'>Preview</Label>
                <div className='relative h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-muted'>
                  {profileData.image ? (
                    <Image
                      src={profileData.image}
                      alt='Profile preview'
                      width={64}
                      height={64}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                      <span className='text-xs'>No Image</span>
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

      <Card>
        <CardHeader>
          <CardTitle>{t('activeSessions')}</CardTitle>
          <CardDescription>{t('activeSessionsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='space-y-1'>
                <p className='font-medium'>Chrome on macOS</p>
                <p className='text-muted-foreground text-sm'>
                  San Francisco, CA • Active now
                </p>
              </div>
              <Badge variant='secondary'>Current</Badge>
            </div>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='space-y-1'>
                <p className='font-medium'>Safari on iPhone</p>
                <p className='text-muted-foreground text-sm'>
                  San Francisco, CA • 2 hours ago
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='min-w-[80px]'
              >
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGeneralSettings = () => (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('general')}
        </h2>
        <p className='text-muted-foreground'>
          General application settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('siteSettings')}</CardTitle>
          <CardDescription>{t('siteSettingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='site-name'>{t('siteName')}</Label>
            <Input
              id='site-name'
              value={siteData.siteName}
              onChange={(e) =>
                setSiteData({ ...siteData, siteName: e.target.value })
              }
              placeholder='Enter site name'
            />
            <p className='text-muted-foreground text-sm'>
              {t('siteNameDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='site-description'>{t('siteDescription')}</Label>
            <Textarea
              id='site-description'
              value={siteData.siteDescription}
              onChange={(e) =>
                setSiteData({ ...siteData, siteDescription: e.target.value })
              }
              placeholder='Enter site description'
              rows={3}
            />
            <p className='text-muted-foreground text-sm'>
              {t('siteDescriptionDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='site-keywords'>{t('siteKeywords')}</Label>
            <Textarea
              id='site-keywords'
              value={siteData.siteKeywords}
              onChange={(e) =>
                setSiteData({ ...siteData, siteKeywords: e.target.value })
              }
              placeholder='Enter keywords separated by commas'
              rows={2}
            />
            <p className='text-muted-foreground text-sm'>
              {t('siteKeywordsDescription')}
            </p>
          </div>
          <div className='flex justify-end'>
            <Button
              className='w-16 cursor-pointer'
              onClick={handleSaveSiteSettings}
              disabled={updateSettingsMutation.isPending || siteLoading}
            >
              {updateSettingsMutation.isPending ? <Spinner /> : t('save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('appConstants')}</CardTitle>
          <CardDescription>{t('appConstantsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='image-size-limit'>{t('imageSizeLimit')}</Label>
            <Input
              id='image-size-limit'
              type='number'
              value={appConstantsData.imageSizeLimit || ''}
              onChange={(e) =>
                setAppConstantsData({
                  ...appConstantsData,
                  imageSizeLimit: Number(e.target.value) || 0,
                })
              }
              placeholder='Enter image size limit in MB'
            />
            <p className='text-muted-foreground text-sm'>
              {t('imageSizeLimitDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='enable-compression'>
              {t('enableFileCompression')}
            </Label>
            <div className='flex items-center space-x-2'>
              <Switch
                id='enable-compression'
                checked={appConstantsData.enableFileCompression}
                onCheckedChange={(checked) =>
                  setAppConstantsData({
                    ...appConstantsData,
                    enableFileCompression: checked,
                  })
                }
              />
              <span className='text-muted-foreground text-sm'>
                {appConstantsData.enableFileCompression
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>
            <p className='text-muted-foreground text-sm'>
              {t('enableFileCompressionDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='compress-quality'>{t('compressQuality')}</Label>
            <Input
              id='compress-quality'
              type='number'
              step='0.1'
              min='0.1'
              max='1.0'
              value={appConstantsData.compressQuality || ''}
              onChange={(e) =>
                setAppConstantsData({
                  ...appConstantsData,
                  compressQuality: Number(e.target.value) || 0.6,
                })
              }
              placeholder='Enter compression quality (0.1-1.0)'
            />
            <p className='text-muted-foreground text-sm'>
              {t('compressQualityDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='default-rating'>{t('defaultPhotoRating')}</Label>
            <Input
              id='default-rating'
              type='number'
              min='1'
              max='5'
              value={appConstantsData.defaultPhotoRating || ''}
              onChange={(e) =>
                setAppConstantsData({
                  ...appConstantsData,
                  defaultPhotoRating: Number(e.target.value) || 3,
                })
              }
              placeholder='Enter default photo rating (1-5)'
            />
            <p className='text-muted-foreground text-sm'>
              {t('defaultPhotoRatingDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='address-language'>{t('addressLanguage')}</Label>
            <Input
              id='address-language'
              value={appConstantsData.addressLanguage || ''}
              onChange={(e) =>
                setAppConstantsData({
                  ...appConstantsData,
                  addressLanguage: e.target.value,
                })
              }
              placeholder='Enter address language code (e.g., en, zh)'
            />
            <p className='text-muted-foreground text-sm'>
              {t('addressLanguageDescription')}
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='infinite-photos-per-page'>
              {t('perPagePhotosCountInfinite')}
            </Label>
            <Input
              id='infinite-photos-per-page'
              type='number'
              min='1'
              value={appConstantsData.perPagePhotosCountInfinite || ''}
              onChange={(e) =>
                setAppConstantsData({
                  ...appConstantsData,
                  perPagePhotosCountInfinite: Number(e.target.value) || 10,
                })
              }
              placeholder='Enter infinite scroll photos per page count'
            />
            <p className='text-muted-foreground text-sm'>
              {t('perPagePhotosCountInfiniteDescription')}
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='shuffle-photos-count'>
              {t('shufflePhotosCount')}
            </Label>
            <Input
              id='shuffle-photos-count'
              type='number'
              min='1'
              value={appConstantsData.shufflePhotosCount || ''}
              onChange={(e) =>
                setAppConstantsData({
                  ...appConstantsData,
                  shufflePhotosCount: Number(e.target.value) || 20,
                })
              }
              placeholder='Enter shuffle photos count'
            />
            <p className='text-muted-foreground text-sm'>
              {t('shufflePhotosCountDescription')}
            </p>
          </div>
          <div className='flex justify-end'>
            <Button
              className='w-16 cursor-pointer'
              onClick={handleSaveAppSettings}
              disabled={updateSettingsMutation.isPending || appLoading}
            >
              {updateSettingsMutation.isPending ? <Spinner /> : t('save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAboutSettings = () => (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>{t('about')}</h2>
        <p className='text-muted-foreground'>{t('aboutDescription')}</p>
      </div>

      <Card>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('version')}</Label>
            <div className='flex items-center space-x-2'>
              <Badge variant='outline'>v{appConfig.version}</Badge>
            </div>
          </div>
          <div className='space-y-2'>
            <Label>{t('developer')}</Label>
            <div className='flex items-center space-x-2'>
              <Info className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{appConfig.developer.name}</span>
              <Badge variant='secondary'>{appConfig.developer.role}</Badge>
            </div>
          </div>
          <div className='space-y-2'>
            <Label>{t('license')}</Label>
            <div className='flex items-center space-x-2'>
              <Badge variant='outline'>{appConfig.license.type}</Badge>
            </div>
          </div>
          <div className='space-y-4'>
            <Label>{t('repository')}</Label>

            <Card className='w-fit border-dashed'>
              <CardContent className='px-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-md bg-muted'>
                    <Github className='h-4 w-4 text-muted-foreground' />
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground text-xs'>
                      GitHub Repository
                    </p>
                    <a
                      href={appConfig.repository.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center space-x-1 text-blue-500 text-xs transition-colors hover:text-blue-600'
                    >
                      <span>
                        {appConfig.repository.url.replace('https://', '')}
                      </span>
                      <ExternalLink className='h-3 w-3' />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'account':
        return renderAccountSettings()

      case 'about':
        return renderAboutSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return <div className='flex flex-1 flex-col gap-6 p-6'>{renderContent()}</div>
}
