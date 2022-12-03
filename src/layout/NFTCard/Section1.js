import { useState, useEffect } from "react";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../../../styles/NFTCard/Section1.module.css";
import { truncatePrice } from "../../utils/GetMarketPrice";
import ShinyLoader from "../../layout/ShinyLoader";

export default function Section1({ artistName, trackName, price, isArtistVerified, soldOnceTrackData }) {
	const { Moralis } = useMoralis();
	const [tokenPrice, setTokenPrice] = useState("");

	useEffect(() => {
		if (price) {
			setTokenPrice(Moralis.Units.FromWei(price));
		}
	}, [price, Moralis.Units]);

	const truncatednftPrice = truncatePrice(tokenPrice);

	return (
		<div className={styles["nft-card__description--section1"]}>
			{/* SONG and ARTIST NAME SECTION */}
			<div className={artistName && trackName && truncatednftPrice ? "max-w-full fit-content" : "w-full"}>
				<div className={styles["description--section1__artistname"]}>
					{artistName ? artistName : <ShinyLoader classes="w-4/5 h-4 self-center rounded-lg" />}
					{isArtistVerified ? (
						<span className="flex items-center ml-1">
							<Image src={"/assets/mxv_tick.svg"} width={14} height={14} alt="MXV verified" />
						</span>
					) : null}
				</div>
				{/* Marquee animation when long text */}
				{trackName && trackName.length > 8 ? (
					<div className="w-[104px] md:w-[115px] relative flex overflow-x-hidden">
						<div className="animate-marquee whitespace-nowrap">
							<h6 className={"mr-4 " + styles["description--section1__trackname"]}>{trackName}</h6>
						</div>
						<div className="absolute top-0 animate-marquee2 whitespace-nowrap">
							<h6 className={"mr-4 " + styles["description--section1__trackname"]}>{trackName}</h6>
						</div>
					</div>
				) : (
					<h6 className={styles["description--section1__trackname"]}>
						{trackName ? trackName : <ShinyLoader classes="w-2/3 h-4 mt-2 self-center rounded-lg" />}
					</h6>
				)}
			</div>
		</div>
	);
}
