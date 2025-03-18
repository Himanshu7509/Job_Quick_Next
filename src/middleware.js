import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
// Remove the js-cookie import as it's client-side only and won't work in middleware

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = [
    '/user-login',
    '/user-signup',
    '/about',
    '/contact',
    '/'
  ].includes(path) || path.startsWith('/static/') || path.includes('.');
  
  // Define explicitly protected paths
  const protectedPaths = [
    '/dashboard',
    '/jobs',
    '/post-job',
    '/salary-calc',
    '/user-profile',
    '/resume-builder',
    '/ats-checker',
    '/mock-test',
    '/host-profile'
  ];
  
  // Check if path is explicitly protected or not public
  const needsAuth = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)) || !isPublicPath;
  
  // Get auth token from cookies
  const authToken = request.cookies.get("authToken")?.value;
  
  // If the path needs auth and there's no auth token, redirect to login
  if (needsAuth && !authToken) {
    return NextResponse.redirect(new URL('/user-login', request.url));
  }
  
  // For login/signup pages, redirect to dashboard if already logged in
  if (authToken && (path === '/user-login' || path === '/user-signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    // Match all paths except for those starting with:
    // - api paths that don't need auth
    // - static files (images, etc)
    // - favicon.ico
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};