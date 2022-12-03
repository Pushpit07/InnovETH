import CoverPhoto from "./CoverPhoto";
import UserInfo from "./UserInfo";

export default function CoverPhotoSection({
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
	country,
	setCountry,
	state,
	setState,
	city,
	setCity,
	isBandSettings,
}) {
	return (
		<div className="flex-1 mt-10 md:ml-20 md:mt-0 content-between">
			<CoverPhoto coverImage={coverImage} setCoverImage={setCoverImage} />
			<UserInfo
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
				isBandSettings={isBandSettings}
			/>
		</div>
	);
}
