import { useState, useRef, useContext } from "react";
import Link from "next/link";
import RightSection from "./RegistrationUtils/RightSection";
import styles from "../../../styles/Registration/Company.module.css";
import Button from "./RegistrationUtils/Button";
import SelectAvatar from "./RegistrationUtils/SelectAvatar";
import Router from "next/router";
import { useMoralis, useNewMoralisObject } from "react-moralis";
import StatusContext from "../../../store/status-context";
import { isUsernameValidAndAvailable, isEmailValidAndAvailable } from "../../utils/Validate";
import { defaultAvatarUrls } from "../../constants";

export default function BasicDetails() {
	const [, , , setError] = useContext(StatusContext);
	const { userError, user, setUserData } = useMoralis();
	const { save: saveUserInfo } = useNewMoralisObject("UserInfo");
	const { save: saveUserPreferences } = useNewMoralisObject("UserPreferences");

	const [avatar, setAvatar] = useState(defaultAvatarUrls[0]);

	const nameRef = useRef(null);
	const usernameRef = useRef(null);
	const emailRef = useRef(null);

	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	const handleBasicDetailsSave = async (e) => {
		e.preventDefault();

		// USERNAME CHECK
		const usernameCheck = await isUsernameValidAndAvailable(username);
		if (usernameCheck.status === false) {
			setError({
				title: usernameCheck.title || "Invalid credentials!",
				message: usernameCheck.message,
				showErrorBox: true,
			});
			usernameRef.current.focus();
			return;
		}

		// EMAIL CHECK
		const emailCheck = await isEmailValidAndAvailable(email);
		if (emailCheck.status === false) {
			setError({
				title: emailCheck.title || "Invalid credentials!",
				message: emailCheck.message,
				showErrorBox: true,
			});
			emailRef.current.focus();
			return;
		}

		if (name !== "" && username !== "" && email !== "") {
			await setUserData({
				name: name === "" ? undefined : name,
				username: username === "" ? undefined : username,
				email: email === "" ? undefined : email,
				isArtist: true,
			});

			const userData = {
				user: user,
				userId: user.id,
				avatar: avatar,
				coverImage: "https://gateway.musixverse.com/ipfs/bafkreiappa53xuqsqqqqq5cj6km726wpv2ja2f2zlcgshbtaxfrrh5a36e",
			};
			await saveUserInfo(userData, {
				onSuccess: (obj) => {
					// Execute any logic that should take place after the object is saved.
				},
				onError: (error) => {
					// Execute any logic that should take place if the save fails.
					// error is a Moralis.Error with an error code and message.
					setError((prevState) => ({
						...prevState,
						title: "Failed to save user information",
						message: JSON.stringify(error.message),
						showErrorBox: true,
					}));
					return;
				},
			});

			const userPreferences = {
				user: user,
				userId: user.id,
				newsletter: true,
				tradeNotifications: true,
			};
			await saveUserPreferences(userPreferences, {
				onSuccess: (obj) => {
					// Execute any logic that should take place after the object is saved.
				},
				onError: (error) => {
					setError((prevState) => ({
						...prevState,
						title: "Failed to save user information",
						message: JSON.stringify(error.message),
						showErrorBox: true,
					}));
					return;
				},
			});

			if (userError) {
				setError((prevState) => ({
					...prevState,
					title: "Invalid credentials!",
					message: JSON.stringify(userError.message),
					showErrorBox: true,
				}));
			} else {
				Router.push("/register/confirm-email");
			}
		}

		return;
	};

	return (
		<div className={styles["register"]}>
			<div className={"dark:bg-dark-800 " + styles["register__container"]}>
				{/* Left section */}
				<div className="lg:max-w-[30vw] pb-6 lg:pb-0">
					<p className="mt-20 text-5xl font-tertiary max-w-[468px]">COMPANY/PROJECT SIGN UP</p>
					<p className="text-[15px] font-secondary mt-4 max-w-none lg:max-w-[650px]">
						Artists are the heart and soul of InnovETH. As an artist, you can package your music into limited edition NFTs and sell them directly to
						your fans. In the process, you will establish unique connections that your fans long for. You will also be able to explore, buy, and
						trade NFTs of other artists.
					</p>
					<p className="text-[15px] font-secondary mt-4">Thank you for choosing InnovETH!</p>
				</div>

				{/* Right section */}
				<RightSection>
					<p className="text-5xl font-tertiary max-w-[468px] mb-10">YOUR DETAILS</p>
					<form onSubmit={handleBasicDetailsSave}>
						<SelectAvatar defaultAvatarUrls={defaultAvatarUrls} avatar={avatar} setAvatar={setAvatar} />
						<p className="mt-8 text-[16px] font-secondary font-bold">Your Name</p>
						<input
							type="text"
							ref={nameRef}
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="w-full p-1 border-2 border-gray-500 rounded-md shadow-sm outline-none font-secondary focus:border-primary-500"
						/>
						<div className="flex flex-col sm:flex-row mt-3 text-[16px] font-secondary font-bold space-y-4 sm:space-x-3 sm:space-y-0">
							<div className="flex-1">
								<p>Username</p>
								<input
									type="text"
									ref={usernameRef}
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className="w-full p-1 border-2 border-gray-500 rounded-md shadow-sm outline-none focus:border-primary-500"
								/>
							</div>
							<div className="flex-1">
								<p>Email Address</p>
								<input
									type="email"
									ref={emailRef}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full p-1 border-2 border-gray-500 rounded-md shadow-sm outline-none focus:border-primary-500"
								/>
							</div>
						</div>
						<div className="flex flex-col mt-8">
							<div className="flex items-center justify-start mb-2 space-x-3">
								<input id="permissionCheckbox" type="checkbox" required />
								<label htmlFor="permissionCheckbox" className="text-[16px] font-secondary font-bold cursor-pointer">
									I agree with InnovETH&apos;s&nbsp;
									<Link href="https://drive.google.com/file/d/1Av96OC67-zCfmFuQrAeGT7ruAPcft4Yl/view?usp=sharing" passHref={true}>
										<a target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-primary-600">
											Terms of Services
										</a>
									</Link>
								</label>
							</div>
							<p className="text-[13px] font-secondary lg:max-w-[468px] max-w-none">
								By checking the box above, you agree with InnovETH&apos;s Terms of Services and will abide by them.
							</p>
						</div>
						<Button>Submit</Button>
					</form>
				</RightSection>
			</div>
		</div>
	);
}
