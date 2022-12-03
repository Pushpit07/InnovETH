import CollaboratorImage from "./CollaboratorImage";
import styles from "../../../styles/NFTCard/Section2.module.css";
import ShinyLoader from "../../layout/ShinyLoader";

export default function Section2({ collaboratorList, numberOfCopies, tokenId, localTokenId, unsoldTrackData, lastPrice }) {
	// const likeBtn = useRef();
	// let likeCount = props.likeCount;

	// const handleLikeClick = () => {
	//     const likeCounter = likeBtn.current.children[1];
	//     const isLiked = likeBtn.current.classList.contains("text-red-500");

	//     if (!isLiked) {
	//         likeBtn.current.classList.add("text-red-500");
	//         likeCounter.textContent = ++likeCount;
	//         // NOTE: Make a call to Increment the likes on the moralis server also!
	//     } else {
	//         likeBtn.current.classList.remove("text-red-500");
	//         likeCounter.textContent = --likeCount;
	//         // NOTE: Make a call to Decrement the likes on the server!dzsf
	//     }
	// };

	return (
		<div className={styles["nft-card__description--section2"]}>
			{/* Like button */}
			{/* <button className="text-sm bg-transparent " ref={likeBtn} onClick={handleLikeClick}>
                <i className="mr-2 far fa-heart"></i>
                <span>{props.likeCount}</span>
            </button> */}

			{/* Collaborator Images */}
			{localTokenId ? (
				<div className="flex items-end justify-between font-secondary text-[#1D1D1D] dark:text-light-200 text-xs">
					<div className="flex items-end -space-x-2"></div>

					<span className="dark:text-[#818181]">#{localTokenId}</span>
				</div>
			) : (
				<ShinyLoader classes="w-full h-4 mt-2 self-center rounded-lg" />
			)}
		</div>
	);
}
