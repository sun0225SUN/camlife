import { headers } from 'next/headers'
import { LogoutButton } from '@/components/auth/logout-button'
import { auth } from '@/lib/auth'

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='font-bold text-2xl'>Dashboard</h1>
        <LogoutButton />
      </div>

      <div className='mb-6 p-4'>
        <h2 className='mb-2 font-semibold text-lg'>Welcome back!</h2>
        <p className='mb-2'>
          <strong>Name:</strong> {session!.user.name}
        </p>
        <p className='mb-2'>
          <strong>Email:</strong> {session!.user.email}
        </p>
      </div>
    </div>
  )
}
