// Layout principal da aplicação — é o "esqueleto" que envolve todas as páginas.
// Tudo que está aqui (fontes, providers, metadata) se aplica ao site inteiro.

import type { Metadata } from 'next';
import { Roboto, Roboto_Condensed, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

// Carregando as fontes que a gente usa no projeto.
// O Next otimiza isso automaticamente (baixa na build, sem flash de fonte).

// Roboto: fonte principal dos textos do site
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

// Roboto Condensed: usada nos títulos de destaque (ex: "Maya RPG", nomes de seção)
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
  display: 'swap',
});

// Poppins: fonte auxiliar pra quando queremos um visual mais moderno
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Metadados que aparecem na aba do navegador e nos resultados de busca
export const metadata: Metadata = {
  title: 'Maya Yamamoto RPG',
  description: 'Sistema de gestão e portal do paciente - Clínica Maya Yamamoto RPG',
};

// RootLayout: componente que "embrulha" toda a aplicação.
// Define o idioma (pt-BR), aplica as fontes e carrega os providers globais.
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
