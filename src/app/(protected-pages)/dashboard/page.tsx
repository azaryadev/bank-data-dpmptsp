/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { useState } from 'react'

const Page = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)

    const { data, error, isLoading, mutate } = useSupabaseSWR('siup_data', {
        page: page,
        pageSize: pageSize,
        order: { column: 'created_at', ascending: false },
    })

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div>
            <h1>Data SIUP</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>

            <button onClick={() => mutate()}>Refresh</button>
        </div>
    )
}

export default Page
