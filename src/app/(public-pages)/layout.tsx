
import React from 'react'
import { ReactNode } from 'react'

import PublicFooter from '@/components/PublicFooter'
import PublicHeader from '@/components/PublicHeader'
import { DotBackground } from '@/components/customComponents/DotBackground'

const Layout = async ({ children }: { children: ReactNode }) => {
    return (
        <DotBackground>
            <PublicHeader />
            {children}
            <PublicFooter />
        </DotBackground>
    )
}

export default Layout
