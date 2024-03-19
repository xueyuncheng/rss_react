export const Endpoint = 'http://localhost:10000/api'

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
    fetch(Endpoint + url, options).then((res) => res.json())
