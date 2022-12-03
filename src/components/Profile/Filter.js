import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useMoralisCloudFunction } from "react-moralis";
import Dropdown from "./ProfileUtils/Dropdown";
import styles from "../../../styles/Profile/Filter.module.css";

export default function Filter({
	username,
	currentlyActive,
	setCurrentlyActive,
	sortingFilter,
	setSortingFilter,
	isArtist,
	isBand,
	setTracks,
	profileDetails,
}) {
	const { theme } = useTheme();

	const handleFilterChange = (e) => {
		const selectedCategory = e.target.textContent;

		if (selectedCategory == "New Releases") {
			setCurrentlyActive("New Releases");
			setTracks(profileDetails.newReleases);
			setSortingFilter("Newest First");
		} else if (selectedCategory == "Sold Out") {
			setCurrentlyActive("Sold Out");
			setTracks(profileDetails.soldOut);
			setSortingFilter("Newest First");
		} else if (selectedCategory == "Collection") {
			setCurrentlyActive("Collection");
			setTracks(profileDetails.collection);
			setSortingFilter("Newest First");
		}
	};

	const { fetch: fetchTracksByUser } = useMoralisCloudFunction(
		"fetchTracksByUser",
		{
			username: username,
			currentlyActive: currentlyActive,
			sortingFilter: sortingFilter,
		},
		{ autoFetch: false }
	);
	const { fetch: fetchTracksByBand } = useMoralisCloudFunction(
		"fetchTracksByBand",
		{
			username: username,
			currentlyActive: currentlyActive,
			sortingFilter: sortingFilter,
		},
		{ autoFetch: false }
	);

	useEffect(() => {
		if (sortingFilter !== "Newest First") {
			if (isBand) {
				fetchTracksByBand({
					onSuccess: async (object) => {
						setTracks(object);
					},
					onError: (error) => {
						console.log("fetchTracksByBand Error:", error);
					},
				});
			} else {
				fetchTracksByUser({
					onSuccess: async (object) => {
						setTracks(object);
					},
					onError: (error) => {
						console.log("fetchTracksByUser Error:", error);
					},
				});
			}
		} else {
			if (currentlyActive == "New Releases") {
				setTracks(profileDetails.newReleases);
			} else if (currentlyActive == "Sold Out") {
				setTracks(profileDetails.soldOut);
			} else if (currentlyActive == "Collection") {
				setTracks(profileDetails.collection);
			}
		}
	}, [sortingFilter]);

	return (
		<div className={"dark:bg-dark-600 " + styles["filter-card"]}>
			{/* Left Section */}
			<div className={styles["filter-card__left-section"]}>
				<Image src={theme === "dark" ? "/assets/record_w.svg" : "/assets/record_b.svg"} alt="vinyl disc" height={30} width={30}></Image>
				<div className="flex-grow ml-4">
					<h4 className={styles["filter-card__left-section--heading"]}>TRACKS</h4>
					{/* Horizontal separator */}
					<div className="my-1 flex-grow border-t-[2px] border-[#818181]"></div>
					{/* Owned NFTs Category Filters */}
					<div className="space-x-4 text-[#818181]">
						{(isArtist || isBand) && (
							<>
								<span
									className={
										"text-sm cursor-pointer " +
										(currentlyActive == "New Releases" ? "text-dark-600 font-semibold dark:text-light-100" : "font-medium")
									}
									onClick={handleFilterChange}
								>
									New Releases
								</span>
								<span
									className={
										"text-sm cursor-pointer " +
										(currentlyActive == "Sold Out" ? "text-dark-600 font-semibold dark:text-light-100" : "font-medium")
									}
									onClick={handleFilterChange}
								>
									Sold Out
								</span>
							</>
						)}
						<span
							className={
								"text-sm cursor-pointer " +
								(currentlyActive == "Collection" ? "text-dark-600 font-semibold dark:text-light-100" : "font-medium")
							}
							onClick={handleFilterChange}
						>
							Collection
						</span>
					</div>
				</div>
			</div>
			{/* Right Section */}
			{currentlyActive !== "Collection" && (
				<div className={"dark:border-dark-800 dark:bg-dark-800 dark:hover:border-primary-500 " + styles["filter-card__right-section"]}>
					<p className={"dark:text-light-100 " + styles["filter-card__right-section--sort-by"]}>Sort By:</p>
					<Dropdown setSortingFilter={setSortingFilter} />
				</div>
			)}
		</div>
	);
}
