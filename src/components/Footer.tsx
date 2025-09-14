'use client'

import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Send, Heart } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20V0c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-600">
                Luxe Jewelry
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Zamanın ışığında parlayan, el yapımı mücevherler ile stilinizi tamamlayın. 
              Her parça özenle seçilmiş ve ustalıkla işlenmiştir.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-yellow-600 p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-yellow-600 p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-yellow-600 p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg text-white font-semibold">Hızlı Linkler</h4>
            <ul className="space-y-3 text-sm">
              {['Ana Sayfa', 'Koleksiyonlar', 'Özel Tasarım', 'Kampanyalar', 'Hakkımızda'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white hover:text-yellow-400 transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg text-white font-semibold">Müşteri Hizmetleri</h4>
            <ul className="space-y-3 text-sm">
              {['İletişim', 'Kargo & Teslimat', 'İade & Değişim', 'Garanti', 'SSS'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white hover:text-yellow-400 transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg text-white font-semibold">İletişim</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300">
                <Phone className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 group-hover:text-white transition-colors">+90 212 555 0123</span>
              </div>
              <div className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300">
                <Mail className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 group-hover:text-white transition-colors">info@luxejewelry.com</span>
              </div>
              <div className="flex items-start space-x-3 group hover:translate-x-2 transition-transform duration-300">
                <MapPin className="h-4 w-4 text-yellow-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  İstanbul, Türkiye<br />Nişantaşı Mahallesi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-xl text-white mb-2 font-semibold">
              Yeni Koleksiyonlardan Haberdar Olun
            </h4>
            <p className="text-gray-400 text-sm mb-6">
              Özel indirimler ve yeni ürünler hakkında ilk siz haberdar olun
            </p>
            
            {isSubscribed ? (
              <div className="bg-green-600/20 border border-green-500 rounded-lg p-4 text-green-400">
                ✨ Başarıyla abone oldunuz! Teşekkürler.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Mutlu Müşteri' },
              { number: '500+', label: 'Benzersiz Ürün' },
              { number: '15+', label: 'Yıllık Deneyim' },
              { number: '99%', label: 'Memnuniyet' }
            ].map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-400 transition-colors duration-300 group-hover:scale-110 transform">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 Luxe Jewelry. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Made with <Heart className="w-3 h-3 inline text-red-500 animate-pulse" /> in Turkey
          </p>
        </div>
      </div>
    </footer>
  )
}
