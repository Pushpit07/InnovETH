import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";

const NftCopiesRow = ({ token, trackName }) => {
	const { Moralis } = useMoralis();

	return (
		<>
			<Link href={`/track/polygon/${token.tokenId}`} passHref>
				<a className="flex py-2 px-4 rounded-lg hover:bg-light-300 dark:hover:bg-dark-800">
					<div className="flex justify-between w-full">
						<p className="font-bold font-secondary">
							{"#"}
							{token.localTokenId} {trackName}
						</p>
						<div className="flex items-center justify-end font-semibold">
							<Image src={"/assets/matic-logo.svg"} width={16} height={16} alt="matic logo" />
							<span className="ml-1 sm:text-lg">{Moralis.Units.FromWei(token.price)}</span>
						</div>
					</div>
				</a>
			</Link>
			<div className="border-t-[2px] border-light-300 dark:border-zinc-700 my-1" />
		</>
	);
};

export default NftCopiesRow;
