'use client'

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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/trpc/react'

interface GeneralSettingsProps {
  siteSettings?: Record<string, string>
  appSettings?: Record<string, string>
  siteLoading?: boolean
  appLoading?: boolean
}

export function GeneralSettings({
  siteSettings,
  appSettings,
  siteLoading = false,
  appLoading = false,
}: GeneralSettingsProps) {
  const t = useTranslations('Settings')

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

  return (
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
}
