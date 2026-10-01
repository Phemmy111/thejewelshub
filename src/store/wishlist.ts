import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  name: string
  priceKobo: number
  image?: string
  slug: string
}

interface WishlistStore {
  items: WishlistItem[]
  toggleItem: (item: WishlistItem) => void
  hasItem: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => set((state) => {
        const exists = state.items.find(i => i.productId === item.productId)
        if (exists) {
          // Remove if it already exists
          return { items: state.items.filter(i => i.productId !== item.productId) }
        }
        // Add if it doesn't exist
        return { items: [...state.items, item] }
      }),
      hasItem: (productId) => get().items.some(i => i.productId === productId),
      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'thejewelshub-wishlist',
    }
  )
)
