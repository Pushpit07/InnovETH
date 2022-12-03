import Head from "next/head";
import { title_main_page, meta_description } from "../../constants";
import { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logoBlack from "../../../public/logo-black.svg";
import RequiredAsterisk from "../../layout/RequiredAsterisk";
import LoadingContext from "../../../store/loading-context";

const Admin = () => {
	const router = useRouter();
	const [accessError, setAccessError] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [, setLoading] = useContext(LoadingContext);

	const login = async () => {
		setLoading(true);
		const response = await fetch("/api/auth/login", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email, password: password }),
		});

		if (!response.ok) {
			setAccessError(true);
			throw await response.json();
		}

		const data = await response.json();
		if (data.success) {
			router.push("/");
		}
		setLoading(false);
	};

	return (
		<>
			<Head>
				<title>{title_main_page}</title>
				<meta name="description" content={meta_description} />
			</Head>

			<div className="w-screen h-screen flex justify-center items-center authpage-animation">
				<div className="max-w-[48rem] sm:w-[80vw] w-11/12 p-4 pl-10 pb-12 bg-white rounded-lg">
					<div className="relative z-20">
						<div className="w-full flex justify-between">
							<div className="w-full flex flex-col justify-start items-start">
								<Image src={logoBlack} alt="MXV Logo" width="80" height="80" />
							</div>
						</div>
						<div className="w-full flex flex-col sm:flex-row mt-4 pr-4 sm:space-x-10">
							<div className="sm:w-2/5">
								<div className="text-lg font-semibold font-primary">InnovETH</div>
								<p className="text-sm mt-4 pr-14">Please enter login credentials</p>
								<p className="text-[10px] text-gray-400 mt-8 sm:mt-36 pr-14">
									Please contact&nbsp;
									<span className="text-primary-100 hover:text-primary-200">@Pushpit</span>
									&nbsp;to get login credentials.
								</p>
							</div>

							<div className="w-full sm:w-3/5 mt-10 sm:mt-0">
								<form
									onSubmit={async (e) => {
										e.preventDefault();
										await login();
									}}
								>
									<p className="text-sm mb-1">
										Email
										<RequiredAsterisk />
									</p>
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											setAccessError(false);
										}}
										className="w-full p-2 border-2 border-gray-500 rounded-md shadow-sm outline-none focus:border-primary-100 text-sm"
										required
									/>
									<p className="text-sm mt-4 mb-1">
										Password
										<RequiredAsterisk />
									</p>
									<input
										type="password"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											setAccessError(false);
										}}
										className="w-full p-2 border-2 border-gray-500 rounded-md shadow-sm outline-none focus:border-primary-100 text-sm"
										required
									/>
									{accessError && <span className="text-error-200 text-xs mt-1">Invalid credentials</span>}

									<div className="flex justify-end mt-12">
										<button
											type="submit"
											className="flex justify-center items-center space-x-3 bg-primary-100 hover:bg-primary-200 text-[14px] text-light-100 py-2 px-6 rounded-lg font-primary font-semibold max-w-[210px]"
										>
											Submit
											<span className="ml-2 text-xl">
												<i className="fa-solid fa-arrow-right-long"></i>
											</span>
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>

					<ul className="authpage_animation_box_area">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default Admin;
