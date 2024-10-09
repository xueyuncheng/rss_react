import { ReadonlyURLSearchParams } from 'next/navigation'

const createPageURL = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  pageNumber: number | string
): string => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('page_no', pageNumber.toString())
  return `${pathname}?${params.toString()}`
}

export const util = {
  createPageURL,
}
