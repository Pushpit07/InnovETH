import CountriesDropdown from "./CountriesDropdown";
import StatesDropdown from "./StatesDropdown";
import CitiesDropdown from "./CitiesDropdown";
import Tooltip from "../../../layout/Tooltip/Tooltip";

export default function UserInfo({
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
		<div className="flex-col flex-1 mt-5 md:mt-7">
			<div className="flex space-x-2 md:space-x-4">
				<div className="flex-1 text-sm font-medium md:text-base font-secondary">
					<p className="mb-1">Name</p>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						id="name"
						placeholder="Enter name"
						spellCheck={false}
						className="dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-md shadow-sm outline-none border-light-100 focus:border-primary-500"
					/>
				</div>
				<div className="flex-1 text-sm font-medium md:text-base font-secondary">
					<p className="mb-1">Username</p>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						id="username"
						placeholder="Enter username"
						spellCheck={false}
						className="dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-md shadow-sm outline-none border-light-100 focus:border-primary-500"
					/>
				</div>
				{!isBandSettings && (
					<div className="flex-1 text-sm font-medium md:text-base font-secondary">
						<p className="mb-1">Email Address</p>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							id="email"
							placeholder="Enter your email"
							spellCheck={false}
							className="dark:bg-[#242424] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-md shadow-sm outline-none border-light-100 focus:border-primary-500"
						/>
					</div>
				)}
			</div>

			{!isBandSettings && (
				<div className="flex space-x-2 md:space-x-4 mt-4">
					<div className="flex-1 text-sm font-medium md:text-base font-secondary">
						<p className="mb-1">
							Country
							<Tooltip
								labelText={<i className="ml-2 text-base md:text-lg fa fa-info-circle"></i>}
								message={
									"Fans like to discover artists located near them, but we value your privacy and therefore store your location information only if you give consent."
								}
								tooltipLocation={"bottom"}
							/>
						</p>
						<CountriesDropdown
							setChoice={setCountry}
							initialValue={country}
							onReset={() => {
								setState("");
								setCity("");
							}}
						/>
					</div>
					<div className="flex-1 text-sm font-medium md:text-base font-secondary">
						{country && country.isoCode && (
							<>
								<p className="mb-1">State</p>
								<StatesDropdown
									setChoice={setState}
									initialValue={state}
									country={country}
									onReset={() => {
										setCity("");
									}}
								/>
							</>
						)}
					</div>
					<div className="flex-1 text-sm font-medium md:text-base font-secondary">
						{country && country.isoCode && state && state.isoCode && (
							<>
								<p className="mb-1">City</p>
								<CitiesDropdown setChoice={setCity} initialValue={city} country={country} state={state} />
							</>
						)}
					</div>
				</div>
			)}

			<div className="flex-1 mt-4 font-medium font-secondary">
				<p className="mb-1 text-sm md:text-base">Bio</p>
				<textarea
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					id="bio"
					placeholder="Tell your story to the world..."
					className="resize-none w-full h-[106px] border-2 border-light-100 dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 focus:border-primary-500 rounded-lg outline-none px-4 py-3 text-sm"
				></textarea>
			</div>
		</div>
	);
}
