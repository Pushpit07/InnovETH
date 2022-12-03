import DiscussionIntro from "./DiscussionIntro";

export default function Discussion({proposal, handleJoin}){
    return(
        <div className="flex flex-col">
            <DiscussionIntro proposal={proposal} handleJoin={handleJoin}/>
        </div>
    );
}