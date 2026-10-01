import CheckoutClient from './CheckoutClient'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Checkout — The Jeweller's Hub",
}

export default async function CheckoutPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in?redirect_url=/checkout')
  }

  return <CheckoutClient />
}
