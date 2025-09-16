'use client'

import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'

export function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, setCartOpen } = useCart()

  const handleCheckout = () => {
    alert('Ödeme sayfasına yönlendiriliyor...')
    // Burada ödeme sayfasına yönlendirme yapılabilir
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Sepetim ({state.totalItems})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCartOpen(false)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sepetiniz boş
              </h3>
              <p className="text-gray-500 mb-4">
                Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın
              </p>
              <Button
                onClick={() => setCartOpen(false)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Alışverişe Devam Et
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    {item.category && (
                      <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    )}
                    
                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-semibold text-gray-900">
                        ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0 border-gray-300 hover:border-yellow-400"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0 border-gray-300 hover:border-yellow-400"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Unit Price */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        Birim: ₺{item.price.toLocaleString('tr-TR')}
                      </span>
                      
                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {state.items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sepeti Temizle
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer - Total and Checkout */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Toplam ({state.totalItems} ürün)</p>
                <p className="text-xl font-bold text-gray-900">
                  ₺{state.totalPrice.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 text-lg font-semibold"
            >
              Ödeme Yap
            </Button>
            
            {/* Continue Shopping */}
            <Button
              variant="ghost"
              onClick={() => setCartOpen(false)}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Alışverişe Devam Et
            </Button>
          </div>
        )}
      </div>
    </>
  )
}