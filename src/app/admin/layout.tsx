'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Authentication check with useEffect to avoid render-time redirects
  useEffect(() => {
    if (status === 'loading') return

    // If we're on the login page itself, don't redirect — let the login page render
    if (pathname === '/admin/login') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
    }
  }, [session, status, router, pathname])

  // Loading durumu
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yetki kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  // If we're rendering the login page, allow children (login UI) even without a session
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Admin kontrolü - sadece null return, redirect useEffect'te
  if (!session || session.user?.role !== 'admin') {
    return null
  }

  // Eski tasarım: Layout sadece authentication wrapper, 
  // AdminDashboard component'i kendi tasarımını handle eder
  return <>{children}</>
}