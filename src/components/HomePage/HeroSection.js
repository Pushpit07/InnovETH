import Image from "next/image"
import { useEffect, useState } from "react"
import platform from "../../../public/assets/home/platform.svg";
import heroBG from "../../../public/assets/home/heroBG.svg";

export default function HeroSection(){
    return (
        <div className="flex items-center justify-between w-screen bg-[#E6D4FF] flex-col">
            <div className="w-full max-w-[1920px] pt-48 px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36 flex flex-col items-center justify-center">
                <Image src={platform} alt="platform name"/>
                <h1 className="font-semibold text-[#434343] font-primary text-[69px] mt-3">Where Ideas Never Die</h1>
            </div>
            <div className="w-full">
                <Image src={heroBG} layout="responsive" priority alt="bg art"/>
            </div>
        </div>
    )
}