import { useState, useEffect } from 'react';
import Input from './components/inputs/InputRow';
import OutputRow from './components/outputs/OutputRow';
import Slider from './components/inputs/Slider';

function App() {
    
    const [ params, setParams ] = useState({
        currentWt: 105,
        currentFat: 38,
        idealWt: 75,
        idealFat: 15,
        bmr: 2300,
        activeCal: 800,
        calDelta: -500,
        fatToMuscleRecompPcent: 0, // Convert 
        proteinSplitPcent: 40,
        carbsSplitPcent: 30,
        fatSplitPcent: 30,
    })

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({ ...params, [e.target.name]: e.target.valueAsNumber });
    }

    const [ durationWeeks, setDurationWeeks ] = useState("")
    const [ durationMonths, setDurationMonths ] = useState("")

    const [ proteinSplitGrams, setProteinSplitGrams ] = useState("")
    const [ carbsSplitGrams, setCarbsSplitGrams ] = useState("")
    const [ fatSplitGrams, setFatSplitGrams ] = useState("")

    const [ calorieIntake, setCalorieIntake ] = useState("")
    const [ expectedWtDelta, setExpectedWtDelta ] = useState("")
    const [ expectedFatDelta, setExpectedFatDelta ] = useState("")
    const [ expectedMuscleDelta, setExpectedMuscleDelta ] = useState("")

    function calculate() {

        const totalCalorieBurnPerWeek = (-Number(params.activeCal) + Number(params.calDelta))*7; // cal/week
        
        const currentFat = params.currentWt*params.currentFat/100;
        const idealFat = params.idealWt*params.idealFat/100;
        const totalFatDeltaRequired = idealFat - currentFat; // kg         
        const calInKgFat = 9000; // calories in 1kg of fat
        const totalCaloriesForFatDelta = totalFatDeltaRequired * calInKgFat;
        
        const currentBodyWt = params.currentWt*(1-params.currentFat/100);
        const idealBodyWt = params.idealWt*(1-params.idealFat/100);
        const totalMuscleDeltaRequired = idealBodyWt - currentBodyWt; // kg
        const calInKgMuscle = 4000; // calories in 1kg of muscle
        const totalCaloriesForMuscleDelta = totalMuscleDeltaRequired * calInKgMuscle;
        
        const fatToMuscleCoversionRatio = calInKgFat / calInKgMuscle; // 2.25
        const caloriesFromFatToMuscle = totalCaloriesForFatDelta * fatToMuscleCoversionRatio * params.fatToMuscleRecompPcent / 100;

        const adjustedCaloriesForFatDelta = totalCaloriesForFatDelta + caloriesFromFatToMuscle;
        const adjustedTotalFatDelta = adjustedCaloriesForFatDelta / calInKgFat; 
        const adjustedCaloriesForMuscleDelta = totalCaloriesForMuscleDelta - caloriesFromFatToMuscle;
        const adjustedTotalMuscleDelta = adjustedCaloriesForMuscleDelta / calInKgMuscle;

        const totalCaloriesForWeightDelta = adjustedCaloriesForFatDelta + adjustedCaloriesForMuscleDelta;
        const durWeeks = totalCaloriesForWeightDelta / totalCalorieBurnPerWeek;
        setDurationWeeks(durWeeks.toFixed(2));
        setDurationMonths((durWeeks/4).toFixed(2));
        const totalWtDeltaRequired = adjustedTotalFatDelta + adjustedTotalMuscleDelta; 
        setExpectedWtDelta((totalWtDeltaRequired/durWeeks).toFixed(2));
        
        setExpectedFatDelta((adjustedTotalFatDelta/durWeeks).toFixed(2));
        setExpectedMuscleDelta((adjustedTotalMuscleDelta/durWeeks).toFixed(2));
        
        const calIntake = params.bmr + params.calDelta;
        setCalorieIntake(calIntake.toFixed());

        setProteinSplitGrams((calIntake*params.proteinSplitPcent/100/4).toFixed(2));
        setCarbsSplitGrams((calIntake*params.carbsSplitPcent/100/4).toFixed(2));
        setFatSplitGrams((calIntake*params.fatSplitPcent/100/9).toFixed(2));
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            calculate();
        }
    }

    useEffect(() => {
     calculate();
    }, [params.activeCal, params.calDelta, params.fatToMuscleRecompPcent])

    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Input label="Current Weight" name="currentWt" value={params.currentWt} unit="kg" handleChange={onInput} handleKeyUp={handleKeyUp} />
                <Input label="Ideal Weight" name="idealWt" value={params.idealWt} unit="kg" handleChange={onInput} handleKeyUp={handleKeyUp} />
                <Input label="Current Fat" name="currentFat" value={params.currentFat} unit="%" handleChange={onInput} handleKeyUp={handleKeyUp} />
                <Input label="Ideal Fat" name="idealFat" value={params.idealFat} unit="%" handleChange={onInput} handleKeyUp={handleKeyUp} />
                <Input label="BMR" name="bmr" value={params.bmr} unit="kcal" handleChange={onInput} handleKeyUp={handleKeyUp} />
            </div>
            <div className="mt-4 first-line:grid gap-4 md:grid-cols-2">
                <Slider label="Calorie Delta" name="calDelta" value={params.calDelta} min={-1000} max={1000} unit="kcal" handleChange={onInput} />
                <Slider label="Active Calories" name="activeCal" value={params.activeCal} min={0} max={2000} unit="kcal" handleChange={onInput} />
                <Slider label="Fat to Muscle recomposition" name="fatToMuscleRecompPcent" value={params.fatToMuscleRecompPcent} min={0} max={100} step={0.1} unit="%" handleChange={onInput} />
            </div>
            <br/>
            <hr></hr>
            <br/>
            <div className="mt-4 grid gap-4 ">
                <div className="grid gap-4 md:grid-cols-2">
                    <p></p>
                    <OutputRow label="Calorie Intake" value={calorieIntake} unit="kcal" />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Input label="Protein Split" name="proteinSplitPcent" value={params.proteinSplitPcent} unit="%" handleChange={onInput} handleKeyUp={handleKeyUp} />
                        <Input label="Carbs Split" name="carbsSplitPcent" value={params.carbsSplitPcent} unit="%" handleChange={onInput} handleKeyUp={handleKeyUp} />
                        <Input label="Fat Split" name="fatSplitPcent" value={params.fatSplitPcent} unit="%" handleChange={onInput} handleKeyUp={handleKeyUp} />
                    </div>
                    <div className="mt-4 grid gap-4">
                        <OutputRow label="Protein" value={proteinSplitGrams} unit="g" />
                        <OutputRow label="Carbs" value={carbsSplitGrams} unit="g" />
                        <OutputRow label="Fat" value={fatSplitGrams} unit="g" />
                    </div>
                </div>
            </div>
            <br/>
            <hr></hr>
            <br/>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <OutputRow label="Expected Weight Delta" value={expectedWtDelta} unit="kg/week" />
                <OutputRow label="Duration" value={durationWeeks} unit="weeks" />
                <OutputRow label="Expected Fat Delta" value={expectedFatDelta} unit="kg/week" />
                <OutputRow label="Duration" value={durationMonths} unit="Months" />
                <OutputRow label="Expected Muscle Delta" value={expectedMuscleDelta} unit="kg/week" />
            </div>
        </div>
    );
}

export default App;
