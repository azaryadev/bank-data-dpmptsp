import NextAuth from 'next-auth'
import authConfig from '@/configs/auth.config'
import appConfig from './configs/app.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    pages: {
      signIn: appConfig.authenticatedEntryPath,
      error: appConfig.authenticatedEntryPath,
    },
  })