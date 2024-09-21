import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '薛运成的网站',
  description: '薛运成的网站',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationMenu className="min-w-full mb-4 flex justify-center items-center py-2 bg-blue-800 text-white text-4xl font-bold text-center">
          <NavigationMenuList>
            <NavigationMenuItem>
              {/* <Link href="/"> */}
              <NavigationMenuLink href="/" className="hover:text-green-400">
                欢迎来到 薛运成 的网站
              </NavigationMenuLink>
              {/* </Link> */}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
