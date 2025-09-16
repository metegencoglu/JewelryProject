"use client";

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ShoppingBag, User, Menu, Heart, Settings, Sparkles, ChevronDown, Package, CreditCard, HelpCircle, LogOut, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { logout as clientLogout } from '@/lib/authClient'
import type { Page, Category } from '../types'
import { useCart } from '@/contexts/CartContext'

interface HeaderProps {
  onNavigate?: (page: Page, category?: Category) => void
  currentPage?: Page
  isAdmin?: boolean
}

export function Header({ onNavigate, currentPage = 'home', isAdmin = false }: HeaderProps) {
  const { data: session, status } = useSession()
  const [showWelcome, setShowWelcome] = useState(false)

  // Show welcome bubble briefly when user becomes authenticated
  useState(() => {
    // noop to keep top-level hook order
  })

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null
    if (status === 'authenticated') {
      setShowWelcome(true)
      t = setTimeout(() => setShowWelcome(false), 3000)
    }
    return () => {
      if (t) clearTimeout(t)
    }
  }, [status])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { state, toggleCart } = useCart()

  const navigation = [
    { name: 'Ana Sayfa', href: '/', action: () => onNavigate?.('home') },
    { name: 'Koleksiyonlar', href: '/kategori/koleksiyonlar', action: () => onNavigate?.('category', 'koleksiyonlar') },
    { name: 'Yüzükler', href: '/kategori/yuzukler', action: () => onNavigate?.('category', 'yuzukler') },
    { name: 'Kolyeler', href: '/kategori/kolyeler', action: () => onNavigate?.('category', 'kolyeler') },
    { name: 'Küpeler', href: '/kategori/kupeler', action: () => onNavigate?.('category', 'kupeler') },
    { name: 'Bilezikler', href: '/kategori/bilezikler', action: () => onNavigate?.('category', 'bilezikler') },
    { name: 'Alyanslar', href: '/kategori/alyanslar', action: () => onNavigate?.('category', 'alyanslar') },
  ]

  const handleNavClick = (item: typeof navigation[0]) => {
    if (onNavigate) {
      item.action()
    }
  }

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-xl shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              href="/"
              className="flex items-center space-x-2 group"
              onClick={() => onNavigate?.('home')}
            >
              <motion.div
                className="text-2xl font-bold tracking-tight text-yellow-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Luxe Jewelry
              </motion.div>
              <motion.div
                className="text-yellow-600"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.div key={item.name}>
                {onNavigate ? (
                  <button
                    onClick={() => handleNavClick(item)}
                    className="relative text-sm text-gray-600 hover:text-yellow-600 transition-colors py-2"
                    onMouseEnter={() => setHoveredNav(item.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    {item.name}
                    {/* Animated underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-yellow-600"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredNav === item.name ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="relative text-sm text-gray-600 hover:text-yellow-600 transition-colors py-2"
                    onMouseEnter={() => setHoveredNav(item.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    {item.name}
                    {/* Animated underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-yellow-600"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredNav === item.name ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                )}
                {/* Hover glow effect */}
                {hoveredNav === item.name && (
                  <motion.div
                    className="absolute inset-0 bg-yellow-50 rounded-lg -z-10"
                    layoutId="navHover"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden sm:flex hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
              >
                <motion.div
                  animate={isSearchOpen ? { rotate: 90 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex hover:bg-yellow-50 hover:text-yellow-600 transition-colors relative group"
              >
                <Heart className="h-5 w-5" />
                <motion.div
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </motion.div>

            {/* Admin Panel (Only visible for site owner) */}
            {isAdmin && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link href="/admin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hidden sm:flex text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors"
                  >
                    <motion.div
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Settings className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* User */}
            {status !== 'authenticated' && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-gray-50 hover:text-gray-700 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* User Profile Dropdown */}
            {status === 'authenticated' && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  onHoverStart={() => setIsProfileDropdownOpen(true)}
                  onHoverEnd={() => setIsProfileDropdownOpen(false)}
                  className="relative"
                >
                  {/* Profile Button */}
                  <motion.button
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 hover:from-yellow-100 hover:to-amber-100 transition-all duration-300 hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-yellow-600 to-amber-600 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-medium text-gray-900 truncate max-w-20">
                        {session?.user?.name || 'Kullanıcı'}
                      </p>
                      <p className="text-[10px] text-gray-500">Hoşgeldiniz</p>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* User Info Header */}
                        <div className="px-3 py-2.5 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-600 to-amber-600 flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name || 'Kullanıcı'}</p>
                              <p className="text-xs text-gray-600 truncate">{session?.user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <Package className="h-3.5 w-3.5 text-gray-600 group-hover:text-yellow-600" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">Tüm Siparişlerim</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <Heart className="h-3.5 w-3.5 text-gray-600 group-hover:text-red-500" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">Değerlendirmelerim</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <CreditCard className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">Satıcı Mesajlarım</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <div className="flex items-center space-x-2.5">
                              <Gift className="h-3.5 w-3.5 text-gray-600 group-hover:text-purple-600" />
                              <span className="text-xs text-gray-700 group-hover:text-gray-900">Krediler</span>
                            </div>
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">90 Fark Fırsatı</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <div className="flex items-center space-x-2.5">
                              <Sparkles className="h-3.5 w-3.5 text-gray-600 group-hover:text-yellow-600" />
                              <span className="text-xs text-gray-700 group-hover:text-gray-900">Şanslı Çekiliş</span>
                            </div>
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">YENİ</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <Gift className="h-3.5 w-3.5 text-gray-600 group-hover:text-orange-600" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">İndirim Kuponlarım</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <div className="flex items-center space-x-2.5">
                              <Heart className="h-3.5 w-3.5 text-gray-600 group-hover:text-red-500" />
                              <span className="text-xs text-gray-700 group-hover:text-gray-900">Trendyol Plus</span>
                            </div>
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">YENİ</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <Sparkles className="h-3.5 w-3.5 text-gray-600 group-hover:text-purple-600" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">Trendyol Elite</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">Trendyol Asistan</span>
                          </motion.button>

                          <motion.button
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                            whileHover={{ x: 3 }}
                          >
                            <Package className="h-3.5 w-3.5 text-gray-600 group-hover:text-green-600" />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">Çıkış Yap</span>
                          </motion.button>

                          <Link href="/profile" className="block">
                            <motion.button
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-gray-50 transition-colors group"
                              whileHover={{ x: 3 }}
                            >
                              <User className="h-3.5 w-3.5 text-gray-600 group-hover:text-blue-600" />
                              <span className="text-xs text-gray-700 group-hover:text-gray-900">Kullanıcı Bilgilerim</span>
                            </motion.button>
                          </Link>

                          {/* Divider */}
                          <div className="border-t border-gray-100 my-1"></div>

                          {/* Logout Button */}
                          <motion.button
                            onClick={async () => {
                              try {
                                await clientLogout(() => signOut({ callbackUrl: '/auth/login' }))
                              } catch (e) {
                                await signOut({ callbackUrl: '/auth/login' })
                              }
                            }}
                            className="w-full px-3 py-2 flex items-center space-x-2.5 hover:bg-red-50 transition-colors group text-left"
                            whileHover={{ x: 3 }}
                          >
                            <LogOut className="h-3.5 w-3.5 text-gray-600 group-hover:text-red-600" />
                            <span className="text-xs text-gray-700 group-hover:text-red-600">Çıkış Yap</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleCart}
                className="relative hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShoppingBag className="h-5 w-5" />
                </motion.div>
                {state.totalItems > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-600 to-amber-600 text-xs text-white flex items-center justify-center"
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {state.totalItems}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-xl">
                <motion.nav 
                  className="flex flex-col space-y-4 mt-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, staggerChildren: 0.1 }}
                >
                  {navigation.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className="text-lg text-gray-600 hover:text-yellow-600 transition-colors py-3 text-left px-4 rounded-lg hover:bg-yellow-50"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.button
                        className="text-lg text-orange-600 hover:text-orange-700 transition-colors py-3 text-left flex items-center gap-2 px-4 rounded-lg hover:bg-orange-50 w-full"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navigation.length * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <Settings className="h-5 w-5" />
                        Admin Panel
                      </motion.button>
                    </Link>
                  )}
                </motion.nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* Welcome bubble (top-right) */}
        <div className="pointer-events-none">
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="fixed right-6 top-4 z-50 pointer-events-auto"
              >
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-2 rounded-full shadow-sm flex items-center space-x-3">
                  <span className="text-sm">Hoşgeldiniz,</span>
                  <span className="text-sm font-semibold">{session?.user?.name || session?.user?.email}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              className="py-4 border-t border-yellow-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="relative"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <motion.input
                  type="text"
                  placeholder="Mücevher ara..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 }}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar for page loading (cosmetic) */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-yellow-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.header>
  )
}
