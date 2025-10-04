'use client'

import { Github } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { appConfig } from '@/config/app'

export function AboutSettings() {
  const t = useTranslations('settings')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>{t('about')}</h2>
        <p className='text-muted-foreground'>{t('about-description')}</p>
      </div>

      <Card>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('version')}</Label>
            <div className='flex items-center space-x-2'>
              <Badge className='border-green-500 bg-transparent text-green-500'>
                v{appConfig.version}
              </Badge>
            </div>
          </div>
          <div className='space-y-2'>
            <Label>{t('developer')}</Label>
            <div className='flex items-center space-x-2'>
              <Link
                href='https://guoqi.dev'
                target='_blank'
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className='cursor-help border-blue-500 bg-transparent text-blue-500'>
                      {appConfig.developer.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{appConfig.developer.role}</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </div>
          </div>
          <div className='space-y-2'>
            <Label>{t('license')}</Label>
            <div className='flex items-center space-x-2'>
              <Badge className='border-amber-500 bg-transparent text-amber-500'>
                {appConfig.license.type}
              </Badge>
            </div>
          </div>
          <div className='space-y-4'>
            <Label>{t('repository')}</Label>

            <div className='flex items-center space-x-2'>
              <a
                href={appConfig.repository.url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block'
              >
                <Badge className='cursor-pointer border-gray-500 bg-transparent text-gray-500 hover:bg-gray-100'>
                  <Github className='mr-1 size-4' />
                  <span>{t('github')}</span>
                </Badge>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
