interface OutputRowProps {
    label: string;
    value: string;
    unit: string;
}

export default function OutputRow({label, value, unit}: OutputRowProps) {
    return (
        <div className='text-slate-200 grid gap-y-2'>
            <div>
                <label>{label}</label>
            </div>
            <div className='grid gap-x-2 grid-cols-2 items-center'>
                <label className='border border-black rounded-xl w-full p-2 bg-slate-600'>{value}</label>
                <label>{unit}</label>
            </div>
        </div>
    );
}
