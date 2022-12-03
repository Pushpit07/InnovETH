import Transak from "@biconomy/transak";
import { useMoralis } from "react-moralis";

export default function Proposal({ proposalId, proposalDetails }) {
	// init the widget
	// const transak = new Transak("STAGING");
	// transak.init();
	const { user } = useMoralis();

	// use this info for transak package
	const onrampCall = () => {
		const transak = new Transak("STAGING", {
			walletAddress: user?.attributes.ethAddress,
			userData: {
				firstName: user?.attributes.name || "",
				email: user?.attributes.email || "",
			},
		});
		transak.init();
	};

	return (
		<div className="flex flex-col items-center justify-center w-full pb-20 bg-light-100 dark:bg-dark-900 pt-28">
			<div className="w-full max-w-[1920px] px-10 sm:px-16 xl:px-20 2xl:px-36">
				<button className="px-6 py-2 bg-primary-100 hover:bg-primary-200 text-light-100 rounded-full" onClick={() => onrampCall()}>
					Get crypto and Tip
				</button>
			</div>
		</div>
	);
}
