import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Next.js 15 uses middleware.js (proxy.js is a Next.js 16 convention).
// The dedicated admin hostname shares the existing app, Auth and RLS.
const adminHostname = 'admin.electricidadlakuntza.com';

export async function middleware(request) {
  // A clean entry point for the future internal subdomain. The admin pages
  // continue to enforce authenticated membership and database permissions.
  if (request.nextUrl.pathname === '/') {
    if (request.nextUrl.hostname.toLowerCase() !== adminHostname) {
      return NextResponse.next();
    }
    const landing = request.nextUrl.clone();
    landing.pathname = '/admin/entrada';
    const redirect = NextResponse.redirect(landing, 307);
    redirect.headers.set('Cache-Control', 'private, no-store, max-age=0');
    redirect.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return redirect;
  }

  // Refresh cookies here because Server Components cannot persist refreshed tokens.
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
    // This verifies with Auth, rather than trusting user-controlled session data.
    // Authorization remains in getAdminContext and the database RLS policies.
    await supabase.auth.getUser();
  }
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = { matcher: ['/', '/admin/:path*'] };
