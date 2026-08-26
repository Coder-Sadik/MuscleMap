import Link from 'next/link'
import { Dumbbell } from 'lucide-react'
import { ResetPasswordForm } from './ResetPasswordForm'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { message, error } = await searchParams

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-[400px] px-6 py-12 animate-in fade-in zoom-in-95 duration-700 ease-out">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
            <Dumbbell className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Update <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Password</span>
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Enter and confirm your new secure password.
          </p>
        </div>

        {/* Form */}
        <ResetPasswordForm initialError={error} initialMessage={message} />

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-500">
            Remember your old password?{' '}
            <Link href="/login" className="text-white hover:text-emerald-400 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-zinc-600">
            Didn&apos;t receive a link?{' '}
            <Link href="/forgot-password" className="text-zinc-400 hover:text-emerald-400 hover:underline transition-colors">
              Request new link
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
