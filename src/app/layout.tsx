import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/context/UserContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'LernBuddy – Dein KI-Lernbegleiter',
  description:
    'Meistere jedes Fach mit der Sokratischen Methode. Dein KI-Tutor führt dich zur Lösung, ohne sie zu verraten. Interaktiv, motivierend und effektiv.',
  keywords: [
    'Lernen',
    'KI Tutor',
    'Sokratische Methode',
    'Schule',
    'Bildung',
    'Hausaufgabenhilfe',
    'LernBuddy',
  ],
  authors: [{ name: 'LernBuddy Team' }],
  openGraph: {
    title: 'LernBuddy – Cleverer lernen mit KI',
    description:
      'Dein persönlicher KI-Tutor, der dich zur Lösung führt, anstatt sie nur zu verraten.',
    url: 'https://lernbuddy.de', // Placeholder URL
    siteName: 'LernBuddy',
    images: [
      {
        url: '/og-image.png', // I will create this later or user can provide
        width: 1200,
        height: 630,
        alt: 'LernBuddy – Dein KI Lernbegleiter',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LernBuddy – Cleverer lernen mit KI',
    description:
      'Dein Sokratischer Tutor für bessere Noten und echtes Verständnis.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/apple-touch-icon.png',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='de' className='dark'>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
