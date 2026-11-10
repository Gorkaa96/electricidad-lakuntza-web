import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// One Vercel project serves the public website and the authenticated CRM.
// Pages on the admin hostname must never become a second indexed website.
const adminHostname = 'admin.electricidadlakuntza.com';
const publicHostname = 'www.electricidadlakuntza.com';
const stablePreviewHostname = 'electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app';

export async function middleware(request) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;
  const onAdminHostname = hostname === adminHostname;

  // Immutable Vercel Preview URLs change on every commit. Their hostnames are
  // not all registered with Turnstile, causing error 110200. On this protected
  // integration branch, send form entry pages to the ONE stable preview alias.
  if (process.env.VERCEL_ENV === 'preview' &&
      process.env.VERCEL_GIT_COMMIT_REF === 'integration/launch-prep-2026-10-29' &&
      hostname.endsWith('.vercel.app') && hostname !== stablePreviewHostname &&
      (pathname === '/revision-factura-luz-gas' || pathname === '/consulta')) {
    const canonicalPreview = request.nextUrl.clone();
    canonicalPreview.hostname = stablePreviewHostname;
    canonicalPreview.port = '';
    const redirect = NextResponse.redirect(canonicalPreview, 307);
    redirect.headers.set('Cache-Control', 'no-store');
    redirect.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return redirect;
  }

  if (onAdminHostname && (pathname === '/' || pathname === '/admin')) {
    const landing = request.nextUrl.clone();
    landing.pathname = '/admin/entrada';
    const redirect = NextResponse.redirect(landing, 307);
    redirect.headers.set('Cache-Control', 'private, no-store, max-age=0');
    redirect.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return redirect;
  }

  // Keep public pages and SEO on www, not the internal admin hostname.
  // Authentication and authorization continue to live on the /admin routes.
  if (onAdminHostname && !pathname.startsWith('/admin/')) {
    const publicUrl = request.nextUrl.clone();
    publicUrl.hostname = publicHostname;
    const redirect = NextResponse.redirect(publicUrl, 308);
    redirect.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return redirect;
  }

  // Public routes need no CRM session lookup.
  if (!pathname.startsWith('/admin/')) return NextResponse.next();

  // Refresh cookies for authenticated pages because Server Components
  // cannot persist refreshed tokens. Roles are checked in app + database RLS.
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getUser();
  }
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  if (onAdminHostname) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return response;
}

// Run on site routes while excluding APIs, Next.js assets and file assets.
export const config = {
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};
