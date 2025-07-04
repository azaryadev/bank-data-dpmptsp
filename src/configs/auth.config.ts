/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from 'next-auth/providers/credentials'

const refreshAccessToken = async (token: any) => {
    console.log('Refreshing with token:', token)
    if (!token.refreshToken) {
        throw new Error('Missing refresh_token')
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
                },
                body: JSON.stringify({
                    refresh_token: token.refreshToken,
                }),
            },
        )

        const refreshedTokens = await res.json()

        if (!res.ok) throw refreshedTokens

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        }
    } catch (error) {
        console.error('Refresh token failed', error)
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

const authConfig = {
    providers: [
        CredentialsProvider({
            name: 'Supabase Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            apikey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    },
                )

                const data = await res.json()

                const fetchProfile = await fetch(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_profiles?id=eq.${data.user.id}&select=*,roles(id,name)`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${data.access_token}`,
                            apikey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
                        },
                    },
                )

                const dataProfile = await fetchProfile.json()

                if (!res.ok || !data.access_token) {
                    throw new Error(
                        data.error_description || 'Invalid email or password',
                    )
                }

                // Extract user info from token or request user endpoint
                return {
                    id: data.user?.id || 'unknown-id',
                    email: String(credentials.email),
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresIn: data.expires_in, // seconds
                    profile: dataProfile[0], // 👈 Tambahkan ini
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt' as const,
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: Date.now() + user.expiresIn * 1000, // convert to ms
                    profile: user.profile, // 👈 Tambahkan ini
                }
            }

            // If access token still valid
            if (Date.now() < (token.accessTokenExpires ?? 0)) {
                return token
            }

            // Else: refresh it
            return await refreshAccessToken(token)
        },
        async session({ session, token }: any) {
            // Antisipasi jika session.user belum ada
            session.user = session.user || {}

            session.user.id = token.id
            session.user.email = token.email
            session.accessToken = token.accessToken
            session.error = token.error
            session.user.profile = token.profile // custom profile dari Supabase

            return session
        },
        secret: process.env.AUTH_SECRET,
    },
}

export default authConfig
