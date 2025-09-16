'use client'

import { useCart } from '@/contexts/CartContext'
import { ToastManager } from './Toast'

export function ToastContainer() {
  const { toasts, removeToast } = useCart()

  return <ToastManager toasts={toasts} onRemoveToast={removeToast} />
}