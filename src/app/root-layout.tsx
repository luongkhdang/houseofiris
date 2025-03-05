/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean and minimal server-side root layout
 * - Good separation of concerns with metadata imported from a separate file
 * - Proper language attribute on HTML element for accessibility
 * 
 * Recommendations:
 * - Add React import to avoid implicit global reference
 * - Add TypeScript interface for props rather than inline typing
 * - Document the purpose and relationship between this layout and layout.tsx
 * - Consider adding more semantic HTML structure (e.g., main tag)
 */

import React from "react"
import { metadata } from "./metadata"

export { metadata }

export default function RootServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 