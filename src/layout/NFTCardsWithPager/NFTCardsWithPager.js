import { useState } from "react";
import Pager from "./Pager";

export default function NFTCardsWithPager({ nftCards }) {
	const [currentPage, setCurrentPage] = useState(0);

	return (
		<>
			<div className="grid grid-cols-1 justify-items-center gap-6 my-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:my-11 md:gap-11">{nftCards[currentPage]}</div>
			{nftCards.length > 1 ? <Pager onPageChange={setCurrentPage} maxPages={nftCards.length} /> : null}
		</>
	);
}
