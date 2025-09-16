export async function refreshAccessToken() {
  try {
    const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
      return data.accessToken
    }
    return null
  } catch (e) {
    console.error('refreshAccessToken error', e)
    return null
  }
}

export function getAccessToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
}

export function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = getAccessToken()
  const headers = new Headers(init?.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(input, { ...init, headers })
}

export async function logout(nextAuthSignOut: () => Promise<void>) {
  try {
    // Revoke refresh token & sessions server-side and clear cookies
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  } catch (e) {
    console.error('logout revoke error', e)
  }

  // Clear access token locally
  if (typeof window !== 'undefined') localStorage.removeItem('accessToken')

  // Call NextAuth signOut if provided
  if (nextAuthSignOut) await nextAuthSignOut()
}
