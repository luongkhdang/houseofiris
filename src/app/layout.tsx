/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean implementation of Next.js root layout
 * - Good separation of concerns with metadata imported from a separate file
 * - Client-side wrapping is properly implemented
 * 
 * Recommendations:
 * - Add TypeScript interface for props instead of inline type definition
 * - Consider adding more comments explaining the layout's purpose
 * - Add explicit accessibility attributes for better screen reader support
 */

import React from 'react';
import { Providers } from './providers';
import ClientLayout from '../components/layout/ClientLayout';
import './styles/globals.css';

export const metadata = {
  title: 'House of Iris and Tommy',
  description: 'A personal memory storage application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
