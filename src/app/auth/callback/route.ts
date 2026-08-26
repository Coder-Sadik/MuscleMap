import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash') || searchParams.get('token')
  const type = searchParams.get('type')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // If Supabase forwarded an error directly in search params
  if (errorParam || errorDescription) {
    const errorMsg = errorDescription || errorParam || 'Authentication failed'
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`)
  }

  // Determine target redirect destination
  let next = searchParams.get('next')
  if (!next) {
    next = type === 'recovery' ? '/reset-password' : '/'
  }

  const supabase = await createClient()
  const forwardedHost = request.headers.get('x-forwarded-host')
  const targetBase = forwardedHost ? `https://${forwardedHost}` : origin

  // 1. Handle OTP Verification (e.g. recovery / signup token_hash)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    if (!error) {
      return NextResponse.redirect(`${targetBase}${next}`)
    }
  }

  // 2. Handle PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${targetBase}${next}`)
    }
  }

  // 3. Fallback: If neither code nor token_hash is in searchParams, the token or error may be in the URL hash fragment (#access_token=... or #error=...)
  // Since hash fragments are not sent over HTTP to the server, return an HTML bridge script to inspect window.location.hash in the browser.
  const fallbackHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Verifying Authentication...</title>
    <style>
      body {
        background-color: #000000;
        color: #ffffff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .loader {
        text-align: center;
      }
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(16, 185, 129, 0.2);
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px auto;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      p {
        font-size: 14px;
        color: #a1a1aa;
      }
    </style>
    <script>
      (function() {
        var hash = window.location.hash || '';
        var search = window.location.search || '';
        
        if (hash) {
          var hashParams = new URLSearchParams(hash.substring(1));
          var error = hashParams.get('error_description') || hashParams.get('error');
          var type = hashParams.get('type');
          
          if (error) {
            window.location.href = '/login?error=' + encodeURIComponent(error);
            return;
          }
          
          if (type === 'recovery' || hash.includes('type=recovery') || hash.includes('access_token=')) {
            window.location.href = '/reset-password' + hash;
            return;
          }
          
          window.location.href = '/' + hash;
          return;
        }
        
        // No hash and no valid query params
        window.location.href = '/login?error=' + encodeURIComponent('Could not verify email confirmation link. Please try resending.');
      })();
    </script>
  </head>
  <body>
    <div class="loader">
      <div class="spinner"></div>
      <p>Verifying secure link...</p>
    </div>
  </body>
</html>`

  return new Response(fallbackHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
