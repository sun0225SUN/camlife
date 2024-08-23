"use server"

import { signOut } from "~/server/auth"

export const logout = async () => {
  await signOut()
}
