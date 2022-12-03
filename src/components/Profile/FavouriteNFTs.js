import { useState, useEffect } from "react";
import NFTCard from "../../layout/NFTCard/NFTCard";
import NFTCardsWithPager from "../../layout/NFTCardsWithPager/NFTCardsWithPager";
import NoNfts from "./NoNfts";

export default function FavouriteNFTs({ username, favouriteTokens, isBand }) {
	const [nftCards, setNftCards] = useState([]);

	useEffect(() => {
		if (favouriteTokens) {
			let tempArray = [];
			const nftCardsTemp = [];

			favouriteTokens.map((token, idx) => {
				let collaboratorList = [];
				token.collaborators.map((collaborator) => {
					token.collaboratorUsers.map((collaboratorUser) => {
						collaborator.address === collaboratorUser.ethAddress && collaboratorList.push(collaboratorUser);
					});
				});

				tempArray.push(
					<NFTCard
						key={token.tokenId}
						redirectLink={`/track/polygon/${token.tokenId}`}
						trackId={token.trackId}
						audio={token.audio.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_NODE_URL)}
						trackName={token.title}
						price={token.price}
						artistName={token.artist}
						artistAddress={token.artistAddress}
						isArtistVerified={token.isArtistVerified}
						image={token.artwork.uri.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_NODE_URL)}
						tokenId={token.tokenId}
						localTokenId={token.localTokenId}
						numberOfCopies={token.numberOfCopies}
						collaboratorList={collaboratorList}
						otherTokensOfTrack={token.otherTokensOfTrack}
						favouriteOfBandMember={isBand ? token.bandMember.name : null}
					/>
				);
				if (tempArray.length % 5 == 0 || idx == favouriteTokens.length - 1) {
					nftCardsTemp.push(tempArray);
					tempArray = [];
				}
			});
			setNftCards(nftCardsTemp);
		}
	}, [favouriteTokens, isBand]);

	return <>{nftCards.length === 0 ? <NoNfts username={username} favouritesSection={true} /> : <NFTCardsWithPager nftCards={nftCards} />}</>;
}
