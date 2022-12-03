import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import multipleNft from "../../../public/assets/nftcard/nftcards.svg";
import dynamic from "next/dynamic";
const NFTCard = dynamic(() => import("./NFTCard"));
const NftCopiesRow = dynamic(() => import("./NftCopiesRow"));

export default function NftCopiesModal({ trackCopiesModalValues, showNftCopiesModal, setShowNftCopiesModal }) {
	return (
		<Transition.Root show={showNftCopiesModal} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 top-0 left-0 z-50 w-screen h-screen overflow-y-auto" onClose={() => setShowNftCopiesModal(false)}>
				<div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					{/* Background Grey Area */}
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="relative inline-block overflow-hidden text-left align-bottom transition-all transform shadow-xl rounded-2xl bg-none sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
							<div className="p-4 bg-light-200 dark:bg-dark-600 dark:backdrop-blur-[7px] backdrop-blur-[7px]">
								<div className="w-full flex justify-end items-center p-1">
									<div
										onClick={() => setShowNftCopiesModal(false)}
										className="flex items-center self-end justify-center w-8 h-8 mb-3 transition-all duration-200 rounded-lg cursor-pointer hover:bg-zinc-500/20 "
									>
										<i className="fa-solid fa-xmark"></i>
									</div>
								</div>

								<div className="px-10 pt-2 pb-6 text-center sm:text-left">
									{/* Close Modal Button */}
									<div className="flex w-full">
										<div className="flex flex-col justify-center items-center">
											<NFTCard {...trackCopiesModalValues} />
											<span className="mt-4 text-xs text-[#777777]">
												#{trackCopiesModalValues.localTokenId} of {trackCopiesModalValues.numberOfCopies}
											</span>
										</div>

										<div className="flex flex-col flex-1 ml-10">
											{/* Top section */}
											<div className="flex justify-between w-full">
												<div className="flex flex-col">
													<p className="font-secondary text-[#868686] text-sm">{trackCopiesModalValues.artistName}</p>
													<p className="font-secondary font-bold text-[#363636] dark:text-light-100 text-lg">
														{trackCopiesModalValues.trackName}
													</p>
												</div>
												<div className="flex items-center px-4 py-2 font-bold cursor-default rounded-xl bg-light-100 text-dark-600 dark:bg-dark-800 dark:text-light-100">
													<Image src={multipleNft} objectFit="contain" alt="multiple nft cards" className="dark:invert" />
													<span className="ml-2 text-sm">
														x{trackCopiesModalValues.numberOfCopies}
														{" Copies"}
													</span>
												</div>
											</div>

											{/* NFT Copies section */}
											<div className="mt-8 max-h-72 overflow-scroll pr-4">
												{trackCopiesModalValues.otherTokensOfTrack?.map((token, idx) => {
													return (
														trackCopiesModalValues.tokenId !== token.tokenId && (
															<NftCopiesRow token={token} trackName={trackCopiesModalValues.trackName} key={idx} />
														)
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
