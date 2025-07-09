/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { useState } from 'react'
import WelcomeCard from './_components/WelcomeCard'
import RekapIzinPerMonthCard from './_components/RekapIzinPerMonthCard'
import TopSuratIzin from './_components/TopSuratIzin'

const Page = () => {
    return (
        <main>
            <div className=" grid grid-cols-3 mb-4 gap-x-4">
                <div className=" col-span-2">
                    <div className="mb-4">
                        <WelcomeCard />
                    </div>
                    <div className=" mb-4">
                        <RekapIzinPerMonthCard />
                    </div>
                </div>
                <div className="col-span-1">
                    <TopSuratIzin />
                </div>
            </div>
        </main>
    )
}

export default Page
