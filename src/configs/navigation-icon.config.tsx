import type { JSX } from 'react'
import { FaUserLock } from 'react-icons/fa'

import { HiDocument, HiHome, HiDocumentText } from 'react-icons/hi2'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiHome />,

    document: <HiDocument />,
    document2: <HiDocumentText />,
    userAccount: <FaUserLock />
}

export default navigationIcon
