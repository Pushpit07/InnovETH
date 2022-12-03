import { useState } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import Notification from "./SettingsUtils/Notification";
import CustomButton from "../../layout/CustomButton";
import SwitchAccountModal from "./SettingsUtils/SwitchAccountModal";

export default function AccountHelp() {
	const { user } = useMoralis();
	const [isSwitchAccountModalOpen, setSwitchAccountModalOpen] = useState(false);

	return (
		<div className="flex-1 p-8 pb-12 md:p-10 md:pb-14 bg-light-300 dark:bg-dark-600 rounded-xl">
			<h1 className="mb-6 text-3xl xl:text-4xl font-tertiary">ACCOUNT HELP</h1>
			<p className="max-w-[510px] mb-14 font-secondary text-[15px]">
				Search for any issues related to your NFT or your account. If you don&apos;t find your issue mentioned, you can{" "}
				<Link href="/contact-us" passHref>
					<a target="_blank" rel="noopener noreferrer" className="font-medium text-primary-500">
						contact us
					</a>
				</Link>
				.
			</p>

			<Notification
				heading={"Switch Account"}
				description={
					<>
						{user && user.attributes.isArtist
							? "Do you want to switch to an innovator account?"
							: "Do you want to switch to a project/company account?"}
						<div className="my-2">
							<CustomButton green={true} classes="text-md px-8 py-2" onClick={() => setSwitchAccountModalOpen(true)}>
								Switch Account
							</CustomButton>
						</div>
						{user && user.attributes.isArtist && (
							<p className="text-[#777777] mt-1 font-normal text-xs">
								Please note that this will mean you getting unverified on Musixverse (if you had a verified profile previously)
							</p>
						)}
					</>
				}
				toggleSwitch={false}
			/>
			<Notification
				heading={"General Help"}
				description={
					<>
						Visit our{" "}
						<Link href="/help-center" passHref>
							<a target="_blank" rel="noopener noreferrer" className="font-medium text-primary-500">
								help center
							</a>
						</Link>{" "}
						to learn how to get started with buying, selling, and creating.{" "}
					</>
				}
				toggleSwitch={false}
			/>
			<Notification
				heading={"FAQs"}
				description={
					<>
						Read our FAQs{" "}
						<Link href="/faq" passHref>
							<a className="font-medium text-primary-500">here</a>
						</Link>{" "}
						to learn more about how to buy, sell, and create NFTs on Musixverse.
					</>
				}
				toggleSwitch={false}
			/>
			<Notification
				heading={"Contact Musixverse"}
				description={
					<>
						Can&apos;t find the answers you’re looking for? You can submit a request{" "}
						<Link href="/contact-us" passHref>
							<a className="font-medium text-primary-500">here.</a>
						</Link>
					</>
				}
				toggleSwitch={false}
				lineBreak={false}
			/>

			<SwitchAccountModal isOpen={isSwitchAccountModalOpen} setOpen={setSwitchAccountModalOpen} isArtist={user && user.attributes.isArtist} />
		</div>
	);
}
