import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  const supabase = await createClient()

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const targetBase = forwardedHost ? `https://${forwardedHost}` : origin
      return NextResponse.redirect(`${targetBase}${next}`)
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const targetBase = forwardedHost ? `https://${forwardedHost}` : origin
      return NextResponse.redirect(`${targetBase}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not verify email confirmation link. Please try resending.`)
}

