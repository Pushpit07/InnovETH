import { useEffect, useState } from "react"

export default function HeroSection(){

    // const [checkedText, setCheckedText] = useState(0);

    // useEffect(()=>{
    //     setInterval(()=>{
    //         // console.log(checkedText);
    //         setCheckedText((prev)=>{console.log(prev); return (prev+1)%3});
    //     }, 5000);
    // },[])

    return (
        <div className="flex items-center justify-center w-screen bg-[#E6D4FF]">
            <div className="w-full max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36 h-screen max-h-[820px] flex flex-col items-center justify-center">
                <h3 className="text-3xl font-semibold">Unlocking Infinite Possibilities with Web3</h3>
                {/* <div className="hidden">
                    <input name="checkboxes" type='radio' id="c1" readOnly checked={checkedText === 0}/>
                    <input type='radio' name="checkboxes" id="c2" readOnly checked={checkedText === 1}/>
                    <input type='radio' id="c3" name="checkboxes" readOnly checked={checkedText === 2}/>
                </div> */}
                <h1 className="text-[96px] font-semibold" id="check1">Built for People</h1>
                {/* <h1 className="typed-out text-[96px] font-semibold" id="check2">Built for Innovators</h1>
                <h1 className="typed-out text-[96px] font-semibold" id="check3">Built for Explorers</h1> */}
            </div>
        </div>
    )
}