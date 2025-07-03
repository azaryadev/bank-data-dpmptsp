"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { COLOR_2 } from '@/constants/chart.constant'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SummaryPerTahun {
    tahun: number
    total: number
}

const SIUPDistributionPerYearChart = ({ data }: { data: SummaryPerTahun[] }) => {
    const categories = data.map((item) => item.tahun.toString())
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
                colors: [COLOR_2],
                xaxis: {
                    categories,
                    title: {
                        text: 'Tahun',
                    },
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} SIUP`,
                    },
                },
            }}
            series={[
                {
                    name: 'Jumlah SIUP',
                    data: seriesData,
                },
            ]}
            height={300}
            type="line"
        />
    )
}

export default SIUPDistributionPerYearChart
