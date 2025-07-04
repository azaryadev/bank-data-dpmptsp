/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { getSession } from 'next-auth/react'

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!

type Filter = { [key: string]: string }

export const useSupabaseMutation = (
    table: string,
    method: 'POST' | 'PATCH' | 'DELETE',
    filter?: Filter,
) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const mutate = async (payload?: any) => {
        setIsLoading(true)
        try {
            const session = await getSession()
            const accessToken = session?.accessToken 
            if (!accessToken)
                throw new Error('Access token not found in session')

            let url = `${BASE_URL}/rest/v1/${table}`
            if (filter && (method === 'PATCH' || method === 'DELETE')) {
                const query = new URLSearchParams()
                for (const key in filter) {
                    query.append(key, `eq.${filter[key]}`)
                }
                url += `?${query.toString()}`
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    apikey: API_KEY,
                    Authorization: `Bearer ${accessToken}`,
                    Prefer: 'return=representation',
                },
                body: method === 'DELETE' ? undefined : JSON.stringify(payload),
            })

            if (!res.ok) throw new Error(`Failed to ${method} ${table}`)

            const data = await res.json()
            setError(null)
            return data
        } catch (err: any) {
            setError(err)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { mutate, isLoading, error }
}
