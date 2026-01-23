import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Config-Driven UI',
  description: 'Powered by Strapi & Next.js',
};

import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  );
}
