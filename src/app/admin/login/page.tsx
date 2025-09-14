'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Eye, EyeOff, Shield, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const router = useRouter()

  // Admin girişi kontrolü
  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        setIsLoggedIn(true)
        router.push('/admin')
      }
    }
    checkAdminAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('') // Error'u temizle
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Geçici sabit admin bilgileri - veritabanı olmadan
      const TEMP_ADMIN_EMAIL = 'admin@luxejewelry.com'
      const TEMP_ADMIN_PASSWORD = 'admin123'

      if (formData.email === TEMP_ADMIN_EMAIL && formData.password === TEMP_ADMIN_PASSWORD) {
        // Geçici admin kullanıcı bilgisi oluştur
        const tempAdminUser = {
          _id: 'temp-admin-id',
          email: TEMP_ADMIN_EMAIL,
          name: 'Admin User',
          role: 'admin'
        }

        // Admin token'ı sakla
        localStorage.setItem('adminToken', 'temp-admin-token')
        localStorage.setItem('adminUser', JSON.stringify(tempAdminUser))
        
        // Admin panel'e yönlendir
        router.push('/admin')
      } else {
        setError('Email veya şifre hatalı. Admin bilgileri: admin@luxejewelry.com / admin123')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Giriş hatası oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-600" />
          <p className="text-gray-600">Admin paneline yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Paneli
          </h1>
          <p className="text-gray-600">
            Yönetici hesabınızla giriş yapın
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Adresi
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@luxejewelry.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Şifre
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Giriş yapılıyor...
              </div>
            ) : (
              'Admin Girişi'
            )}
          </Button>
        </form>

        {/* Test bilgileri - sadece development için */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-2">Test Hesabı:</p>
            <p className="text-xs text-blue-700">
              Email: admin@luxejewelry.com<br />
              Şifre: admin123
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </Card>
    </div>
  )
}