import Head from "next/head";
import Moralis from "moralis/node";
import { useMoralis } from "react-moralis";
import { meta_description, PARSE_APP_ID, PARSE_SERVER_URL } from "../../../constants";
import HuddleModal from "../../../components/Corner/HuddleModal";
import { useState } from "react";
import { getHuddleClient } from "@huddle01/huddle01-client";
import Discussion from "../../../components/Corner/Discussion";

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

export default function Proposal({ proposalId, proposalDetails }) {
	const { user } = useMoralis();
	const [isHuddleModalOpen, setHuddleModalOpen] = useState(false);
	const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);

	const handleJoin = async () => {
		setHuddleModalOpen(true);
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

			<Discussion proposal={proposalDetails} handleJoin={handleJoin} />

			<HuddleModal isOpen={isHuddleModalOpen} setOpen={setHuddleModalOpen} />
		</>
	);
}
