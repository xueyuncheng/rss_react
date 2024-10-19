'use client'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import DinnerForm from '@/components/DinnerForm'
import { Button } from '@/components/ui/button'
import { Dinner } from '@/types'
import { api } from '@/util'

type Props = {}

const Page = (props: Props) => {
  const { id } = useParams<{ id: string }>()
  const [dinner, setDinner] = useState<Dinner>()
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getDinner(Number(id))
        setDinner(response.data)
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button asChild>
          <Link href={`${pathname}/edit`}>编辑</Link>
        </Button>
      </div>
      <DinnerForm type="View" dinner={dinner} />
    </div>
  )
}

export default Page
