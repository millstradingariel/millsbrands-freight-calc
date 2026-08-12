import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Layout from '@/components/FreightCalculatorLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'MillsBrands Freight Calculator',
  description: 'MillsBrands Freight Calculator',
  icons:
  {
    icon: "/images/icon.png"
  }
};

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${montserrat.className}`}>
      <body className="antialiased">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}