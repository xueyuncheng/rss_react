import { Dinner, WhatToEatDinner } from '@/types'

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

async function listDinner(
  pageNo: number,
  pageSize: number
): Promise<ResponseWithPage<Dinner>> {
  return fetcher(`/api/night_snacks?page_no=${pageNo}&page_size=${pageSize}`)
}

async function getDinner(id: number): Promise<Response<Dinner>> {
  return fetcher(`/api/night_snacks/${id}`)
}

async function createDinner(dinner: Dinner): Promise<Response<any>> {
  return fetcher('/api/night_snacks', 'POST', dinner)
}

async function updateDinner(dinner: Dinner): Promise<Response<any>> {
  return fetcher(`/api/night_snacks/${dinner.id}`, 'PUT', dinner)
}

async function deleteDinner(id: number): Promise<Response<any>> {
  return fetcher(`/api/night_snacks/${id}`, 'DELETE')
}

async function whatToEatDinner(): Promise<Response<WhatToEatDinner>> {
  return fetcher('/api/night_snacks/what_to_eat')
}

export const api = {
  listDinner,
  getDinner,
  createDinner,
  updateDinner,
  deleteDinner,
  whatToEatDiner: whatToEatDinner,
}
