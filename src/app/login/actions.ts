'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function getURL() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000'
  url = url.includes('http') ? url : `https://${url}`
  return url.replace(/\/$/, '')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Please enter both email and password')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      redirect(
        `/login?error=${encodeURIComponent(
          'Email not confirmed yet. Check your inbox or click "Resend Confirmation" below.'
        )}&unconfirmedEmail=${encodeURIComponent(email)}`
      )
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/signup?error=Please provide both email and password')
  }

  const siteUrl = getURL()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      })
      if (!resendErr) {
        redirect(
          `/login?message=${encodeURIComponent(
            'Account already registered. A new confirmation link was sent to your email!'
          )}&unconfirmedEmail=${encodeURIComponent(email)}`
        )
      } else {
        const resendMsg = resendErr.message.toLowerCase()
        if (resendMsg.includes('already confirmed') || resendMsg.includes('user already confirmed')) {
          redirect(
            `/login?message=${encodeURIComponent(
              'This account is already verified! Please sign in with your password.'
            )}&unconfirmedEmail=${encodeURIComponent(email)}`
          )
        }
        if (resendMsg.includes('security') || resendMsg.includes('rate limit') || resendMsg.includes('60 seconds')) {
          redirect(
            `/login?error=${encodeURIComponent(
              'Please wait 60 seconds before requesting another confirmation email (Supabase rate limit).'
            )}&unconfirmedEmail=${encodeURIComponent(email)}`
          )
        }
        redirect(`/login?error=${encodeURIComponent(resendErr.message)}&unconfirmedEmail=${encodeURIComponent(email)}`)
      }
    }
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // If Supabase returns fake user with empty identities (email enumeration protection)
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    const { error: resendErr } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    })
    if (resendErr) {
      const resendMsg = resendErr.message.toLowerCase()
      if (resendMsg.includes('already confirmed')) {
        redirect(
          `/login?message=${encodeURIComponent(
            'This account is already verified! Please sign in.'
          )}&unconfirmedEmail=${encodeURIComponent(email)}`
        )
      }
      if (resendMsg.includes('security') || resendMsg.includes('rate limit') || resendMsg.includes('60 seconds')) {
        redirect(
          `/login?error=${encodeURIComponent(
            'Email already requested recently. Please wait 60 seconds or check your spam folder.'
          )}&unconfirmedEmail=${encodeURIComponent(email)}`
        )
      }
    }
    redirect(
      `/login?message=${encodeURIComponent(
        'Confirmation email sent! Please check your inbox and spam folder.'
      )}&unconfirmedEmail=${encodeURIComponent(email)}`
    )
  }

  redirect(
    `/login?message=${encodeURIComponent(
      'Account created! Check your email to confirm your account and sign in.'
    )}&unconfirmedEmail=${encodeURIComponent(email)}`
  )
}

export async function resendConfirmation(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string)?.trim()

  if (!email) {
    redirect('/login?error=Please enter your email address to resend confirmation')
  }

  const siteUrl = getURL()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('already confirmed') || msg.includes('user already confirmed')) {
      redirect(
        `/login?message=${encodeURIComponent(
          'This email is already confirmed! Please sign in with your password.'
        )}&unconfirmedEmail=${encodeURIComponent(email)}`
      )
    }
    if (msg.includes('security') || msg.includes('rate limit') || msg.includes('60 seconds') || msg.includes('over_email_send_rate_limit')) {
      redirect(
        `/login?error=${encodeURIComponent(
          'Email rate limit reached. Please wait 60 seconds before requesting another email.'
        )}&unconfirmedEmail=${encodeURIComponent(email)}`
      )
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}&unconfirmedEmail=${encodeURIComponent(email)}`)
  }

  redirect(
    `/login?message=${encodeURIComponent(
      'New confirmation email sent! Check your inbox or spam folder.'
    )}&unconfirmedEmail=${encodeURIComponent(email)}`
  )
}


export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string)?.trim()

  if (!email) {
    redirect('/forgot-password?error=Please enter your email address')
  }

  const siteUrl = getURL()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  })

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/forgot-password?message=' + encodeURIComponent('Check your email for the password reset link'))
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!password) {
    redirect('/reset-password?error=' + encodeURIComponent('Please provide a new password'))
  }

  if (password.length < 6) {
    redirect('/reset-password?error=' + encodeURIComponent('Password must be at least 6 characters long'))
  }

  if (confirmPassword && password !== confirmPassword) {
    redirect('/reset-password?error=' + encodeURIComponent('Passwords do not match. Please ensure both fields are identical.'))
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('auth session missing') || msg.includes('session') || msg.includes('jwt')) {
      redirect(
        `/reset-password?error=${encodeURIComponent(
          'Password reset link is invalid or has expired. Please request a new link.'
        )}`
      )
    }
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  await supabase.auth.signOut()

  redirect('/login?message=' + encodeURIComponent('Password updated successfully! Please sign in with your new password.'))
}


