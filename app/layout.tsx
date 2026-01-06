import type { Metadata } from "next";
import { Bricolage_Grotesque } from 'next/font/google';
import { Geist, Geist_Mono, } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';

import "./globals.css";

// 1. Configure the font
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'], // Essential: specify subsets
  display: 'swap', // Recommended: prevents FOIT (Flash of Invisible Text)
  // If you use Tailwind or CSS variables:
  variable: '--font-bricolage',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://cacmtz.vercel.app'),
  title: {
    default: "CAC Mount Zion Kingdom Zone Head Quarters",
    template: "%s | CAC Mount Zion",
  },
  description: "Welcome to Christ Apostolic Church Mount Zion Kingdom Zone Head Quarters, Ojodu. Join us for powerful worship, undiluted word of God, and spiritual growth.",
  keywords: ["CAC Mount Zion", "Kingdom Zone", "Head Quarters", "Ojodu", "Church", "Sermons", "Christian", "Worship", "Olowu", "CAC", "Christ Apostolic Church"],
  authors: [{ name: "CAC Mount Zion Media" }],
  creator: "CAC Mount Zion",
  publisher: "CAC Mount Zion",
  openGraph: {
    title: "CAC Mount Zion Kingdom Zone Head Quarters",
    description: "Welcome to Christ Apostolic Church Mount Zion Kingdom Zone Head Quarters. Raising Kingdom Giants.",
    url: 'https://cacmtz.vercel.app',
    siteName: 'CAC Mount Zion',
    locale: 'en_NG',
    type: 'website',

    images: [
      {
        url: 'https://cacmtz.vercel.app/src/img/brand/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'CAC Mount Zion Kingdom Zone Head Quarters Logo',
      },
    ],
    
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAC Mount Zion Kingdom Zone Head Quarters',
    description: 'Welcome to Christ Apostolic Church Mount Zion Kingdom Zone Head Quarters. Raising Kingdom Giants.',
    images: ['https://cacmtz.vercel.app/src/img/brand/logo.jpg'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
