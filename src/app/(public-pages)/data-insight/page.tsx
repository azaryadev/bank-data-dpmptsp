import React from 'react'
import CardDataInsight from './_components/CardDataInsight'

import { callSupabaseRPC } from '@/services/supabaseRpc'
import SIUPSummaryByKategoryChart from './_components/SIUPSummaryByKategoryChart'
import SIUPDistributionPerYearChart from './_components/SIUPDistributionPerYearChart'
import RekapIzinPerMonthChart from './_components/RekapIzinPerMonthChart'

import { IoDocument } from 'react-icons/io5'

const Page = async () => {
    const dataSiupSummaryByKategori = await callSupabaseRPC(
        'get_siup_summary_by_kategori',
    )

    const dataSiupDistributionPerYear = await callSupabaseRPC(
        'get_siup_distribution_per_tahun',
    )

    const dataRekapTrendPerMonth = await callSupabaseRPC(
        'get_rekap_trend_per_bulan',
    )

    const dataTop5SuratIzin = await callSupabaseRPC('get_top_5_jenis_izin')

    return (
        <main className=" relative">
            <section className="min-h-screen  py-16 px-6">
                <div className=" mx-20">
                    <h1 className="text-4xl font-bold text-gray-800 mb-16 text-center">
                        Data Insight
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Placeholder for Chart 1 */}
                        <CardDataInsight title="SIUP Summary By Kategori">
                            <SIUPSummaryByKategoryChart
                                data={dataSiupSummaryByKategori}
                            />
                        </CardDataInsight>
                        <CardDataInsight title="SIUP Distribution Per Year">
                            <SIUPDistributionPerYearChart
                                data={dataSiupDistributionPerYear}
                            />
                        </CardDataInsight>
                    </div>
                    <div className=" mb-8">
                        <CardDataInsight title="Rekap Izin Per Month">
                            <RekapIzinPerMonthChart
                                data={dataRekapTrendPerMonth}
                            />
                        </CardDataInsight>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <CardDataInsight title="Top 5 Surat Izin">
                            {dataTop5SuratIzin.map(
                                (
                                    item: {
                                        jenis_izin: string
                                        jumlah: number
                                    },
                                    i: number,
                                ) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 mb-4"
                                    >
                                        <div className=' border-2 border-[#7cbc7d] p-2 rounded-xl'>
                                            <IoDocument className="w-7 h-7 text-[#7cbc7d]" />
                                        </div>
                                        <div>
                                            <h6>{item.jenis_izin}</h6>
                                            <p>Total : {item.jumlah}</p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </CardDataInsight>
                    </div>

                    {/* Additional Sections Can Be Added Below */}
                </div>
            </section>
        </main>
    )
}

export default Page
