import { create } from "zustand"

interface CartState {
    cart: any[]
    addToCart: (product: any) => void
    removeFromCart: (product: any) => void
    clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
    removeFromCart: (product) => set((state) => ({ cart: state.cart.filter((p) => p.id !== product.id) })),
    clearCart: () => set({ cart: [] })
}))