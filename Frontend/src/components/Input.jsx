import React, { useId } from 'react'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
    {
        label,
        type = 'text',
        className = "",
        ...props
    }, ref) {
    const id = useId();
    return (
        <div
            className='w-full'>
            {label && <label
                className='inline-block mb-1 pl-1'
                htmlFor={id}
            > {label}
            </label>
            }
            <Input
                type={type}
                className={`px-3 py-2 rounded-lg bh-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref}
                id={id} {...props} />
        </div>
    )
})

export default Input
