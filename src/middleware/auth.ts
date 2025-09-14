import jwt from 'jsonwebtoken'

export interface AdminUser {
  userId: string
  email: string
  role: 'admin' | 'user'
  name: string
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    
    if (decoded.role !== 'admin') {
      return null
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name || 'Admin'
    }
  } catch (error) {
    return null
  }
}

export function requireAdmin(req: Request): AdminUser {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Token gerekli')
  }
  
  const admin = verifyAdminToken(token)
  
  if (!admin) {
    throw new Error('Admin yetkisi gerekli')
  }
  
  return admin
}