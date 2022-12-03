import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useTheme } from "next-themes";
import styles from "../../../../styles/Profile/Header.module.css";
import StatusContext from "../../../../store/status-context";
import AuthModalContext from "../../../../store/authModal-context";
import Tooltip from "../../../layout/Tooltip/Tooltip";

export default function AboutArtist({ username, name, bio, country, createdAt, setShowArtistBioModal, setShowReportModal }) {
	const { theme } = useTheme();
	const { user } = useMoralis();
	const [, setAuthModalOpen] = useContext(AuthModalContext);
	const [joined, setJoined] = useState(false);

	useEffect(() => {
		if (createdAt) {
			const dateStr = new Date(createdAt).toDateString();
			const dateStrArr = dateStr.split(" ");
			setJoined("Joined " + dateStrArr[1] + ", " + dateStrArr[3]);
		}
	}, [createdAt]);

	const maxBioCharacters = 800;
	let bioCharacters = bio;
	if (bioCharacters && bioCharacters.length > maxBioCharacters) bioCharacters = bioCharacters.substring(0, maxBioCharacters) + "...";

	const { asPath } = useRouter();
	const [, , setSuccess] = useContext(StatusContext);
	const [currentPageLink, setCurrentPageLink] = useState("");

	useEffect(() => {
		setCurrentPageLink(window.location.origin + asPath);
	}, [asPath]);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(currentPageLink);
		setSuccess((prevState) => ({
			...prevState,
			title: "Profile Link Copied!",
			message: "The profile link has been copied to clipboard",
			showSuccessBox: true,
		}));
	};

	const sharableMessage = `Artists and Fans are collaborating on Musixverse, eliminating all the intermediaries! Where are you?\n\nJump into a new world of music fandom and be a part of the revolution!\n\nCheck out ${name}'s profile on @musixverse-\n${currentPageLink}`;
	const uriEncodedSharableText = encodeURI(sharableMessage);

	return (
		<>
			<div>
				{bio ? (
					<>
						<h4 className="font-bold text-[18px] text-center md:text-start">About</h4>
						{bioCharacters.length < maxBioCharacters ? (
							<p className={"text-[12px] md:text-[15px] pt-3 whitespace-pre-wrap"}>{bio}</p>
						) : (
							<>
								<p
									className={
										"text-[12px] md:text-[15px] pt-3 whitespace-pre-wrap " +
										(theme === "dark" ? styles["about_us_dark"] : styles["about_us"])
									}
								>
									{bioCharacters}
								</p>
								<button
									onClick={() => setShowArtistBioModal(true)}
									className="text-primary-600 hover:text-primary-700 text-[12px] md:text-[15px] mt-2"
								>
									Read More
								</button>
							</>
						)}
					</>
				) : user && username === user.attributes.username ? (
					<>
						<h4 className="font-bold text-[18px] text-center md:text-start">About</h4>
						<Link href="/settings/profile-settings" passHref>
							<p className={"text-[12px] md:text-[15px] pt-2 cursor-pointer " + styles["about_us"]}>Add your Bio.</p>
						</Link>
					</>
				) : (
					<>
						<h4 className="font-bold text-[18px] text-center md:text-start">About</h4>
						<p className={"text-[12px] md:text-[15px] pt-2 " + styles["about_us"]}>No information available</p>
					</>
				)}
			</div>

			{/* footer section */}
			<div
				className={
					(bio && bioCharacters && bioCharacters.length < maxBioCharacters ? "mt-12" : bio && bioCharacters ? "mt-6" : "mt-14") +
					" w-full flex justify-between items-end xl:items-center text-[#818181] text-[12px] md:text-[15px] font-medium"
				}
			>
				<div className="space-x-2 md:space-x-5">
					{country && country.name ? <span> {country.name} </span> : null}
					<span>{createdAt ? joined : null}</span>
				</div>
				<div className="flex space-x-3 text-dark-600 dark:text-light-200">
					<div>
						<Tooltip
							labelText={
								<span className="font-semibold text-sm cursor-help text-center">
									{!user ? (
										<button
											onClick={() => setAuthModalOpen(true)}
											className="md:w-[36px] md:h-[36px] w-[28px] h-[28px] text-center rounded-full bg-gray-200 dark:bg-[#040404] hover:bg-light-300"
										>
											<i className="text-xs md:text-sm fas fa-flag text-dark-600 dark:text-light-100 ml-1.5"></i>
										</button>
									) : (
										user &&
										username !== user.attributes.username && (
											<button
												onClick={() => setShowReportModal(true)}
												className="md:w-[36px] md:h-[36px] w-[28px] h-[28px] text-center rounded-full bg-gray-200 dark:bg-[#040404] hover:bg-light-300"
											>
												<i className="text-xs md:text-sm fas fa-flag text-dark-600 dark:text-light-100 ml-1.5"></i>
											</button>
										)
									)}
								</span>
							}
							message="Report this Profile"
							tooltipLocation="bottom"
						></Tooltip>
					</div>

					<button className="md:w-[36px] md:h-[36px] w-[28px] h-[28px] text-center rounded-full bg-gray-200 dark:bg-[#040404] hover:bg-light-300 dark:hover:bg-dark-600 relative group">
						<i className="fa-solid fa-share-nodes text-lg"></i>

						<ul className="absolute pt-10 bg-transparent hidden group-hover:block right-0 top-0 z-10 text-sm font-medium text-left list-none border-none rounded-xl min-w-[250px]">
							<ul className="rounded-xl shadow-lg bg-light-100 dark:bg-dark-600 z-50">
								<li onClick={copyToClipboard}>
									<div className="flex items-center w-full rounded-t-xl px-4 py-3 bg-transparent cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-dark-800">
										<i className="fa-solid fa-copy text-lg"></i>
										<span className="ml-2">Copy Link</span>
									</div>
								</li>
								<li>
									<Link href={"https://twitter.com/intent/tweet?url=" + uriEncodedSharableText} passHref={true}>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center w-full px-4 py-3 bg-transparent cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-dark-800"
										>
											<i className="fa-brands fa-twitter text-lg"></i>
											<span className="ml-2">Share on Twitter</span>
										</a>
									</Link>
								</li>
								<li>
									<Link
										href={`https://www.facebook.com/dialog/share?app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&display=popup&href=${currentPageLink}&redirect_uri=${currentPageLink}&hashtag=%23Musixverse`}
										passHref={true}
									>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center w-full px-4 py-3 bg-transparent cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-dark-800"
										>
											<i className="fa-brands fa-facebook text-lg"></i>
											<span className="ml-2">Share on Facebook</span>
										</a>
									</Link>
								</li>
								<li>
									<Link href={`https://web.whatsapp.com/send?text=` + uriEncodedSharableText} passHref={true}>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="block w-full px-4 py-3 bg-transparent cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-dark-800"
										>
											<i className="fa-brands fa-whatsapp text-lg"></i>
											<span className="ml-2">Share on WhatsApp</span>
										</a>
									</Link>
								</li>
								<li>
									<Link href={`https://telegram.me/share/url?url=` + uriEncodedSharableText} passHref={true}>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="block w-full px-4 py-3 bg-transparent cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-dark-800"
										>
											<i className="fa-brands fa-telegram text-lg"></i>
											<span className="ml-2">Share on Telegram</span>
										</a>
									</Link>
								</li>
								<li>
									<Link
										href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentPageLink}&title=${sharableMessage}`}
										passHref={true}
									>
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="block w-full px-4 py-3 bg-transparent cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-dark-800 rounded-b-xl"
										>
											<i className="fa-brands fa-linkedin text-lg"></i>
											<span className="ml-2">Share on LinkedIn</span>
										</a>
									</Link>
								</li>
							</ul>
						</ul>
					</button>
				</div>
			</div>
		</>
	);
}
