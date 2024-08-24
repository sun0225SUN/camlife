"use client"

import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { logoutAction } from "~/server/auth/actions"

export function LoginTip() {
  const t = useTranslations("HomePage")
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <div>
          <p>{t("welcome")}</p>
          <Button
            className="mt-10"
            onClick={() =>
              logoutAction()
                .then(() => window.location.reload())
                .catch(console.error)
            }
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-center">Please log in</p>
          <Link href="/login" className="flex justify-center">
            <Button className="mt-10">Sign in</Button>
          </Link>
        </div>
      )}
    </>
  )
}
