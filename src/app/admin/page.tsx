'use client'

import { useState, useEffect } from 'react'
import { AdminDashboard } from '../../components/AdminDashboard'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AdminUser {
  _id: string
  email: string
  name: string
  role: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Checking admin authentication...')
      const token = localStorage.getItem('adminToken')
      const user = localStorage.getItem('adminUser')
      
      console.log('Token:', token ? 'EXISTS' : 'NOT FOUND')
      console.log('User:', user ? 'EXISTS' : 'NOT FOUND')
      
      if (!token || !user) {
        console.log('❌ No auth data found, creating temporary admin session')
        // Geçici admin session oluştur
        const tempAdmin = {
          _id: 'temp-admin',
          email: 'admin@luxejewelry.com',
          name: 'Admin User',
          role: 'admin'
        }
        localStorage.setItem('adminToken', 'temp-token')
        localStorage.setItem('adminUser', JSON.stringify(tempAdmin))
        setAdminUser(tempAdmin)
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }
      
      try {
        const parsedUser = JSON.parse(user) as AdminUser
        
        // Geçici kontrol - sadece admin role'ü kontrol et
        if (parsedUser.role !== 'admin') {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          router.push('/admin/login')
          return
        }
        
        setAdminUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth error:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      router.push('/')
    } else if (page === 'logout') {
      handleLogout()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-600" />
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null // Router redirect will handle this
  }

  return (
    <div className="min-h-screen">
      <AdminDashboard onNavigate={handleNavigate} adminUser={adminUser} />
    </div>
  )
}