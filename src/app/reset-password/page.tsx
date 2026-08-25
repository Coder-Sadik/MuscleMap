import Link from 'next/link'
import { resetPassword } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/PasswordInput'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/server'
import { Dumbbell, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { message, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

        {/* Form Container with Glassmorphism */}
        <div className="relative p-8 rounded-3xl bg-zinc-950/50 backdrop-blur-xl border border-white/10 shadow-2xl">
          <form className="space-y-5">
            
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

            {!user && !error && (
              <div className="p-3 text-xs font-medium bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/20 flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Please make sure you clicked the reset link sent to your email to update your password.
                </span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                New Password
              </Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 px-4 rounded-xl bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
              />
              <span className="text-[11px] text-zinc-500">Minimum 6 characters</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirm_password"
                name="confirm_password"
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 px-4 rounded-xl bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
              />
            </div>

            <Button 
              formAction={resetPassword} 
              type="submit" 
              className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] mt-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Update Password
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>

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

