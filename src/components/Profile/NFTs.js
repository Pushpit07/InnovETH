import { useState, useEffect } from "react";
import NFTCard from "../../layout/NFTCard/NFTCard";
import NFTCardsWithPager from "../../layout/NFTCardsWithPager/NFTCardsWithPager";
import NoNfts from "./NoNfts";

export default function NFTs({ username, proposals }) {
	const [nftCards, setNftCards] = useState([]);

	useEffect(() => {
		let tempArray = [];
		const nftCardsTemp = [];

		if (proposals.length > 0) {
			proposals.map((proposal, idx) => {
				tempArray.push(
					<NFTCard
						key={proposal.proposalId}
						redirectLink={`/brainstorming-corner/${proposal.proposalId}`}
						proposalId={proposal.proposalId}
						name={proposal.name}
						creatorName={proposal.creator.name}
						summary={proposal.summary}
						image={"https://gateway.musixverse.com/ipfs/bafkreicwvbpgtdiyoj2d2tcfyd7mgrwwn46rlfrtvl4qvumv5uk7od745m" || proposal.image}
						description={proposal.description}
						// image={proposal.artwork.uri.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_NODE_URL)}
					/>
				);

				if (tempArray.length % 5 == 0 || idx == proposals.length - 1) {
					nftCardsTemp.push(tempArray);
					tempArray = [];
				}
			});
		}

		setNftCards(nftCardsTemp);
	}, [proposals]);

	return <>{nftCards.length === 0 ? <NoNfts username={username} /> : <NFTCardsWithPager nftCards={nftCards} />}</>;
}
