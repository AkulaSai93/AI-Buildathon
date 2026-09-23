import { Space_Grotesk, JetBrains_Mono, Bricolage_Grotesque, Anton } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poster',
  display: 'swap',
});

export const metadata = {
  title: 'AI Buildathon 2026 — 48-Hour National AI Hackathon',
  description: 'Ignite AI Buildathon',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${bricolage.variable} ${anton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
