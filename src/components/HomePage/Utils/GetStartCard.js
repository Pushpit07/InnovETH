import Link from "next/link";

export default function GetStartCard({body, ctaText, ctaAction}){
    return(
        <div className="bg-[#D7FFD4] py-[90px] px-[60px] flex flex-col justify-between rounded-[4.5rem] w-[50%] pb-[60px]">
            <p className="text-[#1D1D1D] font-medium text-xl max-w-[90%]">{body}</p>
            <Link passHref href={`${ctaAction}`}>
                <button className="self-start mt-16 bg-[#3D0B56] px-10 py-3 text-lg text-white rounded-xl">{ctaText}</button>
            </Link>
        </div>
    );
}