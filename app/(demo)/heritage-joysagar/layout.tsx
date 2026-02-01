import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './restaurant-styles.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heritage Jaysagar | Premium Lakeside Dining in Sivasagar, Assam',
  description: 'Experience serene lakeside dining at Heritage Jaysagar. Authentic Assamese cuisine in a heritage-inspired setting with scenic views.',
  keywords: 'Heritage Jaysagar, Sivasagar restaurant, lakeside dining, Assamese cuisine, fine dining Assam',
  openGraph: {
    title: 'Heritage Jaysagar | Premium Lakeside Dining',
    description: 'Experience serene lakeside dining at Heritage Jaysagar',
    type: 'website',
    locale: 'en_IN',
  },
  metadataBase: new URL('http://localhost:3000'),
}

export default function RestaurantRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="restaurant-theme">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} restaurant-scrollbar min-h-screen`}>
        {/* This is a completely separate layout - no portfolio components here */}
        {/* The restaurant Header will be at the top of the page content */}
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}