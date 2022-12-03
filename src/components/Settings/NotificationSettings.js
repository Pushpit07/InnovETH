import { useState, useContext } from "react";
import Notification from "./SettingsUtils/Notification";
import { useMoralisCloudFunction } from "react-moralis";
import StatusContext from "../../../store/status-context";
import CustomButton from "../../layout/CustomButton";
import LoadingContext from "../../../store/loading-context";

export default function NotificationSettings({ walletAddress, userPreferences }) {
	const [, , setSuccess] = useContext(StatusContext);
	const [, setLoading] = useContext(LoadingContext);

	const [newsletter, setNewsletter] = useState(userPreferences.newsletter || false);
	const [tradeNotifications, setTradeNotifications] = useState(userPreferences.tradeNotifications || false);

	// Update User Information
	const newUserPreferences = {
		newsletter: newsletter,
		tradeNotifications: tradeNotifications,
	};
	const { fetch: updateUserPreferences } = useMoralisCloudFunction("updateUserPreferences", newUserPreferences, { autoFetch: false });
	const handleSave = async () => {
		setLoading({
			status: true,
			title: "Updating Preferences...",
		});
		await updateUserPreferences({
			onSuccess: (data) => {
				setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
				setSuccess((prevState) => ({
					...prevState,
					title: "Preferences updated!",
					message: "Your notification preferences have been updated successfully.",
					showSuccessBox: true,
				}));
			},
			onError: (error) => {
				console.log("updateUserPreferences Error:", error);
				setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
			},
		});
		return;
	};

	return (
		<div className="flex-1 p-10 bg-light-300 dark:bg-dark-600 rounded-xl">
			<div className="flex flex-col items-start justify-between w-full space-y-5 md:flex-row md:space-y-0">
				<div className="flex flex-col space-y-5">
					<h1 className="text-4xl font-tertiary">NOTIFICATION PREFERENCES</h1>
					<p className="max-w-[383px] font-secondary text-[13px] md:text-[15px] mb-14">
						<b>Selected wallet address for notifications:</b> <span className="max-w-[300px] turncate">{walletAddress}</span>
					</p>
				</div>
				{/* <button className="px-8 py-2 text-[15px] rounded-3xl bg-dark-600 dark:bg-dark-800 text-light-100 hover:bg-dark-800 font-primary">
					Reset Settings
				</button> */}
			</div>

			<Notification
				heading={"InnovETH Newsletter"}
				description={"Occasional updates from the InnovETH team"}
				toggleSwitch={true}
				toggleState={newsletter}
				setToggleState={setNewsletter}
			/>
			<Notification
				heading={"Trade Notifications"}
				description={"When a collector purchases one of your NFTs"}
				toggleSwitch={true}
				toggleState={tradeNotifications}
				setToggleState={setTradeNotifications}
			/>

			<div className="flex justify-end mt-8" onClick={handleSave}>
				<CustomButton green={true} classes="text-sm px-8 py-3">
					Save Changes
				</CustomButton>
			</div>
		</div>
	);
}
