"use client"

import { useTranslations } from "next-intl"
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { loginAction } from "~/server/auth/actions"

export default function SignInPage() {
  const t = useTranslations("LoginPage")
  const [response, action] = useActionState(loginAction, undefined)

  useEffect(() => {
    if (response === "CredentialsSignInError") {
      toast.error("账号或密码错误")
    }
  }, [response])

  return (
    <div className="flex h-screen items-center">
      <form className="z-10 mx-auto w-80 space-y-5" action={action}>
        <p className="text-center text-2xl text-black dark:text-white">
          {t("title")}
        </p>
        <Input
          name="email"
          type="email"
          placeholder={t("email")}
          className="h-12"
        />
        <Input
          name="password"
          type="password"
          placeholder={t("password")}
          className="h-12"
        />
        <Button type="submit" className="h-12 w-full">
          {t("login")}
        </Button>
      </form>
    </div>
  )
}
