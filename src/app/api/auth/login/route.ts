import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RefreshToken from '@/models/RefreshToken'
import Session from '@/models/Session'

// POST /api/auth/login - Kullanıcı girişi
export async function POST(request: NextRequest) {
  try {
    // Debug: log incoming request and cookies
    try {
      const refreshCookie = request.cookies.get('refreshToken')?.value || null
      const sessionCookie = request.cookies.get('sessionId')?.value || null
      console.debug('[login] incoming request', { url: request.url, refreshCookie: !!refreshCookie, sessionCookie: !!sessionCookie, ua: request.headers.get('user-agent') })
    } catch (e) {
      console.debug('[login] incoming request (cookies/headers unavailable)')
    }
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
    
    // Create Access Token (15m)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '15m' }
    )

    // Create Refresh Token (random string) and store hashed in DB (7d)
    const refreshTokenPlain = crypto.randomBytes(64).toString('hex')
    const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenPlain).digest('hex')
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await RefreshToken.create({ tokenHash: refreshTokenHash, user: user._id, expiresAt: refreshExpires })
  // create a server session linked to this refresh token
  const sessionIdPlain = crypto.randomBytes(32).toString('hex')
  const sessionHash = crypto.createHash('sha256').update(sessionIdPlain).digest('hex')
  const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const sessionDoc = await Session.create({ sessionHash, user: user._id, refreshToken: null, expiresAt: sessionExpires })
    
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
      accessToken
    })

    // Set refresh token as HttpOnly cookie (not accessible from JS)
    response.cookies.set('refreshToken', refreshTokenPlain, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/api/auth', // limit to auth routes
    })
    // Set sessionId cookie (HttpOnly) for session-based management
    response.cookies.set('sessionId', sessionIdPlain, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/', // application-wide session id
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
    // Revoke refresh token if present
    const cookie = request.cookies.get('refreshToken')
    if (cookie) {
      const tokenHash = crypto.createHash('sha256').update(cookie.value).digest('hex')
      const rt = await RefreshToken.findOneAndUpdate({ tokenHash }, { revoked: true })
      // If there is a session that references this refresh token, revoke it
      if (rt) await Session.findOneAndUpdate({ refreshToken: rt._id }, { revoked: true })
    }

    // Also revoke session by sessionId cookie
    const sessionCookie = request.cookies.get('sessionId')
    if (sessionCookie) {
      const sessionHash = crypto.createHash('sha256').update(sessionCookie.value).digest('hex')
      await Session.findOneAndUpdate({ sessionHash }, { revoked: true })
    }

    const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' })
    // Clear cookie
    response.cookies.set('refreshToken', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 0, path: '/api/auth' })
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Çıkış sırasında hata oluştu' },
      { status: 500 }
    )
  }
}