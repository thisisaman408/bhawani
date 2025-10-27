import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin-auth');
    
    // Check if authenticated
    if (authCookie?.value === process.env.ADMIN_SECRET) {
      return NextResponse.next();
    }
    
    // Redirect to login
    if (pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
