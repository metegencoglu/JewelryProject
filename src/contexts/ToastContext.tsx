'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useToast, ToastContainer, ToastData } from '@/components/ui/toast'

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastUtils = useToast()

  return (
    <ToastContext.Provider value={toastUtils}>
      {children}
      <ToastContainer toasts={toastUtils.toasts} onClose={toastUtils.hideToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}