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
		<button className="px-6 py-2 bg-[#3D0B56] text-light-100 rounded-full" onClick={() => onrampCall()}>
			Get crypto and Tip
		</button>
	);
}
