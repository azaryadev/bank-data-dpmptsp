'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/utils/themeStore'
import { Card, Button } from '@/components/ui'

import TableKategoriUsaha from './Table'
import TableSkeleton from '@/components/shared/loaders/TableSkeleton'

import { SortingState } from '@tanstack/react-table'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { IoCreateOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'



const CardKategoriUsaha = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([]) // State for sorting

    const router = useRouter()
    const {
        data,
        error,
        isLoading,
        mutate: refreshData,
    } = useSupabaseSWR('kategori_usaha', {
        page: page,
        pageSize: pageSize,
        select: '*',
        order:
            sorting.length > 0
                ? {
                      column: sorting[0].id,
                      ascending: !sorting[0].desc,
                  }
                : undefined, // atau null, tergantung API kamu
    })

    console.log('data', data)

    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (!sideNavCollapse && isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (!isFirstRender.current) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [sideNavCollapse])

    return (
        <Card>
            <div className="flex flex-col justify-between gap-y-4 mb-8">
                <div className=" flex flex-col md:flex-row items-center justify-between">
                    <h5 className="uppercase">Kategori Usaha</h5>
                    <Button
                        className=" items-center flex gap-2"
                        size="sm"
                        onClick={() => {router.push("/kategori-usaha/create")}}
                        icon={<IoCreateOutline />}
                        iconAlignment="start"
                    >
                        Create
                    </Button>
                </div>
            </div>
            <div>
                {isLoading ? (
                    <TableSkeleton />
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        {' '}
                        {/* Added flex and height styles */}
                        <p className="text-center">
                            Failed to load response data: No data found for
                            resource with given identifier
                        </p>
                    </div>
                ) : (
                    data && (
                        <>
                            <TableKategoriUsaha
                                data={data?.data}
                                page={page}
                                pageSize={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                totalRecords={data?.total}
                                sorting={sorting}
                                setSorting={setSorting}
                                refresh={refreshData}
                            />
                        </>
                    )
                )}
            </div>
        </Card>
    )
}

export default CardKategoriUsaha
