"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ShoppingBag, User, Menu, Heart, Settings, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import type { Page, Category } from '../types'

interface HeaderProps {
  onNavigate?: (page: Page, category?: Category) => void
  currentPage?: Page
  isAdmin?: boolean
}

export function Header({ onNavigate, currentPage = 'home', isAdmin = false }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  const navigation = [
    { name: 'Ana Sayfa', href: '/', action: () => onNavigate?.('home') },
    { name: 'Koleksiyonlar', href: '/category/collections', action: () => onNavigate?.('category', 'collections') },
    { name: 'Yüzükler', href: '/category/rings', action: () => onNavigate?.('category', 'rings') },
    { name: 'Kolyeler', href: '/category/necklaces', action: () => onNavigate?.('category', 'necklaces') },
    { name: 'Küpeler', href: '/category/earrings', action: () => onNavigate?.('category', 'earrings') },
    { name: 'Bilezikler', href: '/category/bracelets', action: () => onNavigate?.('category', 'bracelets') },
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
          <div className="flex items-center space-x-2">
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

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShoppingBag className="h-5 w-5" />
                </motion.div>
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
                  3
                </motion.span>
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
