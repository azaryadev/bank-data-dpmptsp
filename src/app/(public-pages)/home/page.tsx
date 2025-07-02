"use client"
import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui'

import PublicFooter from '@/components/PublicFooter'
import PublicHeader from '@/components/PublicHeader'

const Page = () => {
    return (
        <div>
            <PublicHeader />
            <Link href={'/sign-in'}>
                <Button variant="solid">Login</Button>
            </Link>
            Home
            <PublicFooter />
        </div>
    )
}

export default Page
