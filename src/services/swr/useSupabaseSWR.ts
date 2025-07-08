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
    select?: string // 👈 untuk relasi atau kolom spesifik
}

const fetcher = async ([table, params]: [string, SupabaseSWRParams]) => {
    const session = await getSession()
    const accessToken = session?.accessToken

    if (!accessToken) throw new Error('Access token not found in session')

    const { filter, page = 1, pageSize = 10, order } = params || {}

    const url = new URL(`${BASE_URL}/rest/v1/${table}`)
    url.searchParams.append('select', params?.select || '*')
    
    for (const rawKey in filter) {
        const val = filter[rawKey]
        if (!val) continue

        const [key, operator] = rawKey.split('.')

        // Cek apakah value adalah UUID (panjang 36 dan ada 4 tanda '-')
        const isUUID =
            typeof val === 'string' &&
            val.length === 36 &&
            (val.match(/-/g) || []).length === 4

        if (operator) {
            url.searchParams.append(key, `${operator}.${val}`)
        } else if (isUUID) {
            url.searchParams.append(key, `eq.${val}`)
        } else {
            url.searchParams.append(key, `ilike.*${val}*`)
        }
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    // url.searchParams.append('offset', page.toString())
    // url.searchParams.append('limit', pageSize.toString())

    if (order) {
        url.searchParams.append(
            'order',
            `${order.column}.${order.ascending ? 'asc' : 'desc'}`,
        )
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        apikey: API_KEY,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'count=exact',
    }

    // Tambahkan header Range untuk pagination
    headers['Range'] = `${from}-${to}`

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers,
        cache: 'no-store',
    })

    if (!res.ok) throw new Error(`Failed to fetch from ${table}`)

    const data = await res.json()
    const contentRange = res.headers.get('content-range')
    const total = contentRange ? parseInt(contentRange.split('/')[1] || '0') : 0

    return { data, total }
}

export const useSupabaseSWR = (table: string, params?: SupabaseSWRParams) => {
    const swrKey = table ? [table, params || {}] : null

    const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: true,
        shouldRetryOnError: false,
    })

    return { data, error, isLoading, mutate }
}
