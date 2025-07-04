'use client'

import useSWR from 'swr'
import { getSession } from 'next-auth/react'

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!

type Filter = { [key: string]: string }

interface SupabaseSWRParams {
  filter?: Filter
  page?: number
  pageSize?: number
  order?: { column: string; ascending?: boolean }
}

const fetcher = async ([table, params]: [string, SupabaseSWRParams]) => {
  const session = await getSession()
  const accessToken = session?.accessToken

  if (!accessToken) throw new Error('Access token not found in session')

  const { filter, page = 1, pageSize = 10, order } = params || {}

  const url = new URL(`${BASE_URL}/rest/v1/${table}`)
  url.searchParams.append('select', '*')

  if (filter) {
    for (const key in filter) {
      url.searchParams.append(key, `eq.${filter[key]}`)
    }
  }

  const from = (page - 1) * pageSize
//   const to = from + pageSize - 1
  url.searchParams.append('offset', from.toString())
  url.searchParams.append('limit', pageSize.toString())

  if (order) {
    url.searchParams.append('order', `${order.column}.${order.ascending ? 'asc' : 'desc'}`)
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Failed to fetch from ${table}`)

  return res.json()
}

export const useSupabaseSWR = (
  table: string,
  params?: SupabaseSWRParams
) => {
  const swrKey = table ? [table, params || {}] : null

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  })

  return { data, error, isLoading, mutate }
}