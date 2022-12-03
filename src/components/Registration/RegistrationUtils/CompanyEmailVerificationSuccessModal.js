import Modal from "../../../layout/Modal/Modal";
import { useRouter } from "next/router";
import SuccessConfetti from "../../../layout/Confetti/SuccessConfetti";

const CompanyEmailVerificationSuccessModal = ({ isOpen, setOpen }) => {
	const router = useRouter();

	return (
		<>
			<Modal
				isOpen={isOpen}
				image={
					<div className="relative flex items-center justify-center w-24 h-24 mx-auto text-6xl">
						<label className="flex items-center justify-center border-2 rounded-full w-14 h-14 border-primary-600">
							<i className="text-2xl fa-solid fa-check text-primary-600"></i>
						</label>
					</div>
				}
				title={"Your email has been verified!"}
				content={
					<div>
						You can now browse and explore innovations on InnovETH.
						<br />
						Click the button below to go to the innovation hub.
					</div>
				}
				onClose={() => {
					setOpen(false);
					router.push(`/innovation-hub`);
				}}
				buttons={[
					{
						role: "custom",
						onClick: () => {
							setOpen(false);
							router.push(`/innovation-hub`);
						},
						toClose: true,
						classes:
							"flex items-center px-4 py-3 mr-2 mb-2 text-sm font-primary font-bold rounded-md bg-primary-500 hover:bg-primary-600 text-light-100",
						label: (
							<>
								Verify Profile
								<span className="ml-8 text-xl">
									<i className="fa-solid fa-arrow-right-long"></i>
								</span>
							</>
						),
					},
				]}
			></Modal>
			{isOpen && <SuccessConfetti />}
		</>
	);
};

export default CompanyEmailVerificationSuccessModal;
