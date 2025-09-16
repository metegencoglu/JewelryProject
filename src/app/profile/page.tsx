'use client'

import { UserProfile } from '@/components/UserProfile'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home':
        router.push('/')
        break
      case 'login':
        router.push('/auth/login')
        break
      default:
        router.push('/')
    }
  }

  return <UserProfile onNavigate={handleNavigate} />
}