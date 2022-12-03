import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function Comment(data){
    const mintDate = new Date(proposal.block_timestamp).getTime();
    const now = new Date().getTime();
    const distance = now- mintDate;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    return(
        <div>
            <div className="flex items-center space-x-5">
                <Image className="rounded-full" alt="author" width={84} height={84} src={data.user.avatar}/>
                <div className="flex flex-col">
                    <p className="text-xl font-medium font-primary">Posted by- {data.user.name}</p>
                    <p className="text-xs font-medium font-primary">Posted {days} Days ago</p>
                </div>
            </div>
            
            <div className="flex flex-col">
                <h1>{data.name}</h1>
                <ReactMarkdown>{data.description}</ReactMarkdown>
            </div>
        </div>
    );
}