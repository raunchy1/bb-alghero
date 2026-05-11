import type { Metadata } from 'next'
import { Cormorant, Figtree } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const cormorant = Cormorant({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const figtree = Figtree({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
})

export const metadata: Metadata = {
  title: {
    default: 'La Suite N4 Alghero — Camere Esclusive | Alghero, Sardegna',
    template: '%s · La Suite N4 Alghero',
  },
  description:
    'Scopri La Suite N4 Alghero, camere esclusive nel cuore di Alghero, Sardegna. Design raffinato, comfort assoluto e ospitalità autentica per un soggiorno indimenticabile.',
  keywords: [
    'Alghero', 'Sardegna', 'B&B', 'luxury room', 'exclusive rooms',
    'La Suite N4 Alghero', 'camera di lusso', 'bed and breakfast Alghero',
    'suite alghero', 'camere alghero centro', 'dove dormire alghero',
  ],
  authors: [{ name: 'La Suite N4 Alghero' }],
  creator: 'La Suite N4 Alghero',
  publisher: 'La Suite N4 Alghero',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  metadataBase: new URL('https://lasuiten4.it'),
  alternates: {
    canonical: '/',
    languages: {
      'it': '/',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'La Suite N4 Alghero — Camere Esclusive | Alghero, Sardegna',
    description: 'Camere esclusive nel cuore di Alghero. Design raffinato, comfort assoluto e ospitalità autentica.',
    type: 'website',
    locale: 'it_IT',
    siteName: 'La Suite N4 Alghero',
    url: 'https://lasuiten4.it',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'La Suite N4 Alghero - Camere esclusive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Suite N4 Alghero — Camere Esclusive | Alghero, Sardegna',
    description: 'Camere esclusive nel cuore di Alghero. Design raffinato, comfort assoluto.',
    images: ['/images/og-image.jpg'],
    creator: '@lasuiten4',
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'msapplication-TileColor': 'oklch(22% 0.01 75)',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport = {
  themeColor: 'oklch(97% 0.008 75)',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${figtree.variable}`}>
      <head>
        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="La Suite N4" />
        
        {/* iOS Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167x167.png" />
        
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1170-2532.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1284-2778.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        
        {/* Android PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="La Suite N4" />
        <meta name="msapplication-TileColor" content="oklch(22% 0.01 75)" />
        <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical fonts — no local woff2 preloaded; next/font handles it */}
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        
        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${figtree.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
