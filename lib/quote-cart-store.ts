import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from './types'

export interface QuoteCartItem {
    product: Product
    quantity: number
    notes?: string
    price?: number
}

interface QuoteCartState {
    items: QuoteCartItem[]
    isOpen: boolean
    addItem: (product: Product, quantity?: number, notes?: string) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    updateNotes: (productId: string, notes: string) => void
    clearCart: () => void
    openCart: () => void
    closeCart: () => void
    getTotalItems: () => number
    getTotalValue: () => number
}

export const useQuoteCartStore = create<QuoteCartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product: Product, quantity = 1, notes = '') => {
                set((state) => {
                    const existingItem = state.items.find(item => item.product.id === product.id)

                    if (existingItem) {
                        // Update existing item
                        return {
                            items: state.items.map(item =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                                    : item
                            )
                        }
                    } else {
                        // Add new item
                        return {
                            items: [...state.items, { product, quantity, notes }]
                        }
                    }
                })
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter(item => item.product.id !== productId)
                }))
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set((state) => ({
                    items: state.items.map(item =>
                        item.product.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                }))
            },

            updateNotes: (productId: string, notes: string) => {
                set((state) => ({
                    items: state.items.map(item =>
                        item.product.id === productId
                            ? { ...item, notes }
                            : item
                    )
                }))
            },

            clearCart: () => {
                set({ items: [] })
            },

            openCart: () => {
                set({ isOpen: true })
            },

            closeCart: () => {
                set({ isOpen: false })
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },

            getTotalValue: () => {
                return get().items.reduce((total, item) => {
                    const price = item.product.default_price || 0
                    return total + (price * item.quantity)
                }, 0)
            }
        }),
        {
            name: 'quote-cart-storage',
            partialize: (state) => ({ items: state.items })
        }
    )
) 