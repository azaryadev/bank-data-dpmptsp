'use client'

import { useSession } from 'next-auth/react'

const Page = () => {
    const { data: session } = useSession()

    console.log('User profile:', session)

    return <div>Dashboard Page</div>
}

export default Page
