import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignUp } from '@/components/auth/sign-up'
import { auth } from '@/lib/auth'
import { DASHBOARD_PAGE, SIGN_IN_PAGE } from '@/routes'
import { db } from '@/server/db'
import { user } from '@/server/db/schema/auth'

export default async function SignUpPage() {
  // if authenticated: redirect to dashboard
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session) redirect(DASHBOARD_PAGE)

  // if not authenticated but users exist: redirect to signin
  const existingUsers = await db.select().from(user)
  if (existingUsers.length > 0) redirect(SIGN_IN_PAGE)

  // if no users exist: allow access to signup (first user setup)
  return <SignUp />
}
