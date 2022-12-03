import Head from "next/head";
import Moralis from "moralis/node";
import { useMoralis } from "react-moralis";
import { meta_description, PARSE_APP_ID, PARSE_SERVER_URL } from "../../constants";
import HuddleModal from "../../components/Corner/HuddleModal";
import { useState } from "react";
import { getHuddleClient } from "@huddle01/huddle01-client";

export async function getStaticProps(context) {
	const { proposalId } = context.params;
	await Moralis.start({ serverUrl: PARSE_SERVER_URL, appId: PARSE_APP_ID });

	try {
		// Fetch token details
		const _proposalDetails = await Moralis.Cloud.run("fetchProposalDetails", { proposalId: proposalId });
		const proposalDetails = JSON.parse(JSON.stringify(_proposalDetails));

		// Passing data to the Page using props
		return {
			props: {
				proposalId,
				proposalDetails,
			},
			revalidate: 1,
		};
	} catch (error) {
		return { notFound: true, revalidate: 1, props: {} };
	}
}

export function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	};
}

export default function TrackInfo({ proposalId, proposalDetails }) {
	const { user } = useMoralis();
	const [isHuddleModalOpen, setHuddleModalOpen] = useState(false);
	const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);
	const handleJoin = async () => {
		try {
			await huddleClient.join(proposalId, {
				address: user.attributes.ethAddress,
			});
			console.log("joined huddle");
		} catch (error) {
			console.log({ error });
		}
	};

	return (
		<>
			<Head>
				<title>{"InnovETH | Proposal: " + proposalDetails.name}</title>
				<meta name="description" content={meta_description}></meta>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
			</Head>

			<div className="flex flex-col items-center justify-center w-full pb-20 bg-light-100 dark:bg-dark-900 pt-28">
				<div className="w-full max-w-[1920px] px-10 sm:px-16 xl:px-20 2xl:px-36">
					<div className="flex gap-x-8">
						<h1 className="text-2xl font-medium">{proposalDetails.name}</h1>
						<button
							type="button"
							onClick={async () => {
								setHuddleModalOpen(true);
								await handleJoin();
							}}
							className="bg-primary-200 rounded-full px-8 py-2 text-light-100"
						>
							Huddle now
						</button>
					</div>
					<div className="mt-10">{proposalDetails.description}</div>
				</div>
			</div>

			<HuddleModal isOpen={isHuddleModalOpen} setOpen={setHuddleModalOpen} />
		</>
	);
}
