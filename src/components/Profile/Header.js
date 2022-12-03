import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import styles from "../../../styles/Profile/Header.module.css";
import mxv_tick from "../../../public/assets/mxv_tick.svg";
import CustomButton from "../../layout/CustomButton";
import Tooltip from "../../layout/Tooltip/Tooltip";
import ShinyLoader from "../../layout/ShinyLoader";
import AuthModalContext from "../../../store/authModal-context";
import Stats from "./ProfileUtils/Stats";
import AboutArtist from "./ProfileUtils/AboutArtist";

export default function Header({ username, profileDetails, setShowArtistBioModal, setShowReportModal }) {
	const { user } = useMoralis();
	const [, setAuthModalOpen] = useContext(AuthModalContext);

	/*******************************
	 ********  FOLLOW USER  ********
	 *******************************/
	const [isFollowingProfileUser, setIsFollowingProfileUser] = useState(false);
	const { fetch: fetchIsFollowingUser } = useMoralisCloudFunction("fetchIsFollowingUser", { username: username }, { autoFetch: false });
	const { fetch: fetchIsFollowingBand } = useMoralisCloudFunction("fetchIsFollowingBand", { username: username }, { autoFetch: false });

	useEffect(() => {
		if (user) {
			if (profileDetails.isBand) {
				fetchIsFollowingBand({
					onSuccess: async (object) => {
						setIsFollowingProfileUser(object);
					},
					onError: (error) => {
						console.log("fetchIsFollowingBand Error:", error);
					},
				});
			} else {
				fetchIsFollowingUser({
					onSuccess: async (object) => {
						setIsFollowingProfileUser(object);
					},
					onError: (error) => {
						console.log("fetchIsFollowingUser Error:", error);
					},
				});
			}
		}
	}, [user, fetchIsFollowingUser, fetchIsFollowingBand, profileDetails.isBand]);

	const { fetch: followUser } = useMoralisCloudFunction("followUser", { username: username }, { autoFetch: false });
	const { fetch: followBand } = useMoralisCloudFunction("followBand", { username: username }, { autoFetch: false });
	const followProfileUser = () => {
		if (user) {
			if (profileDetails.isBand) {
				followBand({
					onSuccess: async (object) => {
						if (object) {
							setIsFollowingProfileUser(true);
						} else {
							setIsFollowingProfileUser(false);
						}
					},
					onError: (error) => {
						console.log("followBand Error:", error);
					},
				});
			} else {
				followUser({
					onSuccess: async (object) => {
						if (object) {
							setIsFollowingProfileUser(true);
						} else {
							setIsFollowingProfileUser(false);
						}
					},
					onError: (error) => {
						console.log("followUser Error:", error);
					},
				});
			}
		} else {
			setAuthModalOpen(true);
		}
	};

	return (
		<div className={"dark:bg-nav-dark dark:backdrop-blur-xl dark:backdrop-brightness-150 z-10 relative " + styles["artist-banner__container"]}>
			{/* Left section */}
			<div className={styles["artist-banner__section1"]}>
				<div className={styles["section1__artist-image"]}>
					{profileDetails.avatar ? (
						<Image
							priority
							src={profileDetails.avatar || "https://ipfs.moralis.io:2053/ipfs/Qmcn1aZ4PKUUzwpTncuSbruwLD98dtiNqvoJG5zm8EMwXZ"}
							objectFit="contain"
							width="200"
							height="200"
							alt="artist profile"
						/>
					) : (
						<ShinyLoader rounded={true} />
					)}
				</div>
				<div className="mt-4 mb-4 text-4xl md:text-5xl md:hidden font-tertiary xl:mb-0 xl:mt-2">
					{profileDetails.name}
					&nbsp;
					{profileDetails.isArtistVerified || profileDetails.isBandVerified ? (
						<Image src={mxv_tick} width={20} height={20} alt="mxv_verified" className="ml-10" />
					) : user && username === user.attributes.username && profileDetails.verificationRequested ? (
						<span className="ml-2 font-primary text-sm text-gray-500">
							<Tooltip
								labelText={
									<Link href="/profile/verify/verification-requested" passHref>
										<i className="fa-solid fa-hourglass-half text-sm"></i>
									</Link>
								}
								message="Verification Pending..."
								tooltipLocation="bottom"
							></Tooltip>
						</span>
					) : user &&
					  username === user.attributes.username &&
					  !profileDetails.isArtistVerified &&
					  user.attributes.isArtist &&
					  !profileDetails.isBand ? (
						<Link href="/profile/verify" passHref>
							<a className="ml-4 font-primary text-sm hover:text-primary-500 cursor-pointer hover:underline">Verify profile</a>
						</Link>
					) : null}
					<p className="font-primary text-sm text-center">@{username}</p>
				</div>

				<div className="mt-4">
					{/* Edit profile button (Make it render conditionally) */}
					{user && username === user.attributes.username ? (
						<Link href="/settings/profile-settings" passHref>
							<div className="m-auto mt-4">
								<CustomButton green={true} classes="text-base px-8 py-1.5 border-2 border-transparent rounded-full">
									Edit profile <i className="ml-1 fas fa-edit"></i>
								</CustomButton>
							</div>
						</Link>
					) : (
						<div className="m-auto mt-4">
							{isFollowingProfileUser ? (
								<div className="group">
									<CustomButton
										onClick={() => {
											followProfileUser();
										}}
										greenOutline={true}
										classes="text-base px-10 py-1.5 block group-hover:hidden dark:bg-dark-600 rounded-full"
									>
										Following
									</CustomButton>
									<CustomButton
										onClick={() => {
											followProfileUser();
										}}
										error={true}
										classes="text-base px-10 py-1.5 border-2 border-transparent hidden group-hover:block rounded-full"
									>
										Unfollow
									</CustomButton>
								</div>
							) : (
								<CustomButton
									onClick={() => {
										followProfileUser();
									}}
									green={true}
									classes="text-base px-12 py-1.5 border-2 border-transparent rounded-full"
								>
									Follow
								</CustomButton>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Right Details section */}
			<div className={styles["artist-banner__section2"]}>
				<div className={styles["section2__artist-name"]}>
					<div className="md:block hidden font-tertiary mb-3 xl:mb-0 mt-3 xl:mt-2 text-6xl">
						{profileDetails.name}
						&nbsp;
						{profileDetails.isArtistVerified || profileDetails.isBandVerified ? (
							<Image src={mxv_tick} width={20} height={20} alt="mxv_verified" className="ml-10" />
						) : user && username === user.attributes.username && profileDetails.verificationRequested ? (
							<span className="ml-2 font-primary text-sm text-gray-500">
								<Tooltip
									labelText={
										<Link href="/profile/verify/verification-requested" passHref>
											<i className="fa-solid fa-hourglass-half text-sm"></i>
										</Link>
									}
									message="Verification Pending..."
									tooltipLocation="bottom"
								></Tooltip>
							</span>
						) : user &&
						  username === user.attributes.username &&
						  !profileDetails.isArtistVerified &&
						  user.attributes.isArtist &&
						  !profileDetails.isBand ? (
							<Link href="/profile/verify" passHref>
								<a className="ml-4 font-primary text-sm hover:text-primary-500 cursor-pointer hover:underline">Verify profile</a>
							</Link>
						) : null}
						<p className="font-primary text-sm">@{username}</p>
					</div>

					<div className="flex flex-col md:items-end items-center -mb-10">
						{/* Artist's Stats Section */}
						<Stats username={username} profileDetails={profileDetails} />
						{/* links to music platforms */}
						<div className="flex justify-center space-x-5 mt-4">
							{profileDetails.spotify ? (
								<Link href={profileDetails.spotify}>
									<a target="_blank" rel="noopener noreferrer" className="link-item">
										<i className="text-2xl fab fa-spotify hover:text-primary-500"></i>
									</a>
								</Link>
							) : null}
							{profileDetails.instagram ? (
								<Link href={profileDetails.instagram}>
									<a target="_blank" rel="noopener noreferrer" className="link-item">
										<i className="text-2xl fab fa-instagram hover:text-primary-500"></i>
									</a>
								</Link>
							) : null}
							{profileDetails.twitter ? (
								<Link href={profileDetails.twitter}>
									<a target="_blank" rel="noopener noreferrer" className="link-item">
										<i className="text-2xl fab fa-twitter hover:text-primary-500"></i>
									</a>
								</Link>
							) : null}
							{profileDetails.facebook ? (
								<Link href={profileDetails.facebook}>
									<a target="_blank" rel="noopener noreferrer" className="link-item">
										<i className="text-2xl fab fa-facebook-square hover:text-primary-500"></i>
									</a>
								</Link>
							) : null}
						</div>
					</div>
				</div>
				{/* About Artist section */}
				<AboutArtist
					username={username}
					name={profileDetails.name}
					bio={profileDetails.bio}
					country={profileDetails.country}
					createdAt={profileDetails.createdAt}
					setShowArtistBioModal={setShowArtistBioModal}
					setShowReportModal={setShowReportModal}
				/>
			</div>
		</div>
	);
}
