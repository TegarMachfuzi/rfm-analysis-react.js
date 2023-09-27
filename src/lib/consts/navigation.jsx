import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart
} from 'react-icons/hi'

export const SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid/>
    },
    {
        key: 'recency',
        label: 'Recency',
        path: '/recency',
        icon: <HiOutlineViewGrid/>
    },
    {
        key: 'frecuency',
        label: 'Frecuency',
        path: '/frecuency',
        icon: <HiOutlineCube/>
    },
    {
        key: 'monetary',
        label: 'Monetary',
        path: '/monetary',
        icon: <HiOutlineShoppingCart/>
    }
]
