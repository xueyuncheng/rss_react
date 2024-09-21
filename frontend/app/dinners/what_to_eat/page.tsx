'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/util'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {}

const Page = (props: Props) => {
  const [value, setValue] = useState('生成中，请稍后...')

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.whatToEatDiner()
      setValue(response.data.night_snack_name)
    }

    fetchData()
  }, [])

  return (
    <div className="mx-auto w-1/2 h-[64px] space-y-2">
      <div className="flex justify-end">
        <Link href="/dinners">
          <Button>夜宵列表</Button>
        </Link>
      </div>
      <div className=" rounded-full border-2 border-gray-200 flex justify-center items-center">
        <div className="text-center text-[32px] text-green-300">{value}</div>
      </div>
    </div>
  )
}

export default Page
