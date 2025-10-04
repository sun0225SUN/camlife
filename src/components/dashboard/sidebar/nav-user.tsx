'use client'

import {
  Check,
  ChevronsUpDown,
  Languages,
  LogOut,
  Palette,
  Settings,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useLanguageToggle } from '@/hooks/use-language-toggle'
import { useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { signOut } from '@/lib/auth/client'
import { cn } from '@/lib/utils'
import { DASHBOARD_SETTINGS_PAGE, SIGN_IN_PAGE } from '@/routes'

interface NavUserProps {
  name: string
  email: string
}

export function NavUser({ name, email }: NavUserProps) {
  const t = useTranslations()
  const { isMobile } = useSidebar()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Language toggle
  const { locale: currentLocale, onSelectChange } = useLanguageToggle()
  const router = useRouter()

  // Theme toggle
  const { theme, setTheme } = useTheme()

  const toggleTheme = (theme: string) => {
    if (!document.startViewTransition) {
      setTheme(theme)
    } else {
      document.startViewTransition(() => setTheme(theme))
    }
  }

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await signOut()
      toast.success(t('Auth.signOutSuccess'))
      router.push(SIGN_IN_PAGE)
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      router.push(SIGN_IN_PAGE)
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='flex h-8 w-8 items-center justify-center rounded-lg'>
                <User size={22} />
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{name}</span>
                <span className='truncate text-xs'>{email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={12}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='flex h-8 w-8 items-center justify-center rounded-lg'>
                  <User size={22} />
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{name}</span>
                  <span className='truncate text-xs'>{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push(DASHBOARD_SETTINGS_PAGE)}
            >
              <Settings
                size={22}
                className='text-foreground'
              />
              {t('Settings.settings')}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex cursor-pointer items-center gap-2'>
                <Palette size={16} />
                <p>{t('Theme.theme')}</p>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='mb-4 ml-2 flex flex-col gap-1 p-2'>
                  <DropdownMenuItem
                    onClick={() => toggleTheme('light')}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1',
                      theme === 'light' && 'bg-accent',
                    )}
                  >
                    <span>{t('Theme.light')}</span>
                    {theme === 'light' && <Check className='ml-2 size-4' />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleTheme('dark')}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1',
                      theme === 'dark' && 'bg-accent',
                    )}
                  >
                    <span>{t('Theme.dark')}</span>
                    {theme === 'dark' && <Check className='ml-2 size-4' />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleTheme('system')}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1',
                      theme === 'system' && 'bg-accent',
                    )}
                  >
                    <span>{t('Theme.system')}</span>
                    {theme === 'system' && <Check className='ml-2 size-4' />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex cursor-pointer items-center gap-2'>
                <Languages size={16} />
                <p>{t('Language.language')}</p>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='mb-4 ml-2 flex flex-col gap-1 p-2'>
                  {routing.locales.map((locale) => (
                    <DropdownMenuItem
                      key={locale}
                      onClick={() => onSelectChange(locale)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1',
                        theme === 'dark' &&
                          'border-black/30 dark:border-white/50',
                      )}
                    >
                      <span>{t(`Language.${locale}`)}</span>
                      {currentLocale === locale && (
                        <Check className='ml-2 size-4' />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={isLoggingOut ? 'cursor-not-allowed opacity-50' : ''}
            >
              <LogOut
                size={22}
                className='text-red-500 dark:text-red-400'
              />
              {t('Auth.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
