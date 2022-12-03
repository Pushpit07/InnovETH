import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMoralisCloudFunction } from "react-moralis";
import Image from "next/image";
import Link from "next/link";
import Modal from "../../../layout/Modal/Modal";

export default function FollowersModal({ isOpen, setOpen, username, isBand }) {
	const router = useRouter();
	const [following, setFollowing] = useState([]);

	const { fetch: fetchFollowing } = useMoralisCloudFunction("fetchFollowing", { username: username }, { autoFetch: false });
	const { fetch: fetchBandFollowing } = useMoralisCloudFunction("fetchBandFollowing", { username: username }, { autoFetch: false });

	useEffect(() => {
		if (isOpen) {
			if (isBand) {
				fetchBandFollowing({
					onSuccess: (data) => {
						setFollowing(data);
					},
					onError: (error) => {
						console.log("fetchBandFollowing Error:", error);
					},
				});
			} else {
				fetchFollowing({
					onSuccess: (data) => {
						setFollowing(data);
					},
					onError: (error) => {
						console.log("fetchFollowing Error:", error);
					},
				});
			}
		}
	}, [isOpen, isBand, fetchFollowing, fetchBandFollowing]);

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-6xl">
					<label className="flex justify-center items-center w-14 h-14 border-2 rounded-full border-primary-600">
						<i className="fa-solid fa-people-group text-2xl text-primary-600"></i>
					</label>
				</div>
			}
			title={"Following"}
			content={
				<div className="flex flex-col space-y-1 max-h-[400px] overflow-y-scroll px-2">
					{following && following.length > 0 ? (
						following.map((follower) => {
							return (
								<div key={follower.username} className="flex group p-2 rounded hover:bg-light-200 dark:hover:bg-dark-800">
									<Link href={`/profile/${follower.username}`} passHref>
										<a target="_blank" rel="noopener noreferrer" className="w-full flex text-start cursor-pointer group">
											<Image src={follower.avatar} className="rounded" height={50} width={50} alt="NFT Artwork" />
											<div className="w-full flex justify-between">
												<div className="flex flex-col place-content-between relative">
													<p className="ml-4 text-sm font-semibold">
														<span className="absolute w-max">{follower.name}</span>
													</p>
													<p className="ml-4 text-xs items-end">@{follower.username}</p>
												</div>

												{isBand && follower.followerName && (
													<div className="flex items-end">
														<span className="text-xs text-primary-500">{follower.followerName} follows</span>
													</div>
												)}
											</div>
										</a>
									</Link>
								</div>
							);
						})
					) : (
						<div>No following to show</div>
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
