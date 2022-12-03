import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Moralis from "moralis/node";
import { PARSE_APP_ID, PARSE_SERVER_URL, meta_description } from "../../constants";
import SettingsNav from "../../components/Settings/SettingsNav";
import ProfileSettings from "../../components/Settings/ProfileSettings";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import StatusContext from "../../../store/status-context";
import LoadingContext from "../../../store/loading-context";
import { isNameValid, isUsernameValidAndAvailable, isEmailValidAndAvailable } from "../../utils/Validate";

export async function getServerSideProps(context) {
	try {
		const user = JSON.parse(context.req.cookies.currentUser);
		const _userId = user.objectId;
		await Moralis.start({ serverUrl: PARSE_SERVER_URL, appId: PARSE_APP_ID });

		const userData = await Moralis.Cloud.run("fetchUserInfo", { userId: _userId });

		return {
			props: { userData }, // will be passed to the page component as props
		};
	} catch (error) {
		return { notFound: true, props: {} };
	}
}

export default function Settings({ userData }) {
	const { user, setUserData, Moralis, refetchUserData } = useMoralis();
	const router = useRouter();
	// Context Management
	const [, setLoading] = useContext(LoadingContext);
	const [, , setSuccess, setError] = useContext(StatusContext);
	// State Management
	const [avatar, setAvatar] = useState(userData.avatar ?? "");
	const [coverImage, setCoverImage] = useState(userData.coverImage ?? "");
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [bio, setBio] = useState(userData.bio ?? "");
	const [spotify, setSpotify] = useState(userData.spotify ?? "");
	const [instagram, setInstagram] = useState(userData.instagram ?? "");
	const [twitter, setTwitter] = useState(userData.twitter ?? "");
	const [facebook, setFacebook] = useState(userData.facebook ?? "");
	const [country, setCountry] = useState(userData.country ?? "");
	const [state, setState] = useState(userData.state ?? "");
	const [city, setCity] = useState(userData.city ?? "");
	const [balance, setBalance] = useState(0);

	useEffect(() => {
		setLoading({
			status: true,
		});

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
			setName(user.attributes.name);
			setUsername(user.attributes.username);
			setEmail(user.attributes.email);
		}
		setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	}, [user, setLoading, Moralis.Web3API.account]);

	// Update User Information
	const updatedUserData = {
		avatar: avatar,
		coverImage: coverImage,
		bio: bio === "" ? undefined : bio,
		spotify: spotify === "" ? undefined : spotify,
		instagram: instagram === "" ? undefined : instagram,
		twitter: twitter === "" ? undefined : twitter,
		facebook: facebook === "" ? undefined : facebook,
		country: country === "" ? undefined : country,
		state: state === "" ? undefined : state,
		city: city === "" ? undefined : city,
	};
	const { fetch: updateUserInfo } = useMoralisCloudFunction("updateUserInfo", updatedUserData, { autoFetch: false });
	const handleSave = async () => {
		try {
			// Name CHECK
			const nameCheck = await isNameValid(name);
			if (nameCheck.status === false) {
				setError({
					title: nameCheck.title || "Invalid credentials!",
					message: nameCheck.message,
					showErrorBox: true,
				});
				return;
			}

			if (name !== "" && username !== "" && email !== "") {
				if (email === user.attributes.email && username === user.attributes.username && name === user.attributes.name) {
					// do nothing
				} else if (email === user.attributes.email && username === user.attributes.username) {
					setUserData({
						name: name === "" ? undefined : name,
					});
				} else if (email === user.attributes.email) {
					// USERNAME CHECK
					const usernameCheck = await isUsernameValidAndAvailable(username);
					if (usernameCheck.status === false) {
						setError({
							title: usernameCheck.title || "Invalid credentials!",
							message: usernameCheck.message,
							showErrorBox: true,
						});
						return;
					}
					setUserData({
						name: name === "" ? undefined : name,
						username: username === "" ? undefined : username,
					});
				} else {
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
					await setUserData({
						name: name === "" ? undefined : name,
						username: username === "" ? undefined : username,
						email: email === "" ? undefined : email,
					});
					router.push("/register/confirm-email");
				}

				await updateUserInfo({
					onSuccess: async (data) => {
						setSuccess((prevState) => ({
							...prevState,
							title: "Profile updated!",
							message: "Your profile has been updated successfully.",
							showSuccessBox: true,
						}));
						await fetch(`/api/revalidate-profile?path=/profile/${username}&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`);
					},
				});

				await refetchUserData();
			}
		} catch (error) {
			console.log("ERROR-", error);
		}
		return;
	};

	return (
		<>
			<Head>
				<title>Musixverse | Settings</title>
				<meta name="description" content={meta_description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex items-center justify-center bg-light-200 dark:bg-dark-800">
				<div className="lg:flex-row flex-col flex w-full max-w-[1920px] mt-28 lg:mt-36 px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
					<SettingsNav />
					<ProfileSettings
						avatar={avatar}
						setAvatar={setAvatar}
						coverImage={coverImage}
						setCoverImage={setCoverImage}
						username={username}
						setUsername={setUsername}
						name={name}
						setName={setName}
						email={email}
						setEmail={setEmail}
						bio={bio}
						setBio={setBio}
						spotify={spotify}
						setSpotify={setSpotify}
						instagram={instagram}
						setInstagram={setInstagram}
						twitter={twitter}
						setTwitter={setTwitter}
						facebook={facebook}
						setFacebook={setFacebook}
						country={country}
						setCountry={setCountry}
						state={state}
						setState={setState}
						city={city}
						setCity={setCity}
						handleSave={handleSave}
						balance={balance}
						walletAddress={user ? user.attributes.ethAddress : ""}
					/>
				</div>
			</div>
		</>
	);
}
