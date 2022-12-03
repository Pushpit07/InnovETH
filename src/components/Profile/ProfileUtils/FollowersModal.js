import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import Image from "next/image";
import Link from "next/link";
import Modal from "../../../layout/Modal/Modal";
import LoadingContext from "../../../../store/loading-context";

export default function FollowersModal({ isOpen, setOpen, username, isBand }) {
	const router = useRouter();
	const [followers, setFollowers] = useState([]);
	const [, setLoading] = useContext(LoadingContext);

	const { user, Moralis } = useMoralis();

	const { fetch: fetchFollowers } = useMoralisCloudFunction("fetchFollowers", { username: username }, { autoFetch: false });
	const { fetch: fetchBandFollowers } = useMoralisCloudFunction("fetchBandFollowers", { username: username }, { autoFetch: false });

	const removeFollower = async (followerUsername) => {
		setLoading({
			status: true,
			title: "Removing Follower...",
		});
		await Moralis.Cloud.run("removeFollower", { username: followerUsername }).then(async () => {
			await fetchFollowers({
				onSuccess: (data) => {
					setFollowers(data);
				},
				onError: (error) => {
					console.log("fetchFollowers Error:", error);
				},
			});
			setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
		});
	};

	useEffect(() => {
		if (isOpen) {
			if (isBand) {
				fetchBandFollowers({
					onSuccess: (data) => {
						setFollowers(data);
					},
					onError: (error) => {
						console.log("fetchBandFollowers Error:", error);
					},
				});
			} else {
				fetchFollowers({
					onSuccess: (data) => {
						setFollowers(data);
					},
					onError: (error) => {
						console.log("fetchFollowers Error:", error);
					},
				});
			}
		}
	}, [isOpen, isBand, fetchFollowers, fetchBandFollowers]);

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-6xl">
					<label className="flex justify-center items-center w-14 h-14 border-2 rounded-full border-primary-600">
						<i className="fa-solid fa-users text-2xl text-primary-600"></i>
					</label>
				</div>
			}
			title={"Followers"}
			content={
				<div className="flex flex-col space-y-1 max-h-[400px] overflow-y-scroll px-2">
					{followers && followers.length > 0 ? (
						followers.map((follower) => {
							return (
								<div key={follower.username} className="flex p-2 rounded hover:bg-light-200 dark:hover:bg-dark-800">
									<Link href={`/profile/${follower.username}`} passHref>
										<a target="_blank" rel="noopener noreferrer" className="w-full flex text-start cursor-pointer">
											<Image src={follower.avatar} className="rounded" height={50} width={50} alt="NFT Artwork" />
											<div className="w-full flex justify-between">
												<div className="flex flex-col place-content-between">
													<p className="ml-4 text-sm font-semibold">{follower.name}</p>
													<p className="ml-4 text-xs items-end">@{follower.username}</p>
												</div>
											</div>
										</a>
									</Link>

									{user && username === user.attributes.username && !isBand && (
										<div className="self-center pl-2">
											<div
												onClick={() => removeFollower(follower.username)}
												className="py-1 px-3 flex justify-center items-center rounded transition-all duration-200 cursor-pointer bg-zinc-500/20 hover:bg-error-600/60"
											>
												Remove
											</div>
										</div>
									)}
								</div>
							);
						})
					) : (
						<div>No followers to show</div>
					)}
				</div>
			}
			onClose={() => {
				setOpen(false);
				{
					!isBand
						? router.push(`/profile/${username}`, undefined, { shallow: true })
						: router.push(`/profile/band/${username}`, undefined, { shallow: true });
				}
			}}
		></Modal>
	);
}
