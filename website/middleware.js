import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (token && isPublicPath) {
    const verified = await verifyToken(token);
    if (verified) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected routes
  if (token && !isPublicPath) {
    const verified = await verifyToken(token);
    if (!verified) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|reports).*)',
  ],
};
