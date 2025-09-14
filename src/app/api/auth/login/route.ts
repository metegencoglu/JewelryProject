import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/auth/login - Kullanıcı girişi
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }
    
    // Kullanıcı kontrolü
    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }
    
    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }
    
    // Last login güncelle
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })
    
    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )
    
    // Şifreyi response'dan çıkar
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      favorites: user.favorites,
      profile: user.profile
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      user: userResponse,
      token
    })
    
    // HTTP-only cookie set et
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 gün
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Giriş sırasında hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/login - Çıkış yap
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Çıkış yapıldı'
    })
    
    // Cookie'yi sil
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Çıkış sırasında hata oluştu' },
      { status: 500 }
    )
  }
}