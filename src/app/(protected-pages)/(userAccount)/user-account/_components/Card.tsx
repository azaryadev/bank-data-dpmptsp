'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/utils/themeStore'
import { useRouter } from 'next/navigation'
import {
    Card,
    // Select,
    Input,
    Button,
    // Notification,
    // toast,
    FormItem,
} from '@/components/ui'

import useDebounce from '@/utils/hooks/useDebounce'

import TableUserAccount from './Table'
import TableSkeleton from '@/components/shared/loaders/TableSkeleton'

import { SortingState } from '@tanstack/react-table'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { IoCreateOutline } from 'react-icons/io5'
import { selectRelation } from '@/utils/selectRelation'

const CardUserAccount = () => {
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([]) // State for sorting

    const [valueEmail, setValueEmail] = useState('')
    const [valueFirstName, setValueFirstName] = useState('')
    const [valueLastName, setValueLastName] = useState('')

    const filteringParams = {
        email: useDebounce(valueEmail, 500),
        first_name: useDebounce(valueFirstName, 500),
        last_name: useDebounce(valueLastName, 500),
    }

    const {
        data,
        error,
        isLoading,
        mutate: mutateSiupData,
    } = useSupabaseSWR('user_profiles', {
        page: page,
        pageSize: pageSize,
        select: selectRelation(['*'], ['roles(id,name)']),
        order:
            sorting.length > 0
                ? {
                      column: sorting[0].id,
                      ascending: !sorting[0].desc,
                  }
                : {
                      column: 'created_at',
                      ascending: false,
                  }, // atau null, tergantung API kamu
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
                    <h5 className="uppercase">User Account</h5>
                    <Button
                        className=" items-center flex gap-2"
                        size="sm"
                        onClick={() => {
                            router.push('/user-account/create')
                        }}
                        icon={<IoCreateOutline />}
                        iconAlignment="start"
                    >
                        Create
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-x-4  items-center">
                    <FormItem>
                        <Input
                            size="sm"
                            placeholder="Email"
                            value={valueEmail}
                            onChange={(e) => setValueEmail(e.target.value)}
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            size="sm"
                            placeholder="First Name"
                            value={valueFirstName}
                            onChange={(e) => setValueFirstName(e.target.value)}
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            size="sm"
                            placeholder="Last Name"
                            value={valueLastName}
                            onChange={(e) => setValueLastName(e.target.value)}
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
                            <TableUserAccount
                                data={data?.data}
                                page={page}
                                pageSize={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                totalRecords={data?.total}
                                sorting={sorting}
                                setSorting={setSorting}
                                refresh={mutateSiupData}
                            />
                        </>
                    )
                )}
            </div>
        </Card>
    )
}

export default CardUserAccount
