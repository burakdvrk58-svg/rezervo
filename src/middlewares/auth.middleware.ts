import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES } from '@/constants/routes'

// Routes that require authentication
const protectedRoutes = ['/customer', '/business', '/admin']

// Routes only accessible when NOT authenticated
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check authentication via cookie/header
  // NOTE: In production, validate JWT token here
  const accessToken = request.cookies.get('rezervo_access_token')?.value
  const isAuthenticated = !!accessToken

  // Protect dashboard routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
