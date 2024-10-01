import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '密码生成',
}

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return children
  }
  