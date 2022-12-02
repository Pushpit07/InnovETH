import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import logoBlack from "../../../public/logo-black.svg";
import LoadingContext from "../../../store/loading-context";
import AuthModalContext from "../../../store/authModal-context";

const Navbar = ({}) => {
	const router = useRouter();
	const { isAuthenticated, user, logout } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, setAuthModalOpen] = useContext(AuthModalContext);

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
		setLoading(true);
		const response = await fetch("/api/auth/logout", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			throw await response.json();
		}

		const data = await response.json();
		if (data.success) {
			router.push("/auth");
		}
		setLoading(false);
	};

	let truncatedWalletAddress;
	if (user && user.attributes.ethAddress) {
		truncatedWalletAddress = user.attributes.ethAddress.substring(0, 10) + "..." + user.attributes.ethAddress.substring(36, 42);
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
										href="/artist-verification"
										className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:text-primary-100 md:hover:bg-transparent md:border-0 md:p-0"
									>
										Artist Verification
									</Link>
								</li>

								<li className="hover:text-primary-200">
									<Link
										href="/users"
										className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:text-primary-100 md:hover:bg-transparent md:border-0 md:p-0"
									>
										Users
									</Link>
								</li>
							</ul>
						</div>

						<div className="hidden ml-auto md:block">
							<ul className="flex flex-row items-center text-sm font-medium md:space-x-8 lg:space-x-3 xl:space-x-6 md:mt-0 sm:text-sm">
								{/* Dropdowm Menu */}
								{isAuthenticated && user ? (
									<div className="group">
										<li className="hidden md:block">
											<ul className="relative group dropdown">
												<div className="block group-hover:hidden items-center justify-center px-10 py-2 text-base font-semibold rounded-full bg-light-200">
													<span>{truncatedWalletAddress}</span>
												</div>
											</ul>
										</li>
										<li className="hidden md:block">
											<ul className="relative group dropdown">
												<div
													onClick={async () => {
														await logout();
														if (window.localStorage.walletconnect) {
															window.localStorage.removeItem("walletconnect");
														}
													}}
													className="hidden group-hover:block items-center justify-center px-10 py-2 text-base font-semibold rounded-full bg-error-200/10 cursor-pointer"
												>
													<span>Disconnect Wallet</span>
												</div>
											</ul>
										</li>
									</div>
								) : (
									<div className="group">
										<li className="hidden md:block">
											<ul className="relative group dropdown">
												<div className="block group-hover:hidden items-center justify-center px-10 py-2 text-base font-semibold rounded-full bg-light-200">
													<span>Wallet not connected</span>
												</div>
											</ul>
										</li>
										<li className="hidden md:block">
											<ul className="relative group dropdown">
												<div
													onClick={async () => {
														setAuthModalOpen(true);
													}}
													className="hidden group-hover:block items-center justify-center px-10 py-2 text-base font-semibold rounded-full bg-primary-200/20 cursor-pointer"
												>
													<span>Connect Wallet</span>
												</div>
											</ul>
										</li>
									</div>
								)}

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
											<div
												onClick={() => handleLogout()}
												className="flex items-center justify-center px-10 py-2 text-base font-semibold rounded-full bg-search-100"
											>
												Logout
											</div>
										</a>
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
