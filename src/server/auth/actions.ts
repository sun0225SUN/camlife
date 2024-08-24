"use server"

import { redirect } from "next/navigation"
import { PATH_ADMIN } from "~/routes"
import {
  auth,
  KEY_CALLBACK_URL,
  KEY_CREDENTIALS_CALLBACK_ROUTE_ERROR_URL,
  KEY_CREDENTIALS_SIGN_IN_ERROR_URL,
  signIn,
  signOut,
} from "~/server/auth"

export const loginAction = async (
  _prevState: string | undefined,
  formData: FormData,
) => {
  try {
    await signIn("credentials", Object.fromEntries(formData))
  } catch (error) {
    if (
      String(error).includes(KEY_CREDENTIALS_SIGN_IN_ERROR_URL) ||
      String(error).includes(KEY_CREDENTIALS_CALLBACK_ROUTE_ERROR_URL)
    ) {
      // Return credentials error to display on sign-in page.
      return "CredentialsSignInError"
    } else if (!String(error).includes("NEXT_REDIRECT")) {
      console.log("Unknown sign in error:", {
        errorText: error,
        error,
      })
      // Rethrow non-redirect errors
      throw error
    }
  }
  redirect((formData.get(KEY_CALLBACK_URL) as string) || PATH_ADMIN)
}

export const logoutAction = async () => {
  await signOut()
}

export const getAuthAction = () => auth()
