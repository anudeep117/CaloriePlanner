import { useState, useEffect } from 'react';
import Input from './components/inputs/InputRow';
import OutputRow from './components/outputs/OutputRow';
import MacrosTable from './components/outputs/MacrosTable';
import Slider from './components/inputs/Slider';

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

    const onInput = (e: any) => {
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
        <div className="container mx-auto p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Input label="Current Weight" name="currentWt" value={params.currentWt} unit="kg" handleChange={onInput} />
                <Input label="Current Fat" name="currentFat" value={params.currentFat} unit="%" handleChange={onInput} />
                
                <Input label="Ideal Weight" name="idealWt" value={params.idealWt} unit="kg" handleChange={onInput} />
                <Input label="Ideal Fat" name="idealFat" value={params.idealFat} unit="%" handleChange={onInput} />
                <Input label="BMR" name="bmr" value={params.bmr} unit="kcal" handleChange={onInput} />
                <Input label="Fat / weight loss" name="fatLossToWtLossRatio" value={params.fatLossToWtLossRatio} unit="" handleChange={onInput} />
            </div>
            <div className="mt-4 first-line:grid gap-4 md:grid-cols-2">
                <Slider label="Active Calories" name="activeCal" value={params.activeCal} unit="kcal" handleChange={onInput} />
                <Slider label="Calorie Deficit" name="calDeficit" value={params.calDeficit} unit="kcal" handleChange={onInput} />
            </div>
            <br/>
            <hr></hr>
            <br/>
            <div className="mt-4">
                <MacrosTable protein={proteinSplitGrams} carbs={carbsSplitGrams} fat={fatSplitGrams}/>
            </div>
            <br/>
            <hr></hr>
            <br/>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <OutputRow label="Duration" value={durationWeeks} unit="weeks" />
                <OutputRow label="Duration" value={durationMonths} unit="Months" />
                <OutputRow label="Expected Weight Loss" value={expectedWtLoss} unit="kg/week" />
                <OutputRow label="Expected Fat Loss" value={expectedFatLoss} unit="kg/week" />
                <OutputRow label="Expected Muscle Loss" value={expectedMuscleLoss} unit="kg/week" />
                <OutputRow label="Expected Final Fat %" value={expectedFinalFatPcent} unit="%" />
            </div>
        </div>
    );
}

export default App;
