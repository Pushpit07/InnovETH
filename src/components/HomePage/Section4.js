import GetStartCard from "./Utils/GetStartCard";

export default function Section4(){
    return(
        <div className="flex flex-col mb-24">
            <h1 className="text-[69px] font-semibold my-10 text-center">Build for People</h1>
            <div className="flex justify-between space-x-20">
                <GetStartCard
                    body={"Don’t bury your innovative ideas! Through “Brainstorming Corner” brainstorm with other innovators and let your ideas take flight!"}
                    ctaText="Start Innovating"
                    ctaAction={"/innovation-hub"}
                />
                <GetStartCard
                    body={"Through “Innovation Hub” get the push start to start working on the ideas provided by Web3 companies and projects. Wanted to work on Zero Knowledge, but don’t know how? Where to start? How to research? Get help from mentors along the way."}
                    ctaText="Join Others"
                    ctaAction={"/innovation-hub"}
                />
            </div>
        </div>
    );
}