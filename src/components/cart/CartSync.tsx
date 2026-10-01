'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useCartStore } from '@/store/cart'
import { fetchUserCart, saveUserCart } from '@/app/actions/cartSync'

export function CartSync() {
  const { userId } = useAuth()
  const { items, setItems } = useCartStore()
  const isInitialMount = useRef(true)
  const lastSavedJson = useRef('')

  // On login/mount: Fetch remote cart, merge with local, and save
  useEffect(() => {
    if (!userId) return

    async function initSync() {
      const dbItems = await fetchUserCart()
      const localItems = useCartStore.getState().items

      if (dbItems && dbItems.length > 0) {
        // Merge DB items into Local items
        const merged = [...dbItems]
        localItems.forEach(localItem => {
          const existing = merged.find(
            m => m.productId === localItem.productId && m.size === localItem.size && m.color === localItem.color
          )
          if (existing) {
            existing.quantity = Math.max(existing.quantity, localItem.quantity)
          } else {
            merged.push(localItem)
          }
        })

        useCartStore.getState().setItems(merged)
        lastSavedJson.current = JSON.stringify(merged)

        // If local had things not in DB, sync it up
        if (JSON.stringify(dbItems) !== JSON.stringify(merged)) {
          saveUserCart(merged)
        }
      } else if (localItems.length > 0) {
        // DB is empty, push local to DB
        saveUserCart(localItems)
        lastSavedJson.current = JSON.stringify(localItems)
      } else {
        // Both empty
        lastSavedJson.current = '[]'
      }
    }

    initSync()
  }, [userId])

  // Watch for local cart changes and push to DB if logged in
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (!userId) return

    const currentJson = JSON.stringify(items)
    if (currentJson !== lastSavedJson.current) {
      lastSavedJson.current = currentJson
      
      // Debounce saving to prevent spamming the DB on fast clicks
      const timeout = setTimeout(() => {
        saveUserCart(items)
      }, 1000)
      
      return () => clearTimeout(timeout)
    }
  }, [items, userId])

  return null
}
