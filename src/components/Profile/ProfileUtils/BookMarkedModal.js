import { useContext } from "react";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import Link from "next/link";
import Modal from "../../../layout/Modal/Modal";
import CollaboratorImage from "../../../layout/NFTCard/CollaboratorImage";
import LoadingContext from "../../../../store/loading-context";

export default function BookMarkedModal({ isOpen, setOpen, username, favouriteTokens, setFavouriteTokens, isBand }) {
	const router = useRouter();
	const [, setLoading] = useContext(LoadingContext);
	const { user, Moralis } = useMoralis();

	const removeFromFavourites = async (tokenId) => {
		setLoading({
			status: true,
			title: "Removing Favourite...",
		});
		await Moralis.Cloud.run("removeTokenFromFavourites", { tokenId: tokenId }).then(async () => {
			setFavouriteTokens((favouriteTokens) =>
				favouriteTokens.filter((token) => {
					// 👇️ remove object that has id equal to tokenId
					return token.tokenId !== tokenId;
				})
			);
			setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="relative flex items-center justify-center w-24 h-24 mx-auto text-6xl">
					<label className="flex items-center justify-center border-2 rounded-full w-14 h-14 border-primary-600">
						<i className="text-2xl fa-solid fa-heart text-primary-600"></i>
					</label>
				</div>
			}
			title={"Favourites"}
			content={
				<div className="flex flex-col space-y-1 max-h-[400px] overflow-y-scroll px-2">
					{favouriteTokens && favouriteTokens.length > 0 ? (
						favouriteTokens.map((token) => {
							let collaboratorList = [];
							token.collaborators.map((collaborator) => {
								token.collaboratorUsers.map((collaboratorUser) => {
									collaborator.address === collaboratorUser.ethAddress && collaboratorList.push(collaboratorUser);
								});
							});

							return (
								<div key={token.tokenId} className="flex p-2 rounded group hover:bg-light-200 dark:hover:bg-dark-800">
									<Link href={`/track/polygon/${token.tokenId}`} passHref>
										<a className="flex w-full cursor-pointer text-start group">
											<Image
												src={token.artwork.uri.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_NODE_URL)}
												className="rounded"
												height={60}
												width={60}
												alt="NFT Artwork"
											/>
											<div className="flex justify-between w-full">
												<div className="relative flex flex-col place-content-between">
													<p className="ml-4 text-sm font-semibold">
														<span className="absolute w-max">{token.title}</span>
													</p>
													<p className="items-end ml-4 text-xs">{token.artist}</p>
												</div>
												<div className="flex items-end">
													{!isBand ? (
														<span className="hidden mr-2 text-xs group-hover:block text-primary-500">{token.genre}</span>
													) : (
														<>
															<div className="sm:hidden block w-[80px] md:w-[100px] relative overflow-x-hidden mr-2">
																<div className="animate-marquee whitespace-nowrap">
																	<span className="mr-4 text-xs text-primary-500">
																		<i className="mr-1 text-sm fa-solid fa-heart text-primary-600"></i>
																		{token.bandMember.name}
																	</span>
																</div>
																<div className="absolute top-0 animate-marquee2 whitespace-nowrap">
																	<span className="mr-4 text-xs text-primary-500">
																		<i className="mr-1 text-sm fa-solid fa-heart text-primary-600"></i>
																		{token.bandMember.name}
																	</span>
																</div>
															</div>
															<span className="hidden mr-4 text-xs sm:block text-primary-500">
																<i className="mr-1 text-sm fa-solid fa-heart text-primary-600"></i>
																{token.bandMember.name}
															</span>
														</>
													)}

													<span className="mr-2 text-xs font-light">
														#{token.localTokenId} of {token.numberOfCopies}
													</span>
													{!isBand && (
														<div className="flex items-end -space-x-2">
															{collaboratorList.map((collaborator, index) => {
																return <CollaboratorImage key={index} collaborator={collaborator} />;
															})}
														</div>
													)}
												</div>
											</div>
										</a>
									</Link>
									{user && username === user.attributes.username && !isBand && (
										<div className="self-center hidden pl-2 group-hover:block">
											<div
												onClick={() => removeFromFavourites(token.tokenId)}
												className="flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-lg cursor-pointer hover:bg-error-600/60"
											>
												<i className="fa-solid fa-xmark"></i>
											</div>
										</div>
									)}
								</div>
							);
						})
					) : (
						<div>No bookmarks to show</div>
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
