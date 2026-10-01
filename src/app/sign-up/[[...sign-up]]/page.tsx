import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-bold text-black">
            The Jeweller&apos;s Hub
          </span>
          <p className="mt-2 text-[var(--color-muted)] text-sm">
            Create your account to start shopping
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
