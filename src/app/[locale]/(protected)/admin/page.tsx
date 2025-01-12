"use client"

export default function Admin() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <p>Hello Admin</p>
      <button onClick={() => (window.location.href = "/")}>
        Back to HomePage
      </button>
    </div>
  )
}
