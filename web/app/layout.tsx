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
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '薛运成的网站',
  description: '薛运成的网站',
}

type Menu = {
  name: string
  href: string
}

const menus: Menu[] = [
  { name: '首页', href: '/' },
  { name: '夜宵功能', href: '/dinners' },
  { name: 'RSS 功能', href: '/channel' },
  { name: '密码生成', href: '/password' },
  { name: 'Podcast', href: '/podcasts' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'flex flex-col gap-2')}>
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.href}>
                <Link href={menu.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {menu.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Toaster />

        <div className="flex">
          <div className="flex-none w-1/6"></div>
          <div className="flex-1 flex justify-center">{children}</div>
          <div className="flex-none w-1/6"></div>
        </div>
      </body>
    </html>
  )
}
