import { redirect } from 'next/navigation'
import { DEFAULT_DASHBOARD_PAGE } from '@/routes'

export default function DashboardPage() {
  redirect(DEFAULT_DASHBOARD_PAGE)
}
