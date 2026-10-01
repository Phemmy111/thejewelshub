import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  priceKobo: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setIsOpen: (isOpen: boolean) => void
  clearCart: () => void
  setItems: (items: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setItems: (items) => set({ items }),
      addItem: (item) => {
        const currentItems = get().items
        // Match on productId + size + color so each variant is a separate line item
        const existingItem = currentItems.find(
          i =>
            i.productId === item.productId &&
            (i.size ?? '') === (item.size ?? '') &&
            (i.color ?? '') === (item.color ?? ''),
        )

        if (existingItem) {
          set({
            items: currentItems.map(i =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i,
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [...currentItems, { ...item, id: crypto.randomUUID() }],
            isOpen: true,
          })
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set({ items: get().items.map(i => (i.id === id ? { ...i, quantity } : i)) })
      },
      setIsOpen: (isOpen) => set({ isOpen }),
      clearCart: () => set({ items: [], isOpen: false }),
    }),
    { name: 'thejewelshub-cart' },
  ),
)
