"use client"

import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { logout } from "~/server/auth/actions/logout"

export function LoginTip() {
  const t = useTranslations("HomePage")

  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <>
          <p>{t("welcome", { name: session?.user?.name })}</p>
          <Button
            className="mt-10"
            onClick={() =>
              logout()
                .then(() => window.location.reload())
                .catch(console.error)
            }
          >
            Sign out
          </Button>
        </>
      ) : (
        <>
          <p className="text-center">Please log in</p>
          <Link href="/login" className="flex justify-center">
            <Button className="mt-10">Sign in</Button>
          </Link>
        </>
      )}
    </div>
  )
}
