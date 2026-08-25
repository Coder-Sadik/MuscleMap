import Link from 'next/link'
import { signup, resendConfirmation } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dumbbell, ArrowRight, Mail } from 'lucide-react'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; unconfirmedEmail?: string }>
}) {
  const { message, error, unconfirmedEmail } = await searchParams;

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
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Movement</span>
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Create an account to start tracking.
          </p>
        </div>

        {/* Form Container with Glassmorphism */}
        <div className="relative p-8 rounded-3xl bg-zinc-950/50 backdrop-blur-xl border border-white/10 shadow-2xl">
          <form className="space-y-6">
            
            {error && (
              <div className="p-3 text-sm font-medium bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm font-medium bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-center animate-in slide-in-from-top-2">
                {message}
              </div>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={unconfirmedEmail || ''}
                placeholder="m@example.com"
                required
                className="h-12 px-4 rounded-xl bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 px-4 rounded-xl bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
              />
            </div>

            <Button 
              formAction={signup} 
              type="submit" 
              className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)]"
            >
              Sign Up
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Unconfirmed account?</span>
              <button
                formAction={resendConfirmation}
                type="submit"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                Resend Link
              </button>
            </div>
          </form>
        </div>


        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-emerald-400 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
