const createPageURL = (
  pathname: string,
  searchParams: URLSearchParams,
  pageNumber: number | string
) => {
  const params = new URLSearchParams(searchParams)
  params.set('page_no', pageNumber.toString())
  return `${pathname}?${params.toString()}`
}

export const util = {
  createPageURL: createPageURL,
}
