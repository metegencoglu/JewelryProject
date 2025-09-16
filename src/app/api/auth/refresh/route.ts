import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RefreshToken from '@/models/RefreshToken'
import User from '@/models/User'
import { getToken } from 'next-auth/jwt'
import Session from '@/models/Session'

export async function POST(request: NextRequest) {
  try {
    try {
      const refreshCookie = request.cookies.get('refreshToken')?.value || null
      const sessionCookie = request.cookies.get('sessionId')?.value || null
      console.debug('[refresh] incoming request', { url: request.url, refreshCookie: !!refreshCookie, sessionCookie: !!sessionCookie, ua: request.headers.get('user-agent') })
    } catch (e) {
      console.debug('[refresh] incoming request (cookies/headers unavailable)')
    }
    await connectDB()

    // If a refresh cookie exists, validate + rotate
    const cookie = request.cookies.get('refreshToken')
    if (cookie) {
      const refreshPlain = cookie.value
      const refreshHash = crypto.createHash('sha256').update(refreshPlain).digest('hex')

      let stored = await RefreshToken.findOne({ tokenHash: refreshHash, revoked: false })
      // If there is a session cookie, validate the session too
      const sessionCookie = request.cookies.get('sessionId')
      if (sessionCookie) {
        const sessionHash = crypto.createHash('sha256').update(sessionCookie.value).digest('hex')
        const session = await Session.findOne({ sessionHash, revoked: false })
        if (!session) {
          return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
        }
        // update lastUsed
        session.lastUsedAt = new Date()
        await session.save()
      }
      if (!stored) {
        // Possible stale cookie: try to recover using NextAuth server token (user is signed in)
        try {
          const tokenFallback = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET })
          if (tokenFallback) {
            const userIdFallback = tokenFallback.id || tokenFallback.sub
            if (userIdFallback) {
              // create a fresh refresh token for this user and proceed
              const userFallback = await User.findById(userIdFallback)
              if (userFallback) {
                const fallbackPlain = crypto.randomBytes(64).toString('hex')
                const fallbackHash = crypto.createHash('sha256').update(fallbackPlain).digest('hex')
                const fallbackExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                let createdFallback
                try {
                  createdFallback = await RefreshToken.create({ tokenHash: fallbackHash, user: userFallback._id, expiresAt: fallbackExpires })
                  console.debug('Refresh token created (fallback for stale cookie):', { id: createdFallback._id?.toString?.(), user: userFallback._id?.toString?.() })
                  // If session cookie provided, link createdFallback to session
                  const sessionCookie2 = request.cookies.get('sessionId')
                  if (sessionCookie2) {
                    const sessionHash2 = crypto.createHash('sha256').update(sessionCookie2.value).digest('hex')
                    await Session.findOneAndUpdate({ sessionHash: sessionHash2 }, { refreshToken: createdFallback._id })
                  }
                } catch (createErr) {
                  console.error('Refresh create (fallback) failed:', createErr)
                  // If Mongo validation error, print errInfo for debugging
                  if ((createErr as any).errInfo) {
                    try {
                      console.error('errInfo:', JSON.stringify((createErr as any).errInfo, null, 2))
                    } catch (e) {
                      console.error('errInfo (raw):', (createErr as any).errInfo)
                    }
                  }
                  console.error('Attempted fallback document:', { tokenHash: fallbackHash, user: userFallback._id?.toString?.(), expiresAt: fallbackExpires })
                  return NextResponse.json({ success: false, error: 'Could not create refresh token (fallback)' }, { status: 500 })
                }
                // set cookie and return access token
                const accessTokenFallback = jwt.sign({ userId: userFallback._id, email: userFallback.email, role: userFallback.role }, process.env.NEXTAUTH_SECRET!, { expiresIn: '15m' })
                const resp = NextResponse.json({ success: true, accessToken: accessTokenFallback })
                resp.cookies.set('refreshToken', fallbackPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/api/auth' })
                return resp
              }
            }
          }
        } catch (e) {
          console.error('Fallback getToken error:', e)
        }

        return NextResponse.json({ success: false, error: 'Invalid refresh token' }, { status: 401 })
      }

      if (stored.expiresAt < new Date()) {
        return NextResponse.json({ success: false, error: 'Refresh token expired' }, { status: 401 })
      }

      // Load user
      const user = await User.findById(stored.user)
      if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

      // Rotate refresh token: create new one, mark old as revoked
      const newRefreshPlain = crypto.randomBytes(64).toString('hex')
      const newRefreshHash = crypto.createHash('sha256').update(newRefreshPlain).digest('hex')
      const newExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  stored.revoked = true
  await stored.save()
      let createdNew
      try {
        createdNew = await RefreshToken.create({ tokenHash: newRefreshHash, user: user._id, expiresAt: newExpires })
        console.debug('Refresh token rotated:', { oldId: stored._id?.toString?.(), newId: createdNew._id?.toString?.(), user: user._id?.toString?.() })
        // If session cookie provided, associate new refresh token with session
        const sessionCookie3 = request.cookies.get('sessionId')
        if (sessionCookie3) {
          const sessionHash3 = crypto.createHash('sha256').update(sessionCookie3.value).digest('hex')
          await Session.findOneAndUpdate({ sessionHash: sessionHash3 }, { refreshToken: createdNew._id, lastUsedAt: new Date() })
        } else {
          // No session cookie: create a new session and set cookie so sessions collection records this user
          try {
            const sessionIdPlainNew = crypto.randomBytes(32).toString('hex')
            const sessionHashNew = crypto.createHash('sha256').update(sessionIdPlainNew).digest('hex')
            const sessionExpiresNew = newExpires
            const sessionDocNew = await Session.create({ sessionHash: sessionHashNew, user: user._id, refreshToken: createdNew._id, expiresAt: sessionExpiresNew })
            console.debug('Session created (rotate no-cookie):', { id: sessionDocNew._id?.toString?.(), user: user._id?.toString?.() })
            // attach session cookie to response below by setting a flag on createdNew
            ;(createdNew as any).__sessionIdPlain = sessionIdPlainNew
          } catch (sessionCreateErr) {
            console.error('Session create (rotate no-cookie) failed:', sessionCreateErr)
          }
        }
      } catch (createErr) {
        console.error('Refresh create (rotate) failed:', createErr)
        if ((createErr as any).errInfo) {
          try { console.error('errInfo:', JSON.stringify((createErr as any).errInfo, null, 2)) } catch(e) { console.error('errInfo (raw):', (createErr as any).errInfo) }
        }
        console.error('Attempted rotate document:', { tokenHash: newRefreshHash, user: user._id?.toString?.(), expiresAt: newExpires })
        return NextResponse.json({ success: false, error: 'Could not create refreshed token' }, { status: 500 })
      }

      // Issue new access token
      const accessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.NEXTAUTH_SECRET!, { expiresIn: '15m' })

      const response = NextResponse.json({ success: true, accessToken })
      response.cookies.set('refreshToken', newRefreshPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/api/auth' })
      // If we created a session in the rotate branch without a cookie, attach it to the response
      try {
        if ((createdNew as any).__sessionIdPlain) {
          response.cookies.set('sessionId', (createdNew as any).__sessionIdPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' })
        }
      } catch (e) {
        // ignore
      }

      return response
    }

    // No cookie: try to issue initial refresh using NextAuth server-side token (after signIn)
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })

    const userId = token.id || token.sub
    if (!userId) return NextResponse.json({ success: false, error: 'User id missing in token' }, { status: 400 })

    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    // create refresh token
    const refreshPlain = crypto.randomBytes(64).toString('hex')
    const refreshHash = crypto.createHash('sha256').update(refreshPlain).digest('hex')
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    let created
    try {
      created = await RefreshToken.create({ tokenHash: refreshHash, user: user._id, expiresAt: refreshExpires })
      console.debug('Refresh token created (initial):', { id: created._id?.toString?.(), user: user._id?.toString?.() })
      // Create a server session for this initial issuance and link it to the refresh token
      try {
        const sessionIdPlain = crypto.randomBytes(32).toString('hex')
        const sessionHash = crypto.createHash('sha256').update(sessionIdPlain).digest('hex')
        const sessionExpires = refreshExpires
        const sessionDoc = await Session.create({ sessionHash, user: user._id, refreshToken: created._id, expiresAt: sessionExpires })
        console.debug('Session created (initial):', { id: sessionDoc._id?.toString?.(), user: user._id?.toString?.() })
        // set sessionId cookie
        // Note: we set cookie on the response below; attach here via a temporary response and then return below
        const resp = NextResponse.json({ success: true, accessToken: jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.NEXTAUTH_SECRET!, { expiresIn: '15m' }) })
        resp.cookies.set('refreshToken', refreshPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/api/auth' })
        resp.cookies.set('sessionId', sessionIdPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' })
        return resp
      } catch (sessionErr) {
        console.error('Session create (initial) failed:', sessionErr)
        // If session creation failed, still return the refresh token cookie so client can continue
        const respFallback = NextResponse.json({ success: true, accessToken: jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.NEXTAUTH_SECRET!, { expiresIn: '15m' }) })
        respFallback.cookies.set('refreshToken', refreshPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/api/auth' })
        return respFallback
      }
    } catch (createErr) {
      console.error('Refresh create (initial) failed:', createErr)
      if ((createErr as any).errInfo) {
        try { console.error('errInfo:', JSON.stringify((createErr as any).errInfo, null, 2)) } catch(e) { console.error('errInfo (raw):', (createErr as any).errInfo) }
      }
      console.error('Attempted initial document:', { tokenHash: refreshHash, user: user._id?.toString?.(), expiresAt: refreshExpires })
      return NextResponse.json({ success: false, error: 'Could not create refresh token' }, { status: 500 })
    }

    // Create short-lived access token (15m)
    const accessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.NEXTAUTH_SECRET!, { expiresIn: '15m' })

    const response = NextResponse.json({ success: true, accessToken })
    response.cookies.set('refreshToken', refreshPlain, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/api/auth' })

    return response
  } catch (error) {
    console.error('Refresh error:', error)
    return NextResponse.json({ success: false, error: 'Refresh token sırasında hata oluştu' }, { status: 500 })
  }
}
