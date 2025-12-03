import type { Metadata } from "next";
import { Bricolage_Grotesque } from 'next/font/google';
import { Geist, Geist_Mono, } from "next/font/google";

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
  title: "Christ Apostolic Church Mount Zion Ojodu",
  description: "Kingdom Zonal HeadQuarters",
  openGraph: {
    images: './src/img/brand/logo.jpg', // e.g., '/og-image.jpg'
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
      </body>
    </html>
  );
}
