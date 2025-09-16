'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  MapPin, 
  HelpCircle, 
  LogOut,
  ChevronRight 
} from 'lucide-react'

interface UserProfileDropdownProps {
  user: {
    name: string
    email: string
    avatar?: string
    membershipLevel?: string
  }
  onLogout: () => void
}

export function UserProfileDropdown({ user, onLogout }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: User, label: 'Kullanıcı Bilgilerim', href: '/profile' },
    { icon: ShoppingBag, label: 'Siparişlerim', href: '/orders', badge: '3' },
    { icon: Heart, label: 'İndirim Kuponlarım', href: '/coupons' },
    { icon: CreditCard, label: 'Krediler', href: '/credits', badge: 'Yeni' },
    { icon: Settings, label: 'Şanslı Çekilişler', href: '/lottery', badge: 'YENİ' },
    { icon: MapPin, label: 'Adres Bilgilerim', href: '/addresses' },
    { icon: HelpCircle, label: 'Yardım', href: '/help' },
  ]

  const handleItemClick = (href: string) => {
    // Bu kısımda sayfa yönlendirme yapılacak
    console.log('Navigating to:', href)
    setIsOpen(false)
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* User Icon Trigger */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-gray-600" />
        )}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50"
          >
            {/* User Info Header */}
            <div className="px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  {user.membershipLevel && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-yellow-600 font-medium">
                        {user.membershipLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleItemClick(item.href)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                      <item.icon className="h-4 w-4 text-gray-600 group-hover:text-yellow-600 transition-colors" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.badge === 'YENİ' || item.badge === 'Yeni'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Logout Section */}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <motion.button
                onClick={onLogout}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-red-50 transition-colors group"
                whileHover={{ backgroundColor: '#fef2f2' }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LogOut className="h-4 w-4 text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-red-600">
                  Çıkış Yap
                </span>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="px-4 pt-3 mt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Trendyol Plus</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-medium">
                  Ücretsiz
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}