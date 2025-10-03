'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useKey } from 'react-use'
import { useLanguageToggle } from '@/hooks/use-language-toggle'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { locale, onSelectChange } = useLanguageToggle()

  useKey('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen((open) => !open)
    }
  })

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
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center pt-[15vh]',
        'bg-black/50 backdrop-blur-sm',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false)
        }
      }}
    >
      <div
        className={cn(
          'w-full max-w-[640px] rounded-lg border bg-popover p-0 shadow-lg',
          'fade-in-0 zoom-in-95 animate-in duration-200',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Dialog.Title className='sr-only'>Global Command Menu</Dialog.Title>
        <div className='flex items-center border-b px-3'>
          <Command.Input
            placeholder='Type a command or search...'
            className={cn(
              'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none',
              'text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />
        </div>
        <Command.List className='max-h-[300px] overflow-y-auto overflow-x-hidden p-1'>
          <Command.Empty className='py-6 text-center text-muted-foreground text-sm'>
            No results found.
          </Command.Empty>

          {/* Settings Section */}
          <Command.Group
            heading='Settings'
            className={cn(
              'px-2 py-1.5 font-medium text-muted-foreground text-xs',
            )}
          >
            <Command.Item
              className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'text-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              )}
              onSelect={handleThemeToggle}
            >
              <span className='mr-2'>🌓</span>
              Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </Command.Item>
            <Command.Item
              className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'text-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              )}
              onSelect={handleLanguageToggle}
            >
              <span className='mr-2'>🌐</span>
              Switch to {locale === 'zh' ? 'English' : 'Chinese'}
            </Command.Item>
          </Command.Group>

          <Command.Separator className='my-1 h-px bg-border' />

          {/* Navigation Section */}
          <Command.Group
            heading='Navigation'
            className={cn(
              'px-2 py-1.5 font-medium text-muted-foreground text-xs',
            )}
          >
            <Command.Item
              className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'text-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              )}
              onSelect={() => handleNavigation('/')}
            >
              <span className='mr-2'>🏠</span>
              Home
            </Command.Item>
            <Command.Item
              className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'text-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              )}
              onSelect={() => handleNavigation('/explore')}
            >
              <span className='mr-2'>🔍</span>
              Explore
            </Command.Item>
            <Command.Item
              className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'text-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              )}
              onSelect={() => handleNavigation('/dashboard')}
            >
              <span className='mr-2'>📊</span>
              Dashboard
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  )
}
