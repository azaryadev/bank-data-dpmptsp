'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/utils/themeStore'
import { Card, Button, FormItem, Input } from '@/components/ui'

import TableSuratIzin from './Table'
import TableSkeleton from '@/components/shared/loaders/TableSkeleton'

import { SortingState } from '@tanstack/react-table'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { IoCreateOutline } from 'react-icons/io5'
import useDebounce from '@/utils/hooks/useDebounce'

const CardSuratIzin = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([]) // State for sorting

    const [valueName, setValueName] = useState('')

    const filteringParams = {
        name: useDebounce(valueName, 500),
    }

    const { data, error, isLoading } = useSupabaseSWR('surat_izin', {
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
        filter: filteringParams,
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
                    <h5 className="uppercase">Surat Izin</h5>
                    <Button
                        className=" items-center flex gap-2"
                        size="sm"
                        onClick={() => {}}
                        icon={<IoCreateOutline />}
                        iconAlignment="start"
                    >
                        Create
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-4  items-center">
                    <FormItem>
                        <Input
                            size="sm"
                            placeholder="Nama Surat"
                            value={valueName}
                            onChange={(e) => setValueName(e.target.value)}
                        />
                    </FormItem>
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
                            <TableSuratIzin
                                data={data?.data}
                                page={page}
                                pageSize={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                totalRecords={data?.total}
                                sorting={sorting}
                                setSorting={setSorting}
                            />
                        </>
                    )
                )}
            </div>
        </Card>
    )
}

export default CardSuratIzin
