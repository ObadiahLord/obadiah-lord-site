import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['200', '300', '400', '500', '600'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Obadiah Lord. Founder, AXIS LABS.',
  description: 'Architecting Axle, the proactive AI agent for Android. Founder and CEO of AXIS LABS.',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/favicon-512.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MC4E7ZBF8D" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MC4E7ZBF8D');
        `}</Script>
      </body>
    </html>
  )
}
