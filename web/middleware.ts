import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /auth/login)
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/' || 
    path === '/sign-in' || 
    path === '/sign-up' || 
    path === '/forgot-password' ||
    path.startsWith('/auth/') ||
    path.startsWith('/api/');

  // Check for better-auth session cookie
  const authSessionCookie = request.cookies.get('auth-session');
  
  // If the route is protected and the user is not authenticated
  if (!isPublicPath && !authSessionCookie) {
    // Redirect to the sign-in page
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If the user is authenticated and tries to access auth pages
  if (isPublicPath && authSessionCookie && (path === '/sign-in' || path === '/sign-up')) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip all files in these paths
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};
