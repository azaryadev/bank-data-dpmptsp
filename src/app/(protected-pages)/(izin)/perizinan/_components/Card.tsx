/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/utils/themeStore'
import {
    Card,
    // Select,
    Input,
    DatePicker,
    Button,
    // Notification,
    // toast,
    FormItem,
} from '@/components/ui'

import useDebounce from '@/utils/hooks/useDebounce'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import TablePerizinan from './Table'
import TableSkeleton from '@/components/shared/loaders/TableSkeleton'
import { formatedDate } from '@/utils/formatedDate'

import { validationDateParams } from '@/utils/validation/defaultValidations'
import { SortingState } from '@tanstack/react-table'
import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { IoCreateOutline } from 'react-icons/io5'
import { selectRelation } from '@/utils/selectRelation'

type DateFormType = z.infer<typeof validationDateParams>

const CardPerizinan = () => {
    const {
        setValue,
        formState: { errors },
        trigger,
    } = useForm<DateFormType>({
        resolver: zodResolver(validationDateParams),
        defaultValues: {
            dateFrom: null,
            dateTo: null,
        },
    })

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([]) // State for sorting

    const [valueName, setValueName] = useState('')
    const [valueYear, setValueYear] = useState('')
    const [valueStartDate, setValueStartDate] = useState<Date | null>(null)
    const [valueEndDate, setValueEndDate] = useState<Date | null>(null)

    const filteringParams = {
        'tahun.eq': useDebounce(valueYear, 500),
        'created_at.gte': valueStartDate
            ? formatedDate(valueStartDate).toString()
            : '',
        'created_at.lte': valueEndDate
            ? formatedDate(valueEndDate).toString()
            : '',
    }

    const { data, error, isLoading } = useSupabaseSWR('rekap_izin', {
        page: page,
        pageSize: pageSize,
        select: selectRelation(['*'], ['surat_izin(id,name)']),
        order:
            sorting.length > 0
                ? {
                      column: sorting[0].id,
                      ascending: !sorting[0].desc,
                  }
                : undefined, // atau null, tergantung API kamu
        filter: filteringParams,
    })

    const filteredData = data?.data.filter((item : any) =>
        item.surat_izin?.name
            ?.toLowerCase()
            .includes(valueName.toLowerCase())
    )

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
                    <h5 className="uppercase">Rekap Izin</h5>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4  items-center">
                    <FormItem>
                        <Input
                            size="sm"
                            placeholder="Nama Surat"
                            value={valueName}
                            onChange={(e) => setValueName(e.target.value)}
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            size="sm"
                            placeholder="Tahun"
                            value={valueYear}
                            onChange={(e) => setValueYear(e.target.value)}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.dateFrom)}
                        errorMessage={errors.dateFrom?.message}
                    >
                        <DatePicker
                            size="sm"
                            placeholder="Start enrolled date"
                            value={valueStartDate}
                            onChange={async (date) => {
                                setValueStartDate(date)
                                setValue('dateFrom', date)
                                await trigger(['dateFrom', 'dateTo'])
                            }}
                        />
                    </FormItem>
                    <FormItem
                        invalid={Boolean(errors.dateTo)}
                        errorMessage={errors.dateTo?.message}
                    >
                        <DatePicker
                            size="sm"
                            placeholder="End enrolled date"
                            value={valueEndDate}
                            onChange={async (date) => {
                                setValueEndDate(date)
                                setValue('dateTo', date)
                                await trigger(['dateFrom', 'dateTo'])
                            }}
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
                            <TablePerizinan
                                data={filteredData}
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

export default CardPerizinan
