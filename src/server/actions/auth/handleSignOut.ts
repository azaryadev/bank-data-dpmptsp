'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'

const handleSignOut = async (accessToken: string) => {
    try {
        await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
    } catch (error) {
        console.error('Failed to logout Supabase', error)
    } finally {
        await signOut({ redirectTo: appConfig.unAuthenticatedEntryPath })
    }
}

export default handleSignOut
