import { useId } from 'react'

interface SliderProps {
    label: string;
    name: string;
    value: number;
    unit: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Slider({label, name, value, unit, handleChange}: SliderProps) {
    const inputId = useId();
    return (
        <div className='text-slate-200 grid grid-rows-2 '>
            <div>
                <label htmlFor={inputId}>{label}</label>
            </div>
            <div className='grid grid-cols-2 gap-x-4'>
                <input type="range" className='w-96'
                    id={inputId}
                    name={name}
                    defaultValue={value}
                    step="50"
                    min="0"
                    max="1000"
                    onChange={handleChange}
                />
                <label htmlFor={inputId}>{value} {unit}</label>
            </div>
        </div>
    )
}