const { Fragment, useState, useEffect, useContext } = require("react");
import Image from "next/image";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
const { Transition } = require("@headlessui/react");
import { addPolygonNetwork } from "../../utils/smart-contract/functions";
import logoBlack from "../../../public/logo-black.svg";
import LoadingContext from "../../../store/loading-context";
import StatusContext from "../../../store/status-context";

export default function AuthModal({ isOpen = "", onClose = "" }) {
	const router = useRouter();
	const { authenticate, isAuthenticated, isWeb3Enabled, enableWeb3, Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, , , setError] = useContext(StatusContext);
	const [isModalOpen, setIsModalOpen] = useState(isOpen);

	useEffect(() => {
		setIsModalOpen(isModalOpen);
		if (!isModalOpen) {
			document.documentElement.style.overflow = "auto";
		} else {
			document.documentElement.style.overflow = "hidden";
		}
	}, [isModalOpen]);

	useEffect(() => {
		setIsModalOpen(isOpen);
	}, [isOpen]);

	const handleChange = () => {
		setIsModalOpen(!isModalOpen);
	};

	const closeModal = () => {
		handleChange();
		onClose();
	};

	const metamaskLogin = async () => {
		setLoading(true);
		if (!isAuthenticated) {
			await addPolygonNetwork();
			await authenticate({ signingMessage: "Innovise Authentication" })
				.then(async function (user) {
					if (user) {
						await fetch("/api/auth/login", {
							method: "post",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ currentUser: user }),
						});
						closeModal();
						if (router.pathname === "/") router.push("/innovation-hub");
					}
					setLoading(false);
				})
				.catch(function (error) {
					console.log("Metamask authentication error:", error);
					setLoading(false);
				});
		}
		setLoading(false);
	};

	const walletconnectLogin = async () => {
		setLoading(true);

		if (!isAuthenticated) {
			await authenticate({
				provider: "walletconnect",
				chainId: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === 137 ? 137 : "",
				signingMessage: "Innovise Authentication",
			})
				.then(async function (user) {
					if (user) {
						await fetch("/api/auth/login", {
							method: "post",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ currentUser: user }),
						});
						closeModal();
						if (router.pathname === "/") router.push("/innovation-hub");
					}
					setLoading(false);
				})
				.catch(function (error) {
					console.log("WalletConnect authentication error:", error);
					setLoading(false);
				});
		}

		setLoading(false);
	};

	return (
		<>
			<Transition show={isModalOpen}>
				<Transition.Child
					as={Fragment}
					enter="transition-all duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-all duration-200"
					leaveTo="opacity-0"
					leaveFrom="opacity-100"
				>
					<div style={{ zIndex: "50" }} onClick={() => handleChange()} className="w-full h-full left-0 top-0 bg-black/80 backdrop-blur fixed" />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="transition-all duration-200"
					enterFrom="opacity-0 scale-75"
					enterTo="opacity-100 scale-100"
					leave="transition-all duration-200"
					leaveTo="opacity-0 scale-75"
					leaveFrom="opacity-100 scale-100"
				>
					<div style={{ zIndex: "50" }} className="flex justify-center items-center h-full w-full fixed">
						<div className="max-w-[48rem] sm:w-[80vw] w-11/12 p-4 pl-10 pb-12 bg-white dark:bg-dark-600 rounded-lg">
							<div className="w-full flex justify-between">
								<div className="w-full flex flex-col justify-start items-start">
									<Image src={logoBlack} alt="MXV Logo" width="80" height="80" />
								</div>
								<div
									onClick={() => closeModal()}
									className="w-8 h-8 flex justify-center items-center rounded-lg transition-all duration-200 cursor-pointer hover:bg-zinc-500/20 "
								>
									<i className="fa-solid fa-xmark"></i>
								</div>
							</div>

							<div className="w-full flex flex-col sm:flex-row sm:space-x-4 mt-4 pr-4">
								<div className="sm:w-2/5">
									<div className="text-xl font-semibold font-primary">Jump into Innovise!</div>
									<p className="text-sm mt-4 pr-14">Select your wallet from the available options</p>
									<p className="text-[10px] text-gray-400 mt-8 sm:mt-36 pr-14">
										Connecting your wallet is the simplest way to log in to the world of Web3!
									</p>
								</div>
								<div className="sm:w-3/5 mt-4 sm:-mt-10">
									<div className="text-sm">Available Wallets</div>
									<div className="mt-6 w-full space-y-4">
										<button
											onClick={() => metamaskLogin()}
											className="w-full bg-light-200 hover:bg-light-300 rounded-lg flex items-center p-4 text-sm"
										>
											<Image src="/assets/metamask.png" alt="Metamask Logo" width="40" height="40" />
											<div className="flex justify-between items-center w-full">
												<span className="ml-4">Metamask</span>
												<span className="ml-2 text-xl">
													<i className="fa-solid fa-arrow-right-long"></i>
												</span>
											</div>
										</button>
										<button
											onClick={() => walletconnectLogin()}
											className="w-full bg-light-200 hover:bg-light-300 rounded-lg flex items-center p-4 text-sm"
										>
											<Image src="/assets/walletconnect.png" alt="WalletConnect Logo" width="40" height="40" />
											<div className="flex justify-between items-center w-full">
												<span className="ml-4">WalletConnect</span>
												<span className="ml-2 text-xl">
													<i className="fa-solid fa-arrow-right-long"></i>
												</span>
											</div>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Transition.Child>
			</Transition>
		</>
	);
}
