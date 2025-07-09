'use client'
import React, { useEffect, useState } from 'react'

import RekapIzinPerMonthChart from '@/app/(public-pages)/data-insight/_components/RekapIzinPerMonthChart'
import { Card, Select } from '@/components/ui'
import { callSupabaseRPC } from '@/services/supabaseRpc'

const RekapIzinPerMonthCard = () => {
    const [data, setData] = useState()
    const yearOptions = [
        { value: '2020', label: '2020' },
        { value: '2021', label: '2021' },
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
    ]
    useEffect(() => {
        const getData = async () => {
            const dataRekapTrendPerMonth = await callSupabaseRPC(
                'get_rekap_trend_per_bulan',
            )
            setData(dataRekapTrendPerMonth)
        }

        getData()
    }, [])

    return (
        <div>
            <Card>
                <div className=" flex items-center justify-between mb-4">
                    <h4>Rekap Izin Per Bulan</h4>
                    <Select
                        placeholder="Tahun"
                        options={yearOptions}
                        isSearchable={false}
                        isClearable={false}
                    />
                </div>
                <div>
                    <RekapIzinPerMonthChart data={data ? data : []} />
                </div>
            </Card>
        </div>
    )
}

export default RekapIzinPerMonthCard
