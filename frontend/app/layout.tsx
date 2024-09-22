import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '薛运成的网站',
  description: '薛运成的网站',
}

const menus: { name: string; href: string }[] = [
  { name: '夜宵功能', href: '/dinners' },
  { name: 'RSS 功能', href: '/channel' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationMenu className="mx-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  欢迎来到 薛运成 的网站
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Toaster />

        <div className="flex">
          <NavigationMenu>
            <NavigationMenuList className="flex-col">
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.name}>
                  <Link href={menu.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {menu.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {children}
        </div>
      </body>
    </html>
  )
}
