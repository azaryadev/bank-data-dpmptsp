import type { JSX } from 'react'

import { HiDocument, HiHome, HiDocumentText } from 'react-icons/hi2'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiHome />,

    document: <HiDocument />,
    document2: <HiDocumentText />,
}

export default navigationIcon
