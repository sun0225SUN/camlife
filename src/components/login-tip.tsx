"use client"

import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import toast from "react-hot-toast"
import { logoutAction } from "~/server/auth/actions"

export function LoginTip() {
  const t = useTranslations("HomePage")
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <div>
          <p>{t("welcome")}</p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button
              className="mt-10"
              onClick={() =>
                logoutAction()
                  .then(() => {
                    toast.success("Logged out", {
                      duration: 1000,
                    })
                    setTimeout(() => {
                      window.location.reload()
                    }, 1000)
                  })
                  .catch(console.error)
              }
            >
              Sign out
            </button>
          </motion.div>
        </div>
      ) : (
        <div>
          <p className="text-center">Please log in</p>
          <Link href="/login" className="flex justify-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button className="mt-10">Sign in</button>
            </motion.div>
          </Link>
        </div>
      )}
    </>
  )
}
