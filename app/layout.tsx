import { GeistMono, GeistSans } from 'geist/font';
import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';

export const metadata: Metadata = {
  title: 'Crowd Fund',
  description: 'Crowd Fund',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#111520] dark:to-[#171923] transition-colors duration-300 antialiased min-h-screen overflow-x-hidden">
        <Providers>
          <main className="flex min-h-screen w-full items-center justify-center py-12">
            <div className="w-full max-w-4xl px-4 md:px-6 lg:px-8 py-2 flex items-center justify-center">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
