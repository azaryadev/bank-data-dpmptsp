'use client'

import dynamic from 'next/dynamic'
// import { useEffect, useState } from 'react'
import { COLORS } from '@/constants/chart.constant'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SummaryData {
    kategori: string
    total: number
}

const SIUPSummaryByKategoryChart = ({ data }: { data: SummaryData[] }) => {
    // Extract categories and values
    const categories = data.map((item) => item.kategori)
    const seriesData = data.map((item) => item.total)

    return (
        <Chart
            options={{
                chart: {
                    id: 'siup-summary',
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        borderRadius: 4,
                    },
                },
                colors: COLORS,
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent'],
                },
                xaxis: {
                    categories,
                    labels: {
                        style: {
                            fontSize: '14px',
                        },
                    },
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                    },
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val}`,
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
            type="bar"
        />
    )
}

export default SIUPSummaryByKategoryChart
