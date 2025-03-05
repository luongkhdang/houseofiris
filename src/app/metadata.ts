/**
 * QUALITY CHECK:
 * Strengths:
 * - Comprehensive metadata configuration following Next.js best practices
 * - Good use of TypeScript with proper typing from Next.js Metadata interface
 * - Well-organized structure with clear sections for different metadata categories
 * - Includes all essential metadata fields for SEO optimization
 * 
 * Recommendations:
 * - Replace placeholder values (e.g., "your-google-verification-code") with actual values
 * - Consider moving OpenGraph image URLs to environment variables or constants
 * - Add comments explaining the purpose of each section
 * - Include Twitter card metadata for better social media sharing
 * - Setup proper canonical URLs for SEO
 */

// src/app/metadata.ts
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'House of Iris and Tommy',
  description: 'Where we store our memories - Dang & Trieu',
  keywords: [
    'House of Iris and Tommy', 'Dang & Trieu', 'Memories',
    'Photos', 'Videos', 'Stickers', 'Love Letters', 'Date schedule'
  ],
  openGraph: {
    title: 'House of Iris and Tommy',
    description: 'Where we store our memories - Dang & Trieu',
    url: 'https://houseofiris.vercel.app',
    siteName: 'Your Website Name',
    images: [
      {
        url: 'https://your-website.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Your Website Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};
