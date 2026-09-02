import localFont from 'next/font/local'
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogMotion from '@/components/BlogMotion'

const brasika = localFont({
  src: './fonts/brasika-display-trial-v2.otf',
  variable: '--font-brasika',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kennedigroomingstudio.com'),
  title: {
    default: "Kennedi's Grooming Studio Blog",
    template: "%s | Kennedi's Grooming Studio",
  },
  description:
    "Pet care tips, grooming guidance, and stories from Kennedi's Grooming Studio in Fort Worth, TX.",
  alternates: { canonical: '/blog' },
  icons: { icon: '/blog/favicon.ico' },
  openGraph: {
    type: 'website',
    siteName: "Kennedi's Grooming Studio",
    images: [{ url: '/blog/og-image.jpg', width: 1200, height: 630, alt: "Kennedi's Grooming Studio" }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/blog/og-image.jpg'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={brasika.variable}>
      <body>
        <Navbar />
        <BlogMotion />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
