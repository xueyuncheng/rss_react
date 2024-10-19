'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dinner } from '@/types'
import { api } from '@/util'

export const columns: ColumnDef<Dinner>[] = [
  {
    header: '序号',
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'name',
    header: '名称',
  },
  {
    accessorKey: 'weight',
    header: '权重',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const dinner = row.original

      const onDeleteDinner = async (id: number) => {
        try {
          await api.deleteDinner(id)
          window.location.reload()
        } catch (error) {
          alert(error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/dinners/${dinner.id}`}>详情</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dinners/${dinner.id}/edit`}>编辑</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteDinner(dinner.id)}>
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
