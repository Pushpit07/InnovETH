import doc from "../../../public/assets/home/docs.svg";
import research from "../../../public/assets/home/research.svg"
import blockchain from "../../../public/assets/home/blockchain.svg"
import expand from "../../../public/assets/home/expand.svg"
import FeatureCard from "./Utils/FeatureCard";
import Image from "next/image";
import digitalArt from "../../../public/assets/home/digitalArt.svg";

export default function Section3(){
    return (
        <>
            <div className="flex flex-col justify-between w-full max-w-[1920px] my-24">
                <div className="flex justify-between w-full mb-24">
                    <FeatureCard
                        imgSrc={expand}
                        body="Bridging the gap between those seeking to innovate and those who are eager to aid developers."
                    />
                    <FeatureCard
                        imgSrc={blockchain}
                        body="Facilitate research and development in the blockchain space."
                    />
                    <FeatureCard
                        imgSrc={research}
                        body="Brainstorm and build on innovative ideas with other builders."
                    />
                    <FeatureCard
                        imgSrc={doc}
                        body="Providing the necessary resources & connections needed by innovators & researchers to move blockchain & web3 forward."
                    />
                </div>
                <Image className="self-center mb-24 justify-self-center" objectFit="contain" src={digitalArt} alt="digital art" priority />
            </div>
        </>
    );
}