import Image from "next/image";
import Link from "next/link";

export default function HubCard({item, isFirst}){
    const mintDate = new Date(item.block_timestamp).getTime();
    const now = new Date().getTime();
    const distance = now- mintDate;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const chain = item.chain? (item.chain.toLowercase() === 'matic'? 'polygon':'cronos'):'polygon';
    
    return(
        <div className={"flex flex-col py-16 px-20 rounded-[4.5rem] bg-[#E8E8FF] "+(isFirst?"w-full":"w-[50%]")}>
            <div className="flex justify-between w-full">
                <h1 className="text-5xl font-semibold max-w-[79%] mb-7">{item.name}</h1>
                <Link href={`/brainstorming-corner/${chain}/${item.proposalId}`} passHref>
                    <a className="rounded-xl w-[65px] flex items-center justify-center h-[65px] text-white text-4xl bg-[#8181FF]"><span className="text-4xl material-symbols-outlined">arrow_right_alt</span></a>
                </Link>
            </div>
            <p className="text-xl font-medium font-primary">{item.summary}</p>
            {item.videoUrl && <p className="text-xl font-medium font-primary mt-7">Watch this video to know more: {item.videoUrl}</p>}
            <div className="my-12 flex-grow border-t-[4px] border-[#E6D4FF]"></div>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-5">
                    {item.authorAvatar && <div className="rounded-full w-[84px] h-[84px] relative overflow-hidden">
                        <Image alt="author" src={item.user.avatar} objectFit="contain" priority/>
                    </div>}
                    <div className="flex flex-col">
                        <p className="text-xl font-medium font-primary">Posted by- {item.user.name}</p>
                        <p className="text-xs font-medium font-primary">Posted {days} Days ago</p>
                    </div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                    <button className="rounded-full w-[60px] h-[60px] flex items-center justify-center bg-white text-black"><span className="material-symbols-outlined">bookmark</span></button>
                    <p>Bookmark</p>
                </div>
            </div>
        </div>
    );
}