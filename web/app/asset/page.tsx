'use client'
import React from 'react'
import AssetList from './asset'
import useSWR from 'swr'
import { ResponsePage, DefaultFetcher } from '../config/config'
import { Asset } from './asset'
import MyChart from './chart'

const Page = () => {
  const { data, isLoading, error } = useSWR<ResponsePage<Asset>>(
    '/assets',
    DefaultFetcher
  )
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Failed to load</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <div className="mt-20 ml-20 flex">
      <div className="w-96  bg-white border rounded-lg ml-6 mr-10 p-6 ">
        <AssetList items={data.data.items} />
      </div>
      <div className="h-full bg-white border rounded-lg p-6">
        <MyChart items={data.data.items} />
      </div>
    </div>
  )
}

export default Page
