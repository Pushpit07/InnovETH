import Image from "next/image";

export default function FeatureCard({imgSrc, body}){
    return(
        <div className="max-w-[350px] rounded-[3rem] bg-[#FFE3D3] py-[84px] px-[48px] flex flex-col items-start pb-[48px]">
            <Image className="justify-self-start" src={imgSrc} objectFit="contain" alt="feature"/>
            <p className="text-[#1D1D1D] font-medium text-xl mt-12">{body}</p>
        </div>
    );
}