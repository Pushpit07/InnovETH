import { useState, useContext } from "react";
import { useMoralis } from "react-moralis";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import Modal from "../../../layout/Modal/Modal";
import SwitchAccountSuccessModal from "./SwitchAccountSuccessModal";

const SwitchAccountModal = ({ isOpen, setOpen, isArtist }) => {
	const { Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, , , setError] = useContext(StatusContext);
	const [switchAccountSuccess, setSwitchAccountSuccess] = useState(false);
	const [updatedUser, setUpdatedUser] = useState(false);

	const switchAccount = async (e) => {
		e.preventDefault();

		setLoading({
			status: true,
			title: "Switching Account Type...",
		});
		try {
			setOpen(false);
			const _result = await Moralis.Cloud.run("switchAccountType");
			setUpdatedUser(_result);
			setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
			setSwitchAccountSuccess(true);
		} catch (err) {
			setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
			setOpen(false);
			setError({
				title: err.title || (err.data && err.data.title) || "Oops! Something went wrong.",
				message: err.message || (err.data && err.data.message) || "Please try again later.",
				showErrorBox: true,
			});
		}
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				image={
					<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-5xl text-primary-500">
						<i className="fa-solid fa-repeat"></i>
					</div>
				}
				title={"Switch your account type"}
				content={
					<div>
						{isArtist ? (
							<>
								Are you sure you want to switch to a collector account?
								<p className="text-[#777777] mt-1 font-normal text-xs">
									Please note that this will mean you getting unverified on Musixverse (if you had a verified profile previously)
								</p>
							</>
						) : (
							<>
								Are you sure you want to switch to an artist account?
								<p className="text-[#777777] mt-1 font-normal text-xs">
									Please note that you will only be able to create NFTs after going through the verification process
								</p>
							</>
						)}

						<form onSubmit={switchAccount} className="mt-14">
							<div className="flex justify-center gap-x-4">
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="rounded-lg px-6 py-2 text-lg font-primary font-semibold bg-light-300/60 hover:bg-light-300 dark:bg-dark-800 dark:hover:bg-dark-900"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="rounded-lg px-12 py-2 text-lg font-primary font-semibold bg-primary-500 hover:bg-primary-600 text-light-100"
								>
									Confirm
								</button>
							</div>
						</form>
					</div>
				}
				onClose={() => {
					setOpen(false);
				}}
			></Modal>
			<SwitchAccountSuccessModal isOpen={switchAccountSuccess} isArtist={updatedUser && updatedUser.attributes.isArtist} />
		</>
	);
};

export default SwitchAccountModal;
