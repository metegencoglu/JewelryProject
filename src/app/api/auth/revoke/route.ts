import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import RefreshToken from '@/models/RefreshToken'
import crypto from 'crypto'
import Session from '@/models/Session'

export async function POST(request: NextRequest) {
  try {
    try {
      const refreshCookie = request.cookies.get('refreshToken')?.value || null
      const sessionCookie = request.cookies.get('sessionId')?.value || null
      console.debug('[revoke] incoming request', { url: request.url, refreshCookie: !!refreshCookie, sessionCookie: !!sessionCookie, ua: request.headers.get('user-agent') })
    } catch (e) {
      console.debug('[revoke] incoming request (cookies/headers unavailable)')
    }
    await connectDB()
    const cookie = request.cookies.get('refreshToken')
    if (cookie) {
      const tokenHash = crypto.createHash('sha256').update(cookie.value).digest('hex')
      const rt = await RefreshToken.findOneAndUpdate({ tokenHash }, { revoked: true })
      if (rt) {
        // remove any sessions linked to this refresh token
        await Session.deleteMany({ refreshToken: rt._id })
      }
    }

    // Also remove session if sessionId cookie present
    const sessionCookie = request.cookies.get('sessionId')
    if (sessionCookie) {
      const sessionHash = crypto.createHash('sha256').update(sessionCookie.value).digest('hex')
      await Session.findOneAndDelete({ sessionHash })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('refreshToken', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 0, path: '/api/auth' })
    response.cookies.set('sessionId', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 0, path: '/' })
    return response
  } catch (error) {
    console.error('revoke error:', error)
    return NextResponse.json({ success: false, error: 'Could not revoke refresh token' }, { status: 500 })
  }
}
