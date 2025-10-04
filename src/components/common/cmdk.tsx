'use client'

import { Command } from 'cmdk'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { useKey } from 'react-use'
import { useLanguageToggle } from '@/hooks/use-language-toggle'
import { useRouter } from '@/i18n/navigation'
import '@/styles/cmdk.css'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { locale, onSelectChange } = useLanguageToggle()

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
                    placeholder='Search for apps and commands...'
                  />
                </div>
                <Command.List>
                  <Command.Empty>No results found.</Command.Empty>

                  <Command.Group heading='Suggestions'>
                    <Command.Item onSelect={handleThemeToggle}>
                      <span>🌓</span>
                      Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                      <span className='raycast-meta'>Command</span>
                    </Command.Item>
                    <Command.Item onSelect={handleLanguageToggle}>
                      <span>🌐</span>
                      Switch to {locale === 'zh' ? 'English' : 'Chinese'}
                      <span className='raycast-meta'>Command</span>
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator />

                  <Command.Group heading='Commands'>
                    <Command.Item onSelect={() => handleNavigation('/')}>
                      <span>🏠</span>
                      Home
                      <span className='raycast-meta'>Application</span>
                    </Command.Item>
                    <Command.Item onSelect={() => handleNavigation('/explore')}>
                      <span>🔍</span>
                      Explore
                      <span className='raycast-meta'>Application</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() => handleNavigation('/dashboard')}
                    >
                      <span>📊</span>
                      Dashboard
                      <span className='raycast-meta'>Application</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className='raycast-footer'>
                  <div className='raycast-footer-left'>
                    <span>Open Application</span>
                    <kbd>↵</kbd>
                  </div>
                  <div className='raycast-footer-right'>
                    <span>Actions</span>
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
