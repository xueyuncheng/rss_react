'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

// 左侧菜单栏数据
const SideBarData = [
  {
    title: 'Latest Episodes',
    href: '/podcasts/latest_episodes',
  },
  {
    title: 'Shows',
    href: '/podcasts',
  },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col">
      {SideBarData.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`border border-transparent px-2 py-1 hover:underline ${
            pathname === item.href ? 'font-medium' : 'text-muted-foreground'
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export default SideBar
