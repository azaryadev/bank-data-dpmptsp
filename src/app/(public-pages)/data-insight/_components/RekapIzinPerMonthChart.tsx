'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { COLOR_1 } from '@/constants/chart.constant'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Summarydata {
    bulan: string
    total: number
}

const RekapIzinPerMonthChart = ({ data }: { data: Summarydata[] }) => {
    const categories = data.map((item) => item.bulan)
    const seriesData = data.map((item) => item.total)

    return (
        <Chart
            options={{
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                },
                colors: [COLOR_1],
                xaxis: {
                    categories,
                    title: {
                        text: 'Bulan',
                    },
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val}`,
                    },
                },
            }}
            series={[
                {
                    name: 'Jumlah Surat',
                    data: seriesData,
                },
            ]}
            height={300}
            type="line"
        />
    )
}

export default RekapIzinPerMonthChart
