import { signIn } from "~/server/auth"

export function Form() {
  return (
    <form
      className="mx-auto max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-md"
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label className="mb-4 block">
        <span className="block text-sm font-medium text-gray-700">Email</span>
        <input
          name="email"
          type="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </label>
      <label className="mb-4 block">
        <span className="block text-sm font-medium text-gray-700">
          Password
        </span>
        <input
          name="password"
          type="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Sign In
      </button>
    </form>
  )
}
