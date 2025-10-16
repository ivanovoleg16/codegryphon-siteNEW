import './globals.css';
import type { Metadata } from 'next';
import { initGA4 } from '@/lib/analytics';
import React from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://codegryphon.ai'),
  title: {
    default: 'CodeGryphon — умный код‑ассистент',
    template: '%s — CodeGryphon',
  },
  description:
    'CodeGryphon — ассистент, который доводит задачи до результата: аналитика, девелопмент и QA в одном.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://codegryphon.ai/ru',
    siteName: 'CodeGryphon',
  },
  twitter: { card: 'summary_large_image' },
};

function GA4Initializer() {
  React.useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA4_ID || '';
    if (id) initGA4(id);
  }, []);
  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="bg-griffin-dark">
      <body>
        <GA4Initializer />
        {children}
      </body>
    </html>
  );
}
