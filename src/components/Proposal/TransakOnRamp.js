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
		<button className="bg-[#3D0B56] px-16 py-3 text-lg text-white rounded-xl" onClick={() => onrampCall()}>
			Get crypto and Tip
		</button>
	);
}
