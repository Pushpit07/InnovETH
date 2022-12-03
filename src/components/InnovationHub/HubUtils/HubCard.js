import Image from "next/image";

export default function HubCard({item}){
    const mintDate = new Date(item.block_timestamp).getTime();
    const now = new Date().getTime();
    const distance = now- mintDate;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    return(
        <div className="flex flex-col w-full py-16 px-20 rounded-[4.5rem] bg-[#E8E8FF]">
            <h1 className="text-5xl font-semibold max-w-[79%] mb-7">{item.name}</h1>
            <p className="text-xl font-medium font-primary">{item.summary}</p>
            {item.videoUrl && <p className="text-xl font-medium font-primary mt-7">Watch this video to know more: {item.videoUrl}</p>}
            <div className="my-12 flex-grow border-t-[4px] border-[#E6D4FF]"></div>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-5">
                    {item.authorAvatar && <div className="rounded-full w-[84px] h-[84px] relative overflow-hidden">
                        <Image alt="author" src={item.authorAvatar} objectFit="contain" priority/>
                    </div>}
                    <div className="flex flex-col">
                        <p className="text-xl font-medium font-primary">Posted by- {item.author}</p>
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