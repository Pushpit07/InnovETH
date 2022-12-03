import Head from "next/head";
import Moralis from "moralis/node";
import { PARSE_APP_ID, PARSE_SERVER_URL, meta_description } from "../../constants";

export async function getServerSideProps(context) {
	try {
		await Moralis.start({ serverUrl: PARSE_SERVER_URL, appId: PARSE_APP_ID });

		const _proposals = await Moralis.Cloud.run("fetchProposals");
		const proposals = JSON.parse(JSON.stringify(_proposals));

		return {
			props: { proposals }, // will be passed to the page component as props
		};
	} catch (error) {
		return { notFound: true, props: {} };
	}
}

const InnovationHub = ({ proposals }) => {
	return (
		<>
			<Head>
				<title>InnovETH | Innovation Hub</title>
				<meta name="description" content={meta_description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="h-screen w-screen relative flex flex-col items-center bg-light-200">
				<h1 className="mt-40 mb-4 text-5xl font-semibold text-center font-primary">Innovation Hub</h1>
			</div>
		</>
	);
};

export default InnovationHub;
