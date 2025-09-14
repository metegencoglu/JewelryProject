import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/auth/register - Kullanıcı kaydı
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password, name } = await request.json()
    
    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanları doldurun' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      )
    }
    
    // Email kontrolü
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu email zaten kayıtlı' },
        { status: 409 }
      )
    }
    
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Kullanıcı oluştur
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    })
    
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
      createdAt: user.createdAt
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Kayıt başarılı',
      user: userResponse,
      token
    }, { status: 201 })
    
    // HTTP-only cookie set et
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 gün
    })
    
    return response
    
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Kayıt sırasında hata oluştu' },
      { status: 500 }
    )
  }
}