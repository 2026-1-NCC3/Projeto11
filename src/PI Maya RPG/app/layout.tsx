import type { Metadata } from 'next';
import { Roboto, Roboto_Condensed, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maya Yamamoto RPG',
  description: 'Sistema de gestão e portal do paciente - Clínica Maya Yamamoto RPG',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} ${robotoCondensed.variable} ${poppins.variable}`}>
      <body className="font-roboto antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
