"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import toast from "react-hot-toast"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { loginAction } from "~/server/auth/actions"

export default function SignInPage() {
  const t = useTranslations("LoginPage")
  const [response, action] = useFormState(loginAction, undefined)

  useEffect(() => {
    if (response === "CredentialsSignInError") {
      toast.error("账号或密码错误")
    }
  }, [response])

  return (
    <div className="flex h-screen items-center bg-white bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      <form className="z-50 mx-auto w-80 space-y-5" action={action}>
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
