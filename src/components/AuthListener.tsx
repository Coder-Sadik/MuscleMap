'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthListener() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()

    // 1. Listen for Supabase auth state change events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (pathname !== '/reset-password') {
          router.push('/reset-password')
        }
      }
    })

    // 2. Check current URL for password recovery indicators in hash or query parameters
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const search = window.location.search

      const isRecoveryHash =
        hash.includes('type=recovery') ||
        (hash.includes('access_token=') && !hash.includes('type=signup'))
      const isRecoverySearch =
        search.includes('type=recovery') || search.includes('next=%2Freset-password')

      if ((isRecoveryHash || isRecoverySearch) && pathname !== '/reset-password') {
        router.push(`/reset-password${hash}${search}`)
      }
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname])

  return null
}
