import { clsx } from "clsx/lite"
import { Form } from "./form"

export default async function SignInPage() {
  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 top-0",
        "flex flex-col items-center justify-center gap-8",
      )}
    >
      <Form />
    </div>
  )
}
