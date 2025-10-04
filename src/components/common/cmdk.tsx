'use client'

import { Command } from 'cmdk'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { useKey } from 'react-use'
import { useLanguageToggle } from '@/hooks/use-language-toggle'
import { useRouter } from '@/i18n/navigation'
import '@/styles/cmdk.css'
import { useTranslations } from 'next-intl'
import { DASHBOARD_HOME_PAGE, EXPLORE_MAP_PAGE } from '@/routes'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { locale, onSelectChange } = useLanguageToggle()
  const t = useTranslations('common')

  useKey('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
  })

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  const handleNavigation = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLanguageToggle = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh'
    onSelectChange(newLocale)
    setOpen(false)
  }

  return (
    <>
      {open && (
        <div
          className='command-menu-overlay'
          onClick={() => setOpen(false)}
        >
          <div
            className='command-menu-content'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='raycast'>
              <Command>
                <div>
                  <Command.Input
                    ref={inputRef}
                    placeholder={t('search-apps-and-commands')}
                  />
                </div>
                <Command.List>
                  <Command.Empty>{t('no-results-found')}</Command.Empty>

                  <Command.Group heading={t('suggestions')}>
                    <Command.Item onSelect={handleThemeToggle}>
                      <span>🌓</span>
                      {t('toggle')} {theme === 'dark' ? t('light') : t('dark')}{' '}
                      {t('mode')}
                      <span className='raycast-meta'>{t('command')}</span>
                    </Command.Item>
                    <Command.Item onSelect={handleLanguageToggle}>
                      <span>🌐</span>
                      {t('switch-to')} {locale === 'zh' ? t('en') : t('zh')}
                      <span className='raycast-meta'>{t('command')}</span>
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator />

                  <Command.Group heading={t('commands')}>
                    <Command.Item
                      onSelect={() => handleNavigation(DASHBOARD_HOME_PAGE)}
                    >
                      <span>🏠</span>
                      {t('home')}
                      <span className='raycast-meta'>{t('application')}</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() => handleNavigation(EXPLORE_MAP_PAGE)}
                    >
                      <span>🔍</span>
                      {t('explore')}
                      <span className='raycast-meta'>{t('application')}</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() => handleNavigation(DASHBOARD_HOME_PAGE)}
                    >
                      <span>📊</span>
                      {t('dashboard')}
                      <span className='raycast-meta'>{t('application')}</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className='raycast-footer'>
                  <div className='raycast-footer-left'>
                    <span>{t('open-application')}</span>
                    <kbd>↵</kbd>
                  </div>
                  <div className='raycast-footer-right'>
                    <span>{t('actions')}</span>
                    <kbd>⌘</kbd>
                    <kbd>K</kbd>
                  </div>
                </div>
              </Command>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
