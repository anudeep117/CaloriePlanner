export default function MacrosOutput({protein, carbs, fat}) {
    return (
        <div className="text-slate-200 grid grid-rows-3 gap-y-2 justify-items-start">
            <div className="grid grid-cols-2 items-center">
                <label>Protein</label>
                <label className='border border-black rounded-xl w-32 p-2 bg-slate-600'>{protein} g</label>
            </div>
            <div className="grid grid-cols-2 items-center">
                <label>Carbs</label>
                <label className='border border-black rounded-xl w-32 p-2 bg-slate-600'>{carbs} g</label>
            </div>
            <div className="grid grid-cols-2 items-center">
                <label>Fat</label>
                <label className='border border-black rounded-xl w-32 p-2 bg-slate-600'>{fat} g</label>
            </div>
        </div>
        
    )
}