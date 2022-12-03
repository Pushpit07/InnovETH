import Image from "next/image";
import section2 from "../../../public/assets/home/sec2.svg";

export default function Section2(){
    return(
        <div className="flex justify-between items-center w-full max-w-[1920px] py-14 px-20 bg-[#E8E8FF] rounded-[4.5rem]">
            <div className="flex flex-col">
                <h1 className="font-semibold mb-10 text-[#1D1D1D] text-5xl">What is InnovETH?</h1>
                <p className="w-[49%] text-[#2E2E2E] font-medium text-xl">InnovETH is a platform that fosters a supportive and inspiring atmosphere for innovation in the blockchain domain.</p>
            </div>
            <Image src={section2} priority objectFit="contain" alt="digital assets"/>
        </div>
    );
}