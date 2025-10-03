'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MagicCard } from '@/components/ui/magic-card'
import { PasswordInput } from '@/components/ui/password-input'
import { signIn, signUp } from '@/lib/auth/client'
import { DASHBOARD_HOME_PAGE, SIGN_IN_PAGE } from '@/routes'

export function SignUp() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const gradientColor = theme === 'dark' ? '#262626' : '#D9D9D955'

  const signUpSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: t('usernameRequired') })
        .max(50, { message: t('usernameRequired') }),
      email: z.email({ message: t('emailInvalid') }),
      password: z
        .string()
        .min(8, { message: t('passwordRequirements.length') })
        .regex(/[A-Z]/, { message: t('passwordRequirements.uppercase') })
        .regex(/[a-z]/, { message: t('passwordRequirements.lowercase') })
        .regex(/[0-9]/, { message: t('passwordRequirements.number') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDoNotMatch'),
      path: ['confirmPassword'],
    })

  type SignUpFormData = z.infer<typeof signUpSchema>

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)

    try {
      const { data: signUpData, error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (error) {
        form.setError('root', {
          message: error.message || t('signUpError'),
        })
        return
      }

      if (signUpData) {
        toast.success(t('signUpSuccess'))
        // auto sign in
        const { error: signInError } = await signIn.email({
          email: data.email,
          password: data.password,
        })

        if (!signInError) {
          router.push(DASHBOARD_HOME_PAGE)
          router.refresh()
        } else {
          router.push(SIGN_IN_PAGE)
        }
      }
    } catch (_err) {
      form.setError('root', {
        message: t('networkError'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className='mt-3 mb-6 text-center font-bold text-2xl'>{t('sign-up')}</p>

      <Card className='relative border-none p-0'>
        <MagicCard
          gradientColor={gradientColor}
          className='p-10'
        >
          <CardContent className='p-0'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
                autoComplete='on'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-3'>
                      <FormLabel className='font-medium text-sm'>
                        {t('username')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder={t('usernamePlaceholder')}
                          className='h-10'
                          autoComplete='name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-3'>
                      <FormLabel className='font-medium text-sm'>
                        {t('email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder={t('emailPlaceholder')}
                          className='h-10'
                          autoComplete='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-3'>
                      <FormLabel className='font-medium text-sm'>
                        {t('password')}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t('passwordPlaceholder')}
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-3'>
                      <FormLabel className='font-medium text-sm'>
                        {t('confirmPassword')}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t('confirmPasswordPlaceholder')}
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className='text-destructive text-sm'>
                    {form.formState.errors.root.message}
                  </p>
                )}

                <Button
                  type='submit'
                  className='mt-4 h-10 w-full cursor-pointer'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2Icon className='animate-spin' />
                  ) : (
                    t('sign-up')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </MagicCard>
      </Card>
    </>
  )
}
