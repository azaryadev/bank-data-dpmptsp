'use client'
import React from 'react'

import Link from 'next/link'

import CountUp from 'react-countup'

const Page = () => {
    return (
        <main>
            <section className=" relative  py-20 px-6 text-center ">
                <div className="max-w-3xl mx-auto">
                    <h1 className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-5xl">
                        Bank Data DPMPTSP Kab. Mimika
                    </h1>
                    <p className="text-lg md:text-lg text-gray-500 mb-8">
                        Sistem digitalisasi dan visualisasi data perizinan dan
                        non-perizinan untuk masyarakat dan instansi
                    </p>
                    <Link
                        href="/data-insight"
                        className="inline-block bg-[#f1b700] font-bold text-white px-6 py-3 rounded-xl shadow hover:bg-[#d8a300] transition"
                    >
                        Data Insight
                    </Link>
                </div>
            </section>
            <section className=" relative py-20  px-6 text-center">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Statistik Utama
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="   bg-[#ffeed9] p-6 rounded-xl shadow text-center">
                            <h3 className=" text-6xl mb-8 font-bold text-[#6d4c00]">
                                <CountUp end={12345} />
                            </h3>
                            <p className="text-[#f1b700]    text-center">
                                Total SIUP Terbit
                            </p>
                        </div>
                        <div className="bg-[#ffeed9] p-6 rounded-xl shadow">
                            <h3 className=" text-6xl mb-8 font-bold text-[#6d4c00]">
                                <CountUp end={8210} />
                            </h3>
                            <p className="text-[#f1b700] ">
                                Izin Per Tahun Terakhir
                            </p>
                        </div>
                        <div className="bg-[#ffeed9] p-6 rounded-xl shadow">
                            <h3 className=" text-6xl mb-8 font-bold text-[#6d4c00]">
                                <CountUp end={120} />
                            </h3>
                            <p className="text-[#f1b700] ">Jenis Perizinan</p>
                        </div>
                    </div>
                    <Link
                        href="/data-insight"
                        className="inline-block font-bold text-[#00923F] hover:underline text-lg"
                    >
                        Lihat Semua Data →
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Page
