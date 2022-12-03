import ProfileSection1 from "./SettingsUtils/ProfileSection1";
import ProfileSection2 from "./SettingsUtils/ProfileSection2";
import ProfileSection3 from "./SettingsUtils/ProfileSection3";

export default function ProfileSettings({
	avatar,
	setAvatar,
	coverImage,
	setCoverImage,
	username,
	setUsername,
	name,
	setName,
	email,
	setEmail,
	bio,
	setBio,
	spotify,
	setSpotify,
	instagram,
	setInstagram,
	twitter,
	setTwitter,
	facebook,
	setFacebook,
	country,
	setCountry,
	state,
	setState,
	city,
	setCity,
	handleSave,
	balance,
	walletAddress,
}) {
	return (
		<form
			className="flex-1 mb-32"
			onSubmit={async (e) => {
				e.preventDefault();
				await handleSave();
			}}
		>
			{/* Section 1 */}
			<ProfileSection1
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
				country={country}
				setCountry={setCountry}
				state={state}
				setState={setState}
				city={city}
				setCity={setCity}
			/>
			{/* Section 2 */}
			<ProfileSection2
				spotify={spotify}
				setSpotify={setSpotify}
				instagram={instagram}
				setInstagram={setInstagram}
				twitter={twitter}
				setTwitter={setTwitter}
				facebook={facebook}
				setFacebook={setFacebook}
			/>
			{/* Section 3 */}
			<ProfileSection3 balance={balance} walletAddress={walletAddress} />
		</form>
	);
}
