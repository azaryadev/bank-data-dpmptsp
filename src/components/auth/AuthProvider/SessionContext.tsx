'use client'

import { createContext } from 'react'
import type { User } from 'next-auth'

type Session = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: User & Record<string, any>
    expires: string
    accessToken?: string | undefined
}

const SessionContext = createContext<Session | null>({
    expires: '',
    accessToken: ''

})

export default SessionContext
