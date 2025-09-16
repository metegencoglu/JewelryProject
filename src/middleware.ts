import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // Middleware fonksiyonu - her korumalı route için çalışır
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    
    console.log('🛡️ Middleware:', {
      path: pathname,
      hasToken: !!token,
      userRole: token?.role
    })

    // Admin login sayfasına erişime izin ver - redirect döngüsünü önle
    if (pathname === '/admin/login') {
      console.log('✅ Admin login sayfası - geçiliyor')
      return NextResponse.next()
    }
    
    // Token yoksa admin login'e yönlendir
    if (!token) {
      console.log('❌ Token yok -> admin login yönlendiriliyor')
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Admin rolü yoksa admin login sayfasına yönlendir
    if (token.role !== 'admin') {
      console.log('❌ Admin değil -> admin login yönlendiriliyor')
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    
    console.log('✅ Admin erişim OK')
    return NextResponse.next()
  },
  {
    callbacks: {
      // Middleware'in çalışıp çalışmayacağını belirler
      // Return true so the middleware function always runs and can perform its own redirects.
      authorized: () => true
    }
  }
)

// Middleware'in hangi path'lerde çalışacağını belirle
export const config = {
  matcher: [
    // Admin panel tüm alt path'leri (login hariç)
    '/admin/:path*'
  ]
}