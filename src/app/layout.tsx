import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/context/UserContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'LernBuddy – Dein Sokratischer Tutor',
  description:
    'Lerne mit deinem KI-Lehrer durch die sokratische Methode. Keine Lösungen verraten, nur hinführen.',
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
