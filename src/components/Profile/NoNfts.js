import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";

export default function NoNfts({ username, favouritesSection = false }) {
	const { user } = useMoralis();

	return (
		<div className="flex flex-col items-center justify-center w-full p-20 mt-10 mb-20 rounded-xl dark:bg-dark-600 bg-light-100">
			<div className="mb-5 rounded-full flex items-center justify-center w-[120px] h-[120px] bg-light-200 dark:bg-dark-800">
				<Image src={"/assets/profile/no-nfts.svg"} width={70} height={42} alt="music jazz" />
			</div>

			<div className="flex flex-col items-center space-y-3">
				{user && username === user.attributes.username ? (
					<p className="mb-8 font-secondary">You don&apos;t have any items to display</p>
				) : (
					<p className="mb-8 font-secondary">No items to display</p>
				)}

				{/* If artist then render create nft other wise buy nft */}
				{user && username === user.attributes.username && !favouritesSection ? (
					<Link href={"/create-proposal"} passHref>
						<button className="py-2 font-medium text-center px-14 hover:bg-primary-600 bg-primary-500 rounded-3xl text-light-100">
							Create Proposal
						</button>
					</Link>
				) : (
						<></>
					)
				}
			</div>
		</div>
	);
}
