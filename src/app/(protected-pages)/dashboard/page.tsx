/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useSupabaseSWR } from '@/services/swr/useSupabaseSWR'
import { useState } from 'react'
import WelcomeCard from './_components/WelcomeCard'

const Page = () => {
    return (
        <main>
            <div className=" grid grid-cols-3">
                <div className=" col-span-2">
                    <WelcomeCard />
                </div>
            </div>
        </main>
    )
}

export default Page
