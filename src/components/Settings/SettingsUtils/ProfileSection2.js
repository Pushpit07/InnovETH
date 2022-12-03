import CustomButton from "../../../layout/CustomButton";

export default function ProfileSection2({ spotify, setSpotify, instagram, setInstagram, twitter, setTwitter, facebook, setFacebook }) {
	// const authorizeTwitter = async () => {
	// 	setLoading(true);
	// 	await fetch(process.env.NEXT_PUBLIC_MUSIXVERSE_SERVER_BASE_URL + "/api/twitter-auth/authorize", {
	// 		method: "POST",
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			if (typeof window !== "undefined") {
	// 				sessionStorage.setItem("oauth_token", data.responseData.oauth_token);
	// 				sessionStorage.setItem("oauth_token_secret", data.responseData.oauth_token_secret);
	// 			}
	// 			window.open(data.responseData.url, "_self");
	// 			setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	// 		})
	// 		.catch((err) => {
	// 			console.log("authorizeTwitter error:", err);
	// 		});
	// };

	// // Twitter Auth Check
	// const [isTwitterAccountConnected, setIsTwitterAccountConnected] = useState(false);
	// const { fetch: fetchTwitterAccountConnectionStatus } = useMoralisCloudFunction("getTwitterAccountConnectionStatus");
	// useEffect(() => {
	// 	fetchTwitterAccountConnectionStatus({
	// 		onSuccess: async (res) => {
	// 			setIsTwitterAccountConnected(res);
	// 		},
	// 		onError: (error) => {
	// 			console.log("fetchTwitterAccountConnectionStatus Error:", error);
	// 		},
	// 	});
	// }, [fetchTwitterAccountConnectionStatus]);
	// const verifyTwitterOAuth = async (oauth_verifier) => {
	// 	await fetch(process.env.NEXT_PUBLIC_MUSIXVERSE_SERVER_BASE_URL + "/api/twitter-auth/verify-oauth", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			oauth_token: sessionStorage.getItem("oauth_token"),
	// 			oauth_token_secret: sessionStorage.getItem("oauth_token_secret"),
	// 			oauth_verifier: oauth_verifier,
	// 			userId: user.id,
	// 		}),
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			router.replace("/profile/verify", undefined, { shallow: true });
	// 			setIsTwitterAccountConnected(data.responseData);
	// 		})
	// 		.catch((err) => {
	// 			console.log("verifyTwitterOAuth error:", err);
	// 		});
	// };
	// const router = useRouter();
	// const { oauth_token, oauth_verifier } = router.query;
	// useEffect(() => {
	// 	if (user && oauth_token && oauth_verifier) {
	// 		setStep(2);
	// 		verifyTwitterOAuth(oauth_verifier);
	// 	} else if (router.query.step === "2") {
	// 		setStep(2);
	// 		router.replace("/profile/verify", undefined, { shallow: true });
	// 	}
	// }, [oauth_token, oauth_verifier, user]);

	// const verifyIdentityVerificationTweet = async () => {
	// 	setLoading(true);
	// 	if (!isTwitterAccountConnected) {
	// 		setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	// 		setError({
	// 			title: "Twitter account not connected",
	// 			message: "You need to connect your Twitter account to continue",
	// 			showErrorBox: true,
	// 		});
	// 		return;
	// 	}
	// 	await fetch(process.env.NEXT_PUBLIC_MUSIXVERSE_SERVER_BASE_URL + "/api/twitter-auth/verify-tweet", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			userId: user.id,
	// 		}),
	// 	})
	// 		.then((res) => res.json())
	// 		.then(async (data) => {
	// 			if (data.code === 200) {
	// 				setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	// 				setSuccess({
	// 					title: "You've been verified successfully",
	// 					message: "You'll be redirected to your profile page now",
	// 					showSuccessBox: true,
	// 				});
	// 				await sleep(1500);
	// 				router.replace(`/profile/${user.attributes.username}`, undefined, { shallow: true });
	// 			} else {
	// 				setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	// 				setError({
	// 					title: "Tweet Missing",
	// 					message: "Please send the tweet to complete verification",
	// 					showErrorBox: true,
	// 				});
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	// 			console.log("verifyIdentityVerificationTweet error:", err);
	// 		});
	// };

	return (
		<div className="w-full p-8 mt-10 xl:p-10 bg-light-300 dark:bg-dark-600 rounded-xl">
			<h1 className="mb-8 text-3xl xl:text-4xl font-tertiary min-w-fit">SOCIAL PROFILES</h1>
			<div className="flex flex-col mb-10 md:mb-6 md:flex-row">
				<div className="mb-10 md:mb-0 md:mr-2 xl:mr-8 font-secondary">
					<h3 className="mb-1 text-lg font-medium md:mb-4">Add accounts</h3>
					<p className="max-w-[320px] md:max-w-[219px] text-[15px]">
						Social Accounts help collectors verify your profile and provide more information about you.
					</p>
				</div>
				{/* Socials URLs input fields */}
				<div className="flex flex-col flex-1 space-y-2 md:space-y-4">
					<div className="flex flex-col w-full space-y-2 md:flex-row md:space-x-4 md:space-y-0">
						<div className="flex-1 text-sm font-medium md:text-base font-secondary">
							<p className="mb-1">Spotify account</p>
							<input
								type="url"
								value={spotify}
								onChange={(e) => setSpotify(e.target.value)}
								id="spotify"
								placeholder="Enter account url"
								spellCheck={false}
								className="dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-light-100 focus:border-primary-500"
							/>
						</div>
						<div className="flex-1 text-sm font-medium md:text-base font-secondary">
							<p className="mb-1">Instagram account</p>
							<input
								type="url"
								value={instagram}
								onChange={(e) => setInstagram(e.target.value)}
								id="instagram"
								placeholder="Enter account url"
								spellCheck={false}
								className="dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-light-100 focus:border-primary-500"
							/>
						</div>
					</div>
					<div className="flex flex-col w-full space-y-2 md:flex-row md:space-x-4 md:space-y-0">
						<div className="flex-1 text-sm font-medium md:text-base font-secondary">
							<p className="mb-1">Twitter account</p>
							<input
								type="url"
								value={twitter}
								onChange={(e) => setTwitter(e.target.value)}
								id="twitter"
								placeholder="Enter account url"
								spellCheck={false}
								className="dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-light-100 focus:border-primary-500"
							/>
							{/* <ConnectionButton
								onClick={() => authorizeTwitter()}
								connectionStatus={false}
								buttonText="Connect Twitter"
								verifiedText="Twitter account connected successfully"
							/> */}
						</div>
						<div className="flex-1 text-sm font-medium md:text-base font-secondary">
							<p className="mb-1">Facebook account</p>
							<input
								type="url"
								value={facebook}
								onChange={(e) => setFacebook(e.target.value)}
								id="facebook"
								placeholder="Enter account url"
								spellCheck={false}
								className="dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-light-100 focus:border-primary-500"
							/>
						</div>
					</div>
				</div>
			</div>

			<CustomButton green={true} classes="text-sm px-8 py-3">
				Save Changes
			</CustomButton>
		</div>
	);
}
