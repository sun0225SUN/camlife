import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignIn } from '@/components/auth/sign-in'
import { auth } from '@/lib/auth'
import { DASHBOARD_PAGE } from '@/routes'

export default async function SignInPage() {
  // if authenticated: redirect to dashboard
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session) redirect(DASHBOARD_PAGE)

  return <SignIn />
}
