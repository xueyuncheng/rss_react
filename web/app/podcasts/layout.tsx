import type { Metadata } from 'next'

import SideBar from './SideBar'

export const metadata: Metadata = {
  title: 'Podcasts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex gap-4 w-full">
      <div className="flex-none">
        <SideBar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
