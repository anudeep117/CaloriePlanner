import { useState, useEffect } from 'react';
import Input from './components/inputs/InputRow';
import OutputRow from './components/outputs/OutputRow';
import MacrosTable from './components/outputs/MacrosTable';
import Slider from './components/inputs/Slider';
import styles from './styles/Layout.module.css';

function App() {
    
    const [ params, setParams ] = useState({
        currentWt: 105,
        currentFat: 38,
        idealWt: 75,
        idealFat: 15,
        bmr: 2300,
        activeCal: 700,
        calDeficit: 500,
        fatLossToWtLossRatio: 0.95,
        proteinSplitPcent: 40,
        carbsSplitPcent: 30,
        fatSplitPcent: 30,
    })

    const onInput = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value })
    }

    const [ durationWeeks, setDurationWeeks ] = useState("")
    const [ durationMonths, setDurationMonths ] = useState("")

    const [ proteinSplitGrams, setProteinSplitGrams ] = useState("")
    const [ carbsSplitGrams, setCarbsSplitGrams ] = useState("")
    const [ fatSplitGrams, setFatSplitGrams ] = useState("")

    const [ expectedWtLoss, setExpectedWtLoss ] = useState("")
    const [ expectedFatLoss, setExpectedFatLoss ] = useState("")
    const [ expectedMuscleLoss, setExpectedMuscleLoss ] = useState("")
    const [ expectedFinalFatPcent, setExpectedFinalFatPcent ] = useState("")

    function calculate() {
        // Question: Why is calDeficit a string after setting with useState? Initially it's set to number.
        const totalCalorieDeficitPerWeek = (Number(params.activeCal) + Number(params.calDeficit))*7;       
        
        // calories in 1kg of fat
        const calInKgFat = 9000;
        // fat loss required per week
        const fatLossPerWeek = totalCalorieDeficitPerWeek*params.fatLossToWtLossRatio/calInKgFat;
        setExpectedFatLoss(Number(fatLossPerWeek).toFixed(2));

        // calories in 1kg of muscle
        const calInKgMuscle = 4000;
        // muscle gain required per week
        const muscleGainPerWeek = totalCalorieDeficitPerWeek*(1.0 - params.fatLossToWtLossRatio)/calInKgMuscle;
        setExpectedMuscleLoss(muscleGainPerWeek.toFixed(2))
        
        const totalWtlossPerWeek = fatLossPerWeek + muscleGainPerWeek;
        setExpectedWtLoss(totalWtlossPerWeek.toFixed(2));
        
        const totalWtLossRequired = params.currentWt - params.idealWt;
        
        const durationWeeks = totalWtLossRequired/totalWtlossPerWeek;
        setDurationWeeks(durationWeeks.toFixed(2));
        setDurationMonths((durationWeeks/4).toFixed(2));
        
        const currentFatKg = params.currentWt*params.currentFat/100;
        setExpectedFinalFatPcent(((currentFatKg - fatLossPerWeek*durationWeeks)*100/params.idealWt).toFixed(2));
        
        const calIntakeTotal = params.bmr - params.calDeficit;
        setProteinSplitGrams((calIntakeTotal*params.proteinSplitPcent/100/4).toFixed(2))
        setCarbsSplitGrams((calIntakeTotal*params.carbsSplitPcent/100/4).toFixed(2))
        setFatSplitGrams((calIntakeTotal*params.fatSplitPcent/100/9).toFixed(2))      

    }

    useEffect(() => {
     calculate()
    }, [params.calDeficit, params.activeCal])

    return (
        <div className='justify-center'>
            <div className='grid grid-rows-12 justitfy-items-center'>
                <div className='grid row-span-6 grid-cols-2 gap-y-2'>
                    {/* Current*/}
                    <Input label="Current Weight" name="currentWt" value={params.currentWt} unit="kg" handleChange={onInput}/>
                    <Input label={"Current Fat"} name={"currentFat"} value={params.currentFat} unit={"%"} handleChange={onInput} />

                    {/* Ideal*/}
                    <Input label={"Ideal Weight"} name={"idealWt"} value={params.idealWt} unit={"kg"} handleChange={onInput} />
                    <Input label={"Ideal Fat"} name={"idealFat"} value={params.idealFat} unit={"%"} handleChange={onInput} />

                    {/* Calorie deficit */}
                    <Input label={"BMR"} name={"bmr"} value={params.bmr} unit={"kcal"} handleChange={onInput} />
                    <Input label={"Fat / weight loss"} name={"fatLossToWtLossRatio"} value={params.fatLossToWtLossRatio} unit={""} handleChange={onInput} />
                </div>
                <div className='grid row-span-2 grid-cols-3'>
                    <Input label={"Protein"} name={"proteinSplitPcent"} value={params.proteinSplitPcent} unit={"%"} handleChange={onInput} />
                    <Input label={"Carbs"} name={"carbsSplitPcent"} value={params.carbsSplitPcent} unit={"%"} handleChange={onInput} />
                    <Input label={"Fat"} name={"fatSplitPcent"} value={params.fatSplitPcent} unit={"%"} handleChange={onInput} />
                </div>
                <div className='grid row-span-4'>
                    <Slider label={"Calorie Deficit"} name={"calDeficit"} value={params.calDeficit} unit={"kcal"} handleChange={onInput} />
                    <Slider label={"Active Calories"} name={"activeCal"} value={params.activeCal} unit={"kcal"} handleChange={onInput} />
                </div>
            </div>

            <br/>
            <hr></hr>
            <br/>

            <br/>
            <div className='grid grid-cols-2 justify-items-center'>
                {/* Macro split */}
                <div>
                    <MacrosTable protein={proteinSplitGrams} carbs={carbsSplitGrams} fat={fatSplitGrams} />
                </div>
                
                <div className='grid grid-cols-2 gap-y-4'>
                    <OutputRow label={"Duration"} value={durationWeeks} unit={"weeks"} />
                    <OutputRow label={"Duration"} value={durationMonths} unit={"Months"} />
                    <OutputRow label={"Expected Weight loss"} value={expectedWtLoss} unit={"kg/week"} />
                    <OutputRow label={"Expected Fat loss"} value={expectedFatLoss} unit={"kg/week"} />
                    <OutputRow label={"Expected Muscle loss"} value={expectedMuscleLoss} unit={"kg/week"} />
                    <OutputRow label={"Expected Final Fat %"} value={expectedFinalFatPcent} unit={"%"} />
                </div>
            </div>
        </div>
    );
}

export default App;
