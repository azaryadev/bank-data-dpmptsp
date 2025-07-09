import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'siup',
        path: '',
        title: 'SIUP',
        translateKey: 'nav.siup.siup',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'siup.data',
                path: '/siup',
                title: 'SIUP',
                translateKey: 'nav.siup.data',
                icon: 'document',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'siup.kategoriusaha',
                path: '/kategori-usaha',
                title: 'Kategori Usaha',
                translateKey: 'nav.siup.kategoriusaha',
                icon: 'document2',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'izin',
        path: '',
        title: 'Perizinan',
        translateKey: 'nav.izin.izin',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'izin.data',
                path: '/perizinan',
                title: 'Perizinan',
                translateKey: 'nav.izin.data',
                icon: 'document',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'izin.suratizin',
                path: '/surat-izin',
                title: 'Surat Izin',
                translateKey: 'nav.izin.suratizin',
                icon: 'document2',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'userAccount',
        path: '',
        title: 'User Account',
        translateKey: 'nav.userAccount',
        icon: 'userAccount',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'userAccount.user',
                path: '/user-account',
                title: 'User',
                translateKey: 'nav.userAccount.user',
                icon: 'userAccount',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'userAccount.roles',
                path: '/roles',
                title: 'Roles',
                translateKey: 'nav.userAccount.roles',
                icon: 'userAccount',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
