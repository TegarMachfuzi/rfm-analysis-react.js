import React from 'react'
import { FcBullish } from 'react-icons/fc'
import { SIDEBAR_LINKS } from '../../lib/consts/navigation'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

const linkClases = 'flex items-center text-lg gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {
  return (

      <div className='bg-neutral-900 w-80 p-3 flex flex-col text-white'>
        <div className='flex items-center gap-2 px-1 py-3'>
                <FcBullish fontSize={24}/>
                <span className='text-neutral-100 text-x'>RFM Analysis</span>
            </div>
            <div className='flex-1 py-8 flex flex-col gap-0.5'>
                {SIDEBAR_LINKS.map((item)=>(
                    <SideBarLink key={item.key} item={item}/>
                ))}
            </div>
            <div>bottom part</div>
        </div>
   
  )
}

function SideBarLink({ item }) {

    const { pathname } = useLocation()
    return (
        <Link to={item.path} className={classNames(pathname === item.path ? 'bg-neutral-700 text-white' : 'text-neutral-400' ,linkClases)}>
            <span className='text-xl'>{item.icon}</span>
            {item.label}
        </Link>
    )
}
