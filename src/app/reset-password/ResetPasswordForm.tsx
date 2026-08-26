'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/PasswordInput'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'

interface ResetPasswordFormProps {
  initialError?: string
  initialMessage?: string
}

export function ResetPasswordForm({ initialError, initialMessage }: ResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [message, setMessage] = useState<string | null>(initialMessage || null)
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // 1. Check for errors in the URL hash (e.g., expired token)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const hashError = hashParams.get('error_description') || hashParams.get('error')
      if (hashError) {
        setError(hashError.replace(/\+/g, ' '))
      }
    }

    // 2. Check active session
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setHasValidSession(!!session)
    }
    checkSession()

    // 3. Listen for auth changes (e.g. PASSWORD_RECOVERY event setting session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setHasValidSession(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!password) {
      setError('Please enter a new password.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        const msg = updateError.message.toLowerCase()
        if (msg.includes('auth session missing') || msg.includes('session') || msg.includes('jwt')) {
          setError('Password reset link is invalid or has expired. Please request a new link.')
        } else {
          setError(updateError.message)
        }
        setLoading(false)
        return
      }

      // Successfully updated password
      setMessage('Password updated successfully! Redirecting to sign in...')
      
      // Sign out to ensure clean state and prompt user to login with new password
      await supabase.auth.signOut()

      setTimeout(() => {
        router.push(
          '/login?message=' +
            encodeURIComponent('Password updated successfully! Please sign in with your new password.')
        )
      }, 1000)
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative p-8 rounded-3xl bg-zinc-950/50 backdrop-blur-xl border border-white/10 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {hasValidSession === false && !error && (
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            disabled={loading}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            disabled={loading}
            className="h-12 px-4 rounded-xl bg-black/50 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] mt-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Update Password
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
