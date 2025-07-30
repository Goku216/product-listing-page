import { SignupForm } from "@/components/signup-form"
import { Navbar5 } from "@/components/navbar5"

export default function Signup() {
  return (
    <>
      <Navbar5 />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </>
  )
}