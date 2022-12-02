import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import B_artist_mic from "../../../../public/assets/registration/B_Artist.svg";
import W_artist_mic from "../../../../public/assets/registration/W_Artist.svg";
import B_collection_category from "../../../../public/assets/registration/B_collector.svg";
import W_collection_category from "../../../../public/assets/registration/W_collector.svg";

export default function Register_sub({ innovator }) {
	const { theme } = useTheme();

	return (
		<Link href={innovator ? "/register/innovator" : "/register/company"} passHref>
			<div className="flex items-start justify-between p-3 space-x-4 cursor-pointer bg-light-200 dark:bg-dark-600 dark:hover:bg-dark-800 hover:bg-light-100 rounded-xl">
				<div className="flex items-start space-x-3">
					{theme === "dark" ? (
						<Image src={innovator ? W_artist_mic : W_collection_category} width={32} height={32} alt="artist_mic" />
					) : (
						<Image src={innovator ? B_artist_mic : B_collection_category} width={32} height={32} alt="artist_mic" />
					)}
					<div className="pr-8 sm:pr-10">
						<p className="mb-1 text-2xl leading-none sm:text-4xl font-tertiary">{innovator ? "INNOVATOR" : "COMPANY/PROJECT"}</p>
						<p className="text-[13px] sm:text-[15px] font-secondary leading-tight sm:max-w-[340px]">
							{innovator
								? "An innovator can browse & create posts. No profile verification required"
								: "A company/project can browse & create posts. Companies will be asked to verify their profile"}
						</p>
					</div>
				</div>
				<button className="font-light dark:text-primary-600 text-[15px] sm:text-[18px] flex items-center justify-center p-4 rounded-xl bg-light-300 dark:bg-dark-800 dark:hover:bg-dark-600 hover:bg-[#b3c4c2] cursor-pointer">
					<i className="fa fa-arrow-right"></i>
				</button>
			</div>
		</Link>
	);
}
