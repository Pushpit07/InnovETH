import { useContext } from "react";
import Image from "next/image";
import LoadingContext from "../../../store/loading-context";
import TransakOnRamp from "../Proposal/TransakOnRamp";
import { joinDiscussion } from "../../utils/smart-contract/functions";
import { useRouter } from "next/router";

export default function DiscussionIntro({ proposal, handleJoin, proposalId, userHasJoined }) {
	const router = useRouter();
	const [, setLoading] = useContext(LoadingContext);

	const mintDate = new Date(proposal.block_timestamp).getTime();
	const now = new Date().getTime();
	const distance = now - mintDate;
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));

	return (
		<div className="w-screen bg-[#E6D4FF] flex flex-col items-center justify-center pt-32 pb-7">
			<div className="w-full max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36 flex justify-between items-center">
				<div className="flex items-center space-x-5">
					<Image className="rounded-full" alt="author" width={84} height={84} src={proposal.user.avatar} />
					<div className="flex flex-col">
						<p className="text-xl font-medium font-primary">Posted by- {proposal.user.name}</p>
						<p className="text-xs font-medium font-primary">Posted {days} Days ago</p>
					</div>
				</div>
				{/* TODO: JOIN BUTTON FUNCTIONALITY */}
				<div className="space-x-5">
					{userHasJoined ? (
						<button
							className="bg-[#3D0B56] px-16 py-3 text-lg text-white rounded-xl"
							onClick={async () => {
								await handleJoin();
							}}
						>
							Huddle now
						</button>
					) : (
						<button
							onClick={async () => {
								setLoading(true);
								await joinDiscussion(proposalId);
								setLoading(false);
								router.reload(window.location.pathname);
							}}
							className="bg-[#3D0B56] text-lg px-16 py-3 text-white rounded-xl"
						>
							Join
						</button>
					)}
					<TransakOnRamp />
				</div>
			</div>
			<div className="flex flex-col pt-7 bg-[#E6D4FF] w-full max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
				<h1 className="font-semibold text-[#1D1D1D] text-4xl px-24">{proposal.name}</h1>
				<p className="font-medium text-xl text-[#2E2E2E] mt-5 px-24">{proposal.summary}</p>
			</div>
		</div>
	);
}
