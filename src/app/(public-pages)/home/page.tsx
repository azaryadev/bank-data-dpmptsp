'use client'
import React from 'react'

import PublicFooter from '@/components/PublicFooter'
import PublicHeader from '@/components/PublicHeader'
import { DotBackground } from '@/components/customComponents/DotBackground'

const Page = () => {
    return (
        <DotBackground>
            <PublicHeader />
            <div className=' flex justify-center items-center h-[3000px]'>
                <h1>Home</h1>
            </div>
            <PublicFooter />
        </DotBackground>
        // <div className="h-[3000px]">
        // </div>
    )
}

export default Page
