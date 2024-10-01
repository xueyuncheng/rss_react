import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '夜宵功能',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
