import { Dinner, WhatToEatDinner } from '@/types'
import useSWR from 'swr'

export type Response<T> = {
  err: string
  data: T
}

export type ResponseWithPage<T> = {
  err: string
  data: {
    total: number
    items: T[]
  }
}

const fetcher = async (url: string, method?: string, body?: any) => {
  const option = {
    method: method || 'GET',
    headers: body
      ? {
          'Content-Type': 'application/json',
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(url, option)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Something went wrong')
  }

  return response.json()
}

export function useGetDinner(id: number) {
  return useSWR<Response<Dinner>>(`/api/night_snacks/${id}`, fetcher)
}

export async function listDinner(
  pageNo: number,
  pageSize: number
): Promise<ResponseWithPage<Dinner>> {
  return fetcher(`/api/night_snacks?page_no=${pageNo}&page_size=${pageSize}`)
}

export async function getDinner(id: number): Promise<Response<any>> {
  return fetcher(`/api/night_snacks/${id}`)
}

export async function createDinner(dinner: Dinner): Promise<Response<any>> {
  return fetcher('/api/night_snacks', 'POST', dinner)
}

export async function updateDinner(dinner: Dinner): Promise<Response<any>> {
  return fetcher(`/api/night_snacks/${dinner.id}`, 'PUT', dinner)
}

export async function deleteDinner(id: number): Promise<Response<any>> {
  return fetcher(`/api/night_snacks/${id}`, 'DELETE')
}

export async function whatToEatDiner(): Promise<Response<WhatToEatDinner>> {
  return fetcher('/api/night_snacks/what_to_eat')
}
