import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export default function SettingsNav() {
	const { user } = useMoralis();
	const router = useRouter();
	const [currentSelection, setCurrentSelection] = useState(1);

	useEffect(() => {
		if (router.pathname === "/settings/profile-settings") {
			setCurrentSelection(1);
		} else if (router.pathname === "/settings/band-dashboard") {
			setCurrentSelection(2);
		} else if (router.pathname === "/settings/notifications-settings") {
			setCurrentSelection(3);
		} else if (router.pathname === "/settings/account-help") {
			setCurrentSelection(4);
		}
	}, [router.pathname, setCurrentSelection]);

	return (
		<div className="dark:bg-dark-600 lg:mb-0 mb-8 lg:block md:flex md:justify-between p-8 xl:pl-10 xl:py-10 lg:pr-settingsNav w-fit bg-light-300 rounded-xl max-h-[350px] lg:mr-12 xl:mr-16">
			<h1 className="mb-6 text-3xl md:mb-0 xl:text-4xl font-tertiary lg:mb-9">SETTINGS</h1>
			<div className="space-y-3 md:space-y-0 items-start flex-col flex-none lg:items-start md:items-center lg:flex-none md:flex-1 flex md:flex-row lg:flex-col font-medium font-secondary min-w-[129px] justify-around lg:space-y-5">
				<Link href={"/settings/profile-settings"} passHref>
					<p
						className={
							(currentSelection === 1 ? "text-[#4b9013] text-sm md:text-base max-w-fit" : "text-[#7B7B7B] hover:text-[#4b9013]") +
							" cursor-pointer"
						}
					>
						<i className="mr-3 text-lg md:text-xl fas fa-user-circle"></i>
						Profile
					</p>
				</Link>
				{user && user.attributes.isArtist && (
					<Link href={"/settings/band-dashboard"} passHref>
						<p
							className={
								(currentSelection === 2 ? "text-[#4b9013] text-sm md:text-base w-max" : "text-[#7B7B7B] hover:text-[#4b9013]") +
								" cursor-pointer"
							}
						>
							<i className="mr-3 text-lg md:text-xl fa-solid fa-table-columns"></i>
							Band Dashboard
						</p>
					</Link>
				)}
				<Link href={"/settings/notifications-settings"} passHref>
					<p
						className={
							(currentSelection === 3 ? "text-[#4b9013] text-sm md:text-base max-w-fit" : "text-[#7B7B7B] hover:text-[#4b9013]") +
							" cursor-pointer"
						}
					>
						<i className="mr-3 text-lg md:text-xl fas fa-bell"></i>
						Notifications
					</p>
				</Link>
				<Link href={"/settings/account-help"} passHref>
					<p
						className={
							(currentSelection === 4 ? "text-[#4b9013] text-sm md:text-base max-w-fit" : "text-[#7B7B7B] hover:text-[#4b9013]") +
							" cursor-pointer"
						}
					>
						<i className="mr-3 text-lg md:text-xl fas fa-question-circle"></i>
						Account Help
					</p>
				</Link>
			</div>
		</div>
	);
}
