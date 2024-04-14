export type Response<T> = {
  err: string
  data: T
}

export type ResponsePage<T> = {
  err: string
  data: {
    total: number
    items: T[]
  }
}

export const DefaultFetcher = (url: string, options?: any) =>
  fetch('api' + url, options).then((res) => {
    if (res.status === 401) {
      window.location.href = '/login?redirect_url=' + window.location.pathname
      throw new Error('Unauthorized')
    }
    return res.json()
  })
