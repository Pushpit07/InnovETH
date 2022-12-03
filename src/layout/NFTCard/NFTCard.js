import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import styles from "../../../styles/NFTCard/Nftcard.module.css";
import ShinyLoader from "../../layout/ShinyLoader";
import Section1 from "./Section1";
import Section2 from "./Section2";

export default function NFTCard({ redirectLink, proposalId, creatorName, name, summary, image, description }) {
	const { theme } = useTheme();

	const truncatedName = useMemo(() => {
		let returnedString = name;
		if (name && name.length > 14) returnedString = name.substring(0, 14) + "...";
		return returnedString;
	}, [name]);

	return (
		<>
			<div className={"group " + styles[theme === "dark" ? "nft-card-dark" : "nft-card"]}>
				{/* NFT Image */}
				<div className="relative w-full h-60">
					{image && redirectLink ? (
						<Link href={redirectLink} passHref>
							<a>
								<div className="relative w-full h-full">
									<Image
										src={image}
										alt="nft image"
										objectFit="cover"
										layout="fill"
										priority
										className={"group-hover:scale-110 group-hover:duration-500 duration-500 " + styles["nft-image"]}
									/>
								</div>
							</a>
						</Link>
					) : (
						<ShinyLoader />
					)}
				</div>

				{/* NFT Details */}
				<Link href={redirectLink ? redirectLink : ""} passHref>
					<a>
						<div className={"dark:bg-dark-600 " + styles["nft-card__description"]}>
							{/* Artist, Music name and tokenId */}
							<Section1 artistName={creatorName} trackName={name} />
							{/* LIKES and Prev Price Section */}
							<Section2 localTokenId={proposalId} />
						</div>
					</a>
				</Link>
			</div>
		</>
	);
}
