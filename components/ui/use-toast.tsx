import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  title: string
  description: string
  type?: ToastType
}

interface ToastState extends ToastProps {
  id: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = useCallback(({ title, description, type = 'info' }: ToastProps) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now(), title, description, type },
    ])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { toast, toasts, dismissToast }
}

// ... existing code ...
