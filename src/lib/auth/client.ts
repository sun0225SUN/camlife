import { createAuthClient } from 'better-auth/react'

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  updateUser,
  changeEmail,
  changePassword,
  getSession,
} = createAuthClient()
