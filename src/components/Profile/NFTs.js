import { useState, useEffect } from "react";
import NFTCard from "../../layout/NFTCard/NFTCard";
import NFTCardsWithPager from "../../layout/NFTCardsWithPager/NFTCardsWithPager";
import NoNfts from "./NoNfts";

export default function NFTs({ username, tracks, currentlyActive, isBand }) {
	const [nftCards, setNftCards] = useState([]);

	useEffect(() => {
		let tempArray = [];
		const nftCardsTemp = [];

		if (tracks.length > 0) {
			tracks.map((track, idx) => {
				let collaboratorList = [];
				track.collaborators.map((collaborator) => {
					track.collaboratorUsers.map((collaboratorUser) => {
						collaborator.address === collaboratorUser.ethAddress && collaboratorList.push(collaboratorUser);
					});
				});

				tempArray.push(
					<NFTCard
						key={track.tokenId}
						redirectLink={`/track/polygon/${track.tokenId}`}
						trackId={track.trackId}
						audio={track.audio.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_NODE_URL)}
						trackName={track.title}
						price={track.price}
						artistName={track.artist}
						artistAddress={track.artistAddress}
						isArtistVerified={track.isArtistVerified}
						image={track.artwork.uri.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_NODE_URL)}
						tokenId={track.tokenId}
						localTokenId={track.localTokenId}
						numberOfCopies={track.numberOfCopies}
						collaboratorList={collaboratorList}
						otherTokensOfTrack={track.otherTokensOfTrack}
						showNumberOfCopies={currentlyActive === "Collection" ? false : true}
						tokenInCollectionOwnedByBandMember={isBand && currentlyActive === "Collection" ? track.bandMember.name : null}
					/>
				);

				if (tempArray.length % 5 == 0 || idx == tracks.length - 1) {
					nftCardsTemp.push(tempArray);
					tempArray = [];
				}
			});
		}

		setNftCards(nftCardsTemp);
	}, [tracks]);

	return <>{nftCards.length === 0 ? <NoNfts username={username} /> : <NFTCardsWithPager nftCards={nftCards} />}</>;
}
