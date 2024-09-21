import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '今晚吃什么',
  description: '今晚吃什么',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
