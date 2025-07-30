"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth-context'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isAuthenticated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Load cart from localStorage on mount
    if (isAuthenticated && user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`)
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart))
        } catch (error) {
          console.error('Error parsing stored cart:', error)
          localStorage.removeItem(`cart_${user.id}`)
        }
      }
    } else {
      // Clear cart when user logs out
      setItems([])
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    // Save cart to localStorage whenever items change
    if (isAuthenticated && user && items.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items))
    } else if (isAuthenticated && user && items.length === 0) {
      localStorage.removeItem(`cart_${user.id}`)
    }
  }, [items, isAuthenticated, user])

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart')
      return
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 