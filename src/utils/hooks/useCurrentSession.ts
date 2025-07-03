import { useContext } from 'react'
import SessionContext from '@/components/auth/AuthProvider/SessionContext'

const useCurrentSession = () => {
    const context = useContext(SessionContext)

    return {
        session: context || {
            expires: '',
            accessToken: '',
            user: {},
        },
    }
}

export default useCurrentSession
