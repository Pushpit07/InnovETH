import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import logoBlack from "../../../public/logo-black.svg";
import LoadingContext from "../../../store/loading-context";
import AuthModalContext from "../../../store/authModal-context";

const Navbar = ({}) => {
	const router = useRouter();
	const { isAuthenticated, user, logout, Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, setAuthModalOpen] = useContext(AuthModalContext);
	const [balance, setBalance] = useState(0);

	useEffect(() => {
		const fetchBalance = async () => {
			try {
				const options = { chain: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID };
				const _balance = await Moralis.Web3API.account.getNativeBalance(options);
				const _balanceAmount = parseFloat(_balance.balance) / 10 ** 18 === 0 ? "0" : parseFloat(_balance.balance) / 10 ** 18;
				setBalance(_balanceAmount > 0 ? _balanceAmount.toFixed(2) : 0);
			} catch (error) {
				console.log("ERROR-", error);
			}
		};
		if (user) {
			fetchBalance();
		}
	}, [user, Moralis.Web3API.account]);

	const { data: avatarUrl } = useMoralisCloudFunction("fetchUserAvatarFromAddress", { address: user ? user.attributes.ethAddress : null });

	const [clientWindowHeight, setClientWindowHeight] = useState("");
	const customStyles = "lg:top-0 lg:rounded-b-[50px]";
	const handleScroll = () => {
		setClientWindowHeight(window.scrollY);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});

	if (clientWindowHeight > 50) {
		customStyles = "lg:rounded-full lg:mt-2 lg:shadow-lg";
	}

	const handleLogout = async () => {
		if (router.pathname != "/") router.push("/");
		await logout();
		if (window.localStorage.walletconnect) {
			window.localStorage.removeItem("walletconnect");
		}
		await fetch("/api/auth/logout", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});
	};

	let truncatedWalletAddress;
	if (user && user.attributes.ethAddress) {
		truncatedWalletAddress = user.attributes.ethAddress.substring(0, 10) + "..." + user.attributes.ethAddress.substring(36, 42);
	}

	let truncatedName;
	if (user && user.attributes.name) {
		truncatedName = user.attributes.name ?? "";
		if (user.attributes.name && user.attributes.name.length > 10) {
			truncatedName = truncatedName.substring(0, 8) + "...";
		}
	}

	return (
		<div className="absolute flex justify-center w-screen">
			<div className="w-full fixed z-40 max-w-[1920px] lg:px-16 xl:px-20 2xl:px-36">
				<nav className={"navbar duration-500 ease-in mx-auto " + customStyles}>
					<div className="flex flex-wrap items-center justify-start w-full pl-7 sm:pl-9 pr-16 lg:px-16 py-2">
						<Link href="/">
							<a href="#" className="flex">
								<Image src={logoBlack} alt="MXV Logo" width="75" />
							</a>
						</Link>

						<div className="hidden ml-10 lg:block">
							<ul className="flex flex-row items-center font-medium md:text-base md:space-x-3 xl:space-x-6 md:mt-0 sm:text-sm">
								<li className="hover:text-primary-200">
									<Link
										href="/innovation-hub"
										className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:text-primary-100 md:hover:bg-transparent md:border-0 md:p-0"
									>
										Innovation Hub
									</Link>
								</li>
							</ul>
						</div>

						<div className="hidden ml-auto md:block">
							<ul className="flex flex-row items-center text-sm font-medium md:space-x-8 lg:space-x-3 xl:space-x-6 md:mt-0 sm:text-sm">
								{/* Dropdowm Menu */}
								<li className="hidden md:block">
									<ul className="relative group dropdown">
										<a
											className="flex items-center dropdown-toggle hidden-arrow"
											href="#"
											id="dropdownMenuButton2"
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											{isAuthenticated && user.attributes.name ? (
												<div className="flex items-center justify-center px-4 py-2 text-sm rounded-full bg-search-100">
													<span className="mr-4">{truncatedName}</span>
													{avatarUrl ? <Image src={avatarUrl} alt="avatar" width="24" height="24" className="rounded-full" /> : null}
												</div>
											) : !user ? (
												<div
													onClick={() => setAuthModalOpen(true)}
													className="flex items-center justify-center px-10 py-2 text-base font-semibold rounded-full bg-search-100"
												>
													Connect wallet
												</div>
											) : (
												<div className="flex items-center justify-center px-4 py-2 text-sm rounded-full bg-search-100">
													<span className="mr-4">User</span>
													{avatarUrl ? <Image src={avatarUrl} alt="avatar" width="24" height="24" className="rounded-full" /> : null}
												</div>
											)}
										</a>

										<ul
											className="absolute right-0 left-auto z-10 hidden text-sm font-medium float-left m-0 text-left list-none border-none rounded-xl shadow-lg dropdown-menu min-w-[250px] 
											backdrop-blur-[40px] backdrop-brightness-200 bg-[rgba(255,255,255)] 
											bg-clip-padding group-hover:block"
											aria-labelledby="dropdownMenuButton2"
										>
											<li>
												{isAuthenticated && user && (
													<div className="flex flex-col px-4 pt-3 pb-2">
														<div className="flex items-center justify-between w-full bg-transparent rounded-t-xl dropdown-item whitespace-nowrap active:bg-transparent">
															<div>
																<p>Wallet Address</p>
																<p>{truncatedWalletAddress}</p>
															</div>
															{avatarUrl ? (
																<Image
																	src={avatarUrl}
																	alt={user.walletAddress}
																	width={40}
																	height={40}
																	objectFit="contain"
																	className="rounded-lg"
																/>
															) : null}
														</div>
														<p className="mt-1">
															Balance:&nbsp;&nbsp;
															<Image src={"/assets/matic-logo.svg"} width={12} height={12} alt="matic logo" /> {balance}
															&nbsp;MATIC
														</p>
													</div>
												)}
											</li>
											{user && isAuthenticated && user.attributes.email && (
												<li>
													<Link href={`/profile/${user.attributes.username}`} passHref={true}>
														<div className="block w-full px-4 py-2 bg-transparent cursor-pointer dropdown-item whitespace-nowrap hover:bg-gray-100">
															Profile
														</div>
													</Link>
												</li>
											)}
											{user && isAuthenticated && user.attributes.email && (
												<li>
													<Link href="/settings/profile-settings" passHref={true}>
														<div className="block w-full px-4 py-2 bg-transparent cursor-pointer dropdown-item whitespace-nowrap hover:bg-gray-100">
															Settings
														</div>
													</Link>
												</li>
											)}
											{user && isAuthenticated && user.attributes.email && (
												<li>
													<Link href="/settings/account-help" passHref={true}>
														<div className="block w-full px-4 py-2 bg-transparent cursor-pointer dropdown-item whitespace-nowrap hover:bg-gray-100">
															Account Help
														</div>
													</Link>
												</li>
											)}
											{user && isAuthenticated && (
												<li>
													<Link href="/contact-us" passHref={true}>
														<div className="block w-full px-4 py-2 bg-transparent cursor-pointer dropdown-item whitespace-nowrap hover:bg-gray-100">
															Contact Us
														</div>
													</Link>
												</li>
											)}

											{/* Logout Button */}
											<li>
												{isAuthenticated && user ? (
													<button
														className="w-full px-4 pt-2 pb-3 font-medium transition-all bg-transparent cursor-pointer rounded-b-xl dark:border-light-300 hover:bg-gray-100"
														onClick={handleLogout}
													>
														<Link
															className="block w-full text-sm dropdown-item whitespace-nowrap hover:bg-primary-500 active:bg-primary-500"
															href="#"
														>
															Sign out
														</Link>
													</button>
												) : (
													<span></span>
												)}
											</li>
										</ul>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
