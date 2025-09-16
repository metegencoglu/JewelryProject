import { NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import RefreshTokenModel from '@/models/RefreshToken'
import SessionModel from '@/models/Session'
import jwt from 'jsonwebtoken'

// POST /api/auth/logout
export async function POST(req: Request) {
  await connectDB()

  try {
    // Parse cookies manually to find sessionId or refreshToken if present
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => {
          const [k, ...v] = s.split('=')
          return [k, decodeURIComponent(v.join('='))]
        })
    )

    const sessionId = cookies['sessionId'] || null
    const refreshCookie = cookies['refreshToken'] || null

    // Try to find user id from existing access token (Authorization header) or NextAuth session cookie
    let userId: string | null = null
    try {
      const authHeader = req.headers.get('authorization')
      let tokenString: string | null = null
      if (authHeader?.startsWith('Bearer ')) tokenString = authHeader.split(' ')[1]
      // NextAuth app router session cookie name can be 'next-auth.session-token' or '__Secure-next-auth.session-token'
      if (!tokenString) tokenString = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'] || null

      if (tokenString && process.env.NEXTAUTH_SECRET) {
        const decoded: any = jwt.verify(tokenString, process.env.NEXTAUTH_SECRET)
        if (decoded?.sub) userId = decoded.sub
      }
    } catch (e) {
      // ignore token decode errors
    }

    const crypto = await import('crypto')

    console.debug('[logout] incoming cookies', { sessionId, refreshCookie })

    const now = new Date()

    if (userId) {
      // Soft revoke: mark tokens and sessions revoked for audit
      const rtRes = await RefreshTokenModel.updateMany({ user: userId }, { $set: { revoked: true, revokedAt: now, revokedReason: 'user_logout' } })
      const sessRes = await SessionModel.updateMany({ user: userId }, { $set: { revoked: true, revokedAt: now, revokedReason: 'user_logout' } })
      console.debug('[logout] soft-revoked by user', { userId, modifiedRefresh: rtRes.modifiedCount, modifiedSessions: sessRes.modifiedCount })
    } else if (refreshCookie) {
      try {
        const hash = crypto.createHash('sha256').update(refreshCookie).digest('hex')
        console.debug('[logout] refreshCookie hash', { hash })
        const rt = await RefreshTokenModel.findOneAndUpdate({ tokenHash: hash }, { revoked: true, revokedAt: now, revokedReason: 'user_logout' })
        if (rt) {
          const sessRes2 = await SessionModel.updateMany({ refreshToken: rt._id }, { $set: { revoked: true, revokedAt: now, revokedReason: 'user_logout' } })
          console.debug('[logout] soft-revoked sessions by refreshToken', { refreshTokenId: rt._id, modified: sessRes2.modifiedCount })
        } else {
          console.debug('[logout] no refreshToken doc found for hash')
        }
      } catch (e) {
        console.error('logout: revoke by cookie failed', e)
      }
    } else if (sessionId) {
      try {
        const hash = crypto.createHash('sha256').update(sessionId).digest('hex')
        const sessRes = await SessionModel.findOneAndUpdate({ sessionHash: hash }, { $set: { revoked: true, revokedAt: now, revokedReason: 'user_logout' } })
        console.debug('[logout] soft-revoked session by sessionHash', { sessionHash: hash, found: !!sessRes, id: sessRes?._id })
      } catch (e) {
        console.error('logout: revoke by session failed', e)
      }
    }

    // Clear cookies in response
    const response = NextResponse.json({ ok: true })
    response.cookies.set('refreshToken', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0, path: '/api/auth' })
    response.cookies.set('sessionId', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0, path: '/' })
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ ok: false, error: 'logout_failed' }, { status: 500 })
  }
}
