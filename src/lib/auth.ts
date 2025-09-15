import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import connectDB from '@/actions/db'

export const authOptions: NextAuthOptions = {
  // JWT strategy kullanıyoruz - adapter gereksiz
  // adapter: MongoDBAdapter(clientPromise), // Kaldırıldı
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email ve şifre gerekli')
          }

          await connectDB()
          
          // Kullanıcı kontrolü
          const user = await User.findOne({ 
            email: credentials.email, 
            isActive: true 
          })
          
          if (!user) {
            throw new Error('Geçersiz email veya şifre')
          }

          // Şifre kontrolü
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            user.password
          )
          
          if (!isValidPassword) {
            throw new Error('Geçersiz email veya şifre')
          }

          // Last login güncelle
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

          // NextAuth için user object return et
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profile?.avatar || null,
          }
        } catch (error: any) {
          console.error('Auth error:', error)
          throw new Error(error.message || 'Giriş sırasında hata oluştu')
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 gün
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 gün
  },

  callbacks: {
    async jwt({ token, user }) {
      // İlk giriş - user bilgilerini token'a ekle
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      // Session'a user bilgilerini ekle
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Çıkış sonrası ana sayfaya yönlendir
      if (url.includes('/auth/signout')) {
        return baseUrl + '/'
      }
      
      // Giriş sonrası yönlendirme
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/', // Ana sayfaya yönlendir
    error: '/auth/login',
    // Admin yönlendirmesi için custom page
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('✅ NextAuth SignIn:', user.email)
    },
    async signOut({ session, token }) {
      console.log('👋 NextAuth SignOut:', session?.user?.email || token?.email)
    },
  },

  // Güvenlik ayarları
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  
  // Güvenlik headers
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}