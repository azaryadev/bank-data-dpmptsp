'use client'
import React from 'react'

import PublicFooter from '@/components/PublicFooter'
import PublicHeader from '@/components/PublicHeader'
import { DotBackground } from '@/components/customComponents/DotBackground'

const Page = () => {
    return (
        <DotBackground>
            <PublicHeader />
            Home
            <PublicFooter />
        </DotBackground>
        // <div className="h-[3000px]">
        // </div>
    )
}

export default Page
