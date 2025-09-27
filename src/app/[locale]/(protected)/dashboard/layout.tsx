import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/dashboard/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { SIGN_IN_PAGE } from '@/routes'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect(SIGN_IN_PAGE)
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
