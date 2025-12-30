import React from 'react'
import { Link } from 'react-router-dom'

const BreadCrumb = ({ category, id }) => {
    return (
        <div>
            <Link to={"/"}>
                <p className='text-[#0db269] '>Home</p>
            </Link>
            <Link to={`/collections/${category}`} className='flex gap-1'>
                <p className='text-[#e8e8e1]'>/</p>
                <p className='text-[#0db269] '> {category?.charAt(0).toUpperCase() + category?.slice(1).toLowerCase()}</p>
            </Link>
            <Link to={`/collection/${category}/products/${id}`} className='flex gap-1'>
                <p className='text-[#e8e8e1]'>/</p>
                <p className='text-[#0db269] '> { }</p>
            </Link>
            
        </div>
    )
}

export default BreadCrumb
