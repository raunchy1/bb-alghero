import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const jost = Jost({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
})

export const metadata: Metadata = {
  title: {
    default: 'La Suite N4 Alghero — Exclusive Rooms | Alghero, Sardegna',
    template: '%s · La Suite N4 Alghero',
  },
  description:
    'Scopri La Suite N4 Alghero, camere esclusive nel cuore di Alghero, Sardegna. Design raffinato, comfort assoluto e ospitalità autentica per un soggiorno indimenticabile.',
  keywords: [
    'Alghero', 'Sardegna', 'B&B', 'luxury room', 'exclusive rooms',
    'La Suite N4 Alghero', 'camera di lusso', 'bed and breakfast Alghero',
  ],
  openGraph: {
    title: 'La Suite N4 Alghero — Exclusive Rooms | Alghero, Sardegna',
    description: 'Camere esclusive nel cuore di Alghero. Design raffinato, comfort assoluto e ospitalità autentica.',
    type: 'website',
    locale: 'it_IT',
    siteName: 'La Suite N4 Alghero',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Suite N4 Alghero — Exclusive Rooms | Alghero, Sardegna',
    description: 'Camere esclusive nel cuore di Alghero. Design raffinato, comfort assoluto.',
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#1A2B3C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="La Suite N4" />
      </head>
      <body className={`${jost.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
