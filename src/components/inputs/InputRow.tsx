import { useId } from 'react'

export default function Input({label
    , name
    , value
    , unit
    , handleChange}) {
    
    const inputId = useId();
    return (
        <div className='text-slate-200 grid gap-y-2'>
            <div>
                <label htmlFor={inputId}>{label}</label>
            </div>
            <div className='grid gap-x-2 grid-cols-2 items-center'>
                <input className='bg-slate-200 text-black rounded-xl px-4 py-2'
                        id={inputId}
                        name={name}
                        type="number"
                        onChange={handleChange}
                        defaultValue={value}
                />
                <label htmlFor={inputId}>{unit}</label>
            </div>
        </div>
    );
}