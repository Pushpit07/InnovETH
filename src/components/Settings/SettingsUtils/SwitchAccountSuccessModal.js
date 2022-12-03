import Modal from "../../../layout/Modal/Modal";
import { useRouter } from "next/router";

const SwitchAccountSuccessModal = ({ isOpen, isArtist }) => {
	const router = useRouter();

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-6xl">
					<label className="flex justify-center items-center w-14 h-14 border-2 rounded-full border-primary-600">
						<i className="fa-solid fa-check text-2xl text-primary-600"></i>
					</label>
				</div>
			}
			title={"Account type switched successfully"}
			content={
				<div>
					{isArtist ? (
						<>
							You have successfully switched to an artist account. You can now create NFTs and sell them on InnovETH.
							<p className="text-[#777777] mt-1 font-normal text-xs">
								Please note that you will only be able to create NFTs after going through the verification process.
							</p>
						</>
					) : (
						<>You have successfully switched to a collector account. You can now buy NFTs on InnovETH.</>
					)}
				</div>
			}
			onClose={() => {
				router.reload(window.location.pathname);
			}}
		></Modal>
	);
};

export default SwitchAccountSuccessModal;
