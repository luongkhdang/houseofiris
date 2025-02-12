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