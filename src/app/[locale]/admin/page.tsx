"use client"

import { Button } from "~/components/ui/button"

export default function Admin() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <p>Hello Admin</p>
      <Button onClick={() => (window.location.href = "/")}>
        Back to HomePage
      </Button>
    </div>
  )
}
