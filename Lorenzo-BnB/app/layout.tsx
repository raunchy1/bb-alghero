import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
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
    default: 'Il B&B di Lorenzo — Exclusive Rooms | Alghero, Sardegna',
    template: '%s · Il B&B di Lorenzo',
  },
  description:
    'Scopri Il B&B di Lorenzo, camera esclusiva nel cuore di Alghero, Sardegna. Design raffinato, comfort assoluto e ospitalità autentica per un soggiorno indimenticabile.',
  keywords: [
    'Alghero',
    'Sardegna',
    'B&B',
    'luxury room',
    'exclusive rooms',
    'Il B&B di Lorenzo',
    'camera di lusso',
    'bed and breakfast Alghero',
  ],
  openGraph: {
    title: 'Il B&B di Lorenzo — Exclusive Rooms | Alghero, Sardegna',
    description:
      'Camera esclusiva nel cuore di Alghero. Design raffinato, comfort assoluto e ospitalità autentica.',
    type: 'website',
    locale: 'it_IT',
    siteName: 'Il B&B di Lorenzo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Il B&B di Lorenzo — Exclusive Rooms | Alghero, Sardegna',
    description:
      'Camera esclusiva nel cuore di Alghero. Design raffinato, comfort assoluto.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${cormorant.variable} ${jost.variable}`}>
      <body className={`${jost.className} bg-cream antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
