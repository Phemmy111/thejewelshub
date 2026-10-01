import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "The Jeweller's Hub | Premium Accessories & Jewellery in Nigeria",
    template: "%s | The Jeweller's Hub",
  },
  description:
    "Shop premium jewellery, accessories, wristwatches, sunglasses and more. Fast delivery across Nigeria. Secure Paystack checkout.",
  keywords: ['jewellery', 'accessories', 'Nigeria', 'rings', 'earrings', 'bracelets', 'necklaces'],
  openGraph: {
    siteName: "The Jeweller's Hub",
    locale: 'en_NG',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const content = (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )

  return clerkKey ? <ClerkProvider>{content}</ClerkProvider> : content
}

