import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/auth/register - Kullanıcı kaydı
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Frontend `RegisterForm` sends firstName and lastName
    const email = (body.email || '').toString().trim().toLowerCase()
    const password = (body.password || '').toString()
    const firstName = (body.firstName || '').toString().trim()
    const lastName = (body.lastName || '').toString().trim()

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Lütfen tüm zorunlu alanları doldurun' },
        { status: 400 }
      )
    }

    // Email regex (simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Geçersiz e-posta adresi' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 })
    }

    // Check existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`.trim(),
    })

    // Create JWT (used by some parts of the app) - keep same secret
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET || '',
      { expiresIn: '7d' }
    )

    // Prepare sanitized user response
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    }

    const response = NextResponse.json(
      { success: true, message: 'Kayıt başarılı', user: userResponse },
      { status: 201 }
    )

    // Set secure, httpOnly cookie for session convenience
    // Note: NextAuth also manages its own cookies; this is an additional token for API consumers.
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Kayıt sırasında sunucu hatası oluştu' },
      { status: 500 }
    )
  }
}