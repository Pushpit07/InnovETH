import Image from "next/image";
import ShinyLoader from "../../layout/ShinyLoader";
import styles from "../../../styles/Profile/Banner.module.css";

export default function Banner({ coverImage }) {
	return (
		<div className={styles["artist-banner__container"]}>
			{coverImage ? (
				<Image
					priority
					src={coverImage || "https://ipfs.moralis.io:2053/ipfs/Qmcn1aZ4PKUUzwpTncuSbruwLD98dtiNqvoJG5zm8EMwXZ"}
					layout="fill"
					objectFit="cover"
					alt="Artist cover image"
				/>
			) : (
				<ShinyLoader />
			)}
		</div>
	);
}
