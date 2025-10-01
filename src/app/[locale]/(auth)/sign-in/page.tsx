import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignIn } from '@/components/auth/sign-in'
import { auth } from '@/lib/auth'
import { DEFAULT_DASHBOARD_PAGE, SIGN_UP_PAGE } from '@/routes'
import { db } from '@/server/db'
import { user } from '@/server/db/schema/auth'

export default async function SignInPage() {
  // if authenticated: redirect to dashboard
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session) redirect(DEFAULT_DASHBOARD_PAGE)

  // if users not exist: redirect to signup
  const existingUsers = await db.select().from(user)
  if (existingUsers.length === 0) redirect(SIGN_UP_PAGE)

  return <SignIn />
}
