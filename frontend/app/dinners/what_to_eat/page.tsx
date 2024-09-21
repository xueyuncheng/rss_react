'use client'
import { whatToEatDiner } from '@/util'
import { useEffect, useState } from 'react'

type Props = {}

const Page = (props: Props) => {
  const [value, setValue] = useState('生成中，请稍后...')

  useEffect(() => {
    const fetchData = async () => {
      const response = await whatToEatDiner()
      setValue(response.data.night_snack_name)
    }

    fetchData()
  }, [])

  return (
    <div>
      <div className="mx-auto mt-16 w-1/2 h-[64px] rounded-full border-2 border-gray-200 flex justify-center items-center">
        <div className="text-center text-[32px] text-green-300">{value}</div>
      </div>
    </div>
  )
}

export default Page
