import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { meta_description } from "../../constants";
import { useRouter } from "next/router";
import Moralis from "moralis/node";
import Banner from "../../components/Profile/Banner";
import Header from "../../components/Profile/Header";
import Filter from "../../components/Profile/Filter";
import NFTs from "../../components/Profile/NFTs";
const FavouritesHeader = dynamic(() => import("../../components/Profile/FavouritesHeader"));
const FavouriteNFTs = dynamic(() => import("../../components/Profile/FavouriteNFTs"));
const ArtistBioModal = dynamic(() => import("../../components/Profile/ProfileUtils/ArtistBioModal"));
const ArtistReportModal = dynamic(() => import("../../components/Profile/ProfileUtils/ArtistReportModal"));
const FavouritesModal = dynamic(() => import("../../components/Profile/ProfileUtils/FavouritesModal"));
const FollowersModal = dynamic(() => import("../../components/Profile/ProfileUtils/FollowersModal"));
const FollowingModal = dynamic(() => import("../../components/Profile/ProfileUtils/FollowingModal"));
import { PARSE_APP_ID, PARSE_SERVER_URL } from "../../constants";

export async function getStaticProps(context) {
	const { username } = context.params;
	await Moralis.start({ serverUrl: PARSE_SERVER_URL, appId: PARSE_APP_ID });

	// Fetch token details
	const _profileDetails = await Moralis.Cloud.run("fetchProfileDetails", { username: username });

	if (!_profileDetails) {
		return {
			redirect: {
				destination: `/profile/does-not-exist?username=${username}`,
				permanent: false,
			},
		};
	}
	const profileDetails = JSON.parse(JSON.stringify(_profileDetails));

	// Passing data to the page using props
	return {
		props: { profileDetails },
		revalidate: 2,
	};
}

export function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	};
}

export default function Profile({ profileDetails }) {
	const router = useRouter();
	const { username } = router.query;

	const [showArtistBioModal, setShowArtistBioModal] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [currentlyActive, setCurrentlyActive] = useState(profileDetails.isArtist ? "New Releases" : "Collection");
	// NFTs
	const [tracks, setTracks] = useState(profileDetails.isArtist ? profileDetails.newReleases : profileDetails.collection);
	// Sort by
	const [sortingFilter, setSortingFilter] = useState("Newest First");

	// Favourites Modal
	const [isFavouritesModalOpen, setFavouritesModalOpen] = useState(false);
	const [favouriteTokens, setFavouriteTokens] = useState(profileDetails.favourites);
	// Followers Modal
	const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);
	// Following Modal
	const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
	useEffect(() => {
		if (router.query && "favourites" in router.query) {
			setFavouritesModalOpen(true);
		} else if (router.query && "followers" in router.query) {
			setFollowersModalOpen(true);
		} else if (router.query && "following" in router.query) {
			setFollowingModalOpen(true);
		} else {
			setFavouritesModalOpen(false);
			setFollowersModalOpen(false);
			setFollowingModalOpen(false);
		}
	}, [router.query]);

	return (
		<>
			{profileDetails.isArtist ? (
				<>
					<Head>
						<title>Innovesta | Company</title>
						<meta name="description" content={meta_description} />
						<meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
						<meta name="og:image" content={profileDetails.avatar}></meta>
						<meta name="image" property="og:image" content={profileDetails.avatar}></meta>
					</Head>
				</>
			) : (
				<>
					<Head>
						<title>Innovesta | Innovator</title>
						<meta name="description" content={meta_description} />
						<meta name="viewport" content="initial-scale=1.0, width=device-width"></meta>
						<meta name="og:image" content={profileDetails.avatar}></meta>
						<meta name="image" property="og:image" content={profileDetails.avatar}></meta>
					</Head>
				</>
			)}

			<div className="flex flex-col items-center justify-center w-full bg-light-200 dark:bg-dark-800">
				<Banner coverImage={profileDetails.coverImage} />
				<div className="w-full max-w-[1920px] pb-20 px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
					<Header
						username={username}
						profileDetails={profileDetails}
						setShowArtistBioModal={setShowArtistBioModal}
						setShowReportModal={setShowReportModal}
					/>
					<Filter
						username={username}
						currentlyActive={currentlyActive}
						setCurrentlyActive={setCurrentlyActive}
						sortingFilter={sortingFilter}
						setSortingFilter={setSortingFilter}
						isArtist={profileDetails.isArtist}
						setTracks={setTracks}
						profileDetails={profileDetails}
					/>
					<NFTs username={username} tracks={tracks} currentlyActive={currentlyActive} />
					<FavouritesHeader />
					<FavouriteNFTs username={username} favouriteTokens={favouriteTokens} />
				</div>
			</div>

			<ArtistBioModal isOpen={showArtistBioModal} setOpen={setShowArtistBioModal} name={profileDetails.name} bio={profileDetails.bio} />
			<ArtistReportModal isOpen={showReportModal} setOpen={setShowReportModal} username={username} />
			<FavouritesModal
				isOpen={isFavouritesModalOpen}
				setOpen={setFavouritesModalOpen}
				username={username}
				favouriteTokens={favouriteTokens}
				setFavouriteTokens={setFavouriteTokens}
			/>
			<FollowersModal isOpen={isFollowersModalOpen} setOpen={setFollowersModalOpen} username={username} />
			<FollowingModal isOpen={isFollowingModalOpen} setOpen={setFollowingModalOpen} username={username} />
		</>
	);
}
