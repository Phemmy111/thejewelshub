'use client'

import { useCartStore } from '@/store/cart'

export function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCartStore()

  return (
    <button 
      onClick={() => addItem({
        productId: product.id,
        name: product.name,
        priceKobo: product.price_kobo,
        quantity: 1
      })}
      className="btn-cart" 
      style={{ width: '100%', padding: '1.25rem', backgroundColor: '#0D0D0D', color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
    >
      Add to Cart
    </button>
  )
}
