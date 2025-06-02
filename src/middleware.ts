import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // Assuming getSession is compatible or adapted

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes, static files, and image optimization routes to pass through
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/_next/image/') ||
      pathname.endsWith('.png') || pathname.endsWith('.ico') || pathname.endsWith('.svg')) {
    return NextResponse.next();
  }

  const { isLoggedIn } = await getSession();

  const publicPaths = ['/login', '/register', '/'];

  if (!isLoggedIn && !publicPaths.some(p => pathname === p || (p === '/' && pathname.startsWith('/')) && !pathname.startsWith('/dashboard'))) {
    // If user is not logged in and trying to access a protected page (e.g., /dashboard), redirect to login
    if(pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    // If user is logged in and tries to access login or register, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * Or more generally, files with extensions like .png, .svg, etc.
     * We will refine this by explicitly allowing known public paths and protecting others.
     */
    // This regex tries to match most paths but exclude typical static assets and API calls.
    // It's a common pattern but might need adjustments based on your specific static asset needs.
    '/((?!api|_next/static|_next/image|.*\\..*).*)"', 
    '/', // Match the root path explicitly if not covered
    '/login',
    '/register',
    '/dashboard/:path*',
  ],
};
