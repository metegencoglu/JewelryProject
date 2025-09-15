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

    // Token yoksa admin login'e yönlendir
    if (!token) {
      console.log('❌ Token yok -> admin login')
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Admin rolü yoksa ana sayfaya yönlendir
    if (token.role !== 'admin') {
      console.log('❌ Admin değil -> ana sayfa')
      return NextResponse.redirect(new URL('/', req.url))
    }
    
    console.log('✅ Admin erişim OK')
    return NextResponse.next()
  },
  {
    callbacks: {
      // Middleware'in çalışıp çalışmayacağını belirler
      authorized: () => true // Her zaman çalışsın, main fonksiyonda kontrol edelim
    }
  }
)

// Middleware'in hangi path'lerde çalışacağını belirle
export const config = {
  matcher: [
    // Admin panel tüm alt path'leri (login hariç)
    '/admin/((?!login).)*',
    // API route'ları da koruyabiliriz
    '/api/admin/:path*'
  ]
}