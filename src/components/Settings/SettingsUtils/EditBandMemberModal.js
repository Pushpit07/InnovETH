import { useContext } from "react";
import Image from "next/image";
import { useMoralisCloudFunction } from "react-moralis";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import Modal from "../../../layout/Modal/Modal";

const EditBandMemberModal = ({ isOpen, setOpen, bandId, username, bandMemberToEdit, setBandMemberToEdit, setBandMembersList }) => {
	const [, setLoading] = useContext(LoadingContext);
	const [, , setSuccess, setError] = useContext(StatusContext);

	const { fetch: updateBandMemberRole } = useMoralisCloudFunction(
		"updateBandMemberRole",
		{ bandId: bandId, bandMember: bandMemberToEdit },
		{ autoFetch: false }
	);

	const updateBandMember = async () => {
		setLoading({
			status: true,
			title: "Updating Member Info...",
		});

		await updateBandMemberRole({
			onSuccess: async (object) => {
				setSuccess((prevState) => ({
					...prevState,
					title: "Updated Member Info",
					message: "Band member's info was updated successfully!",
					showSuccessBox: true,
				}));
				await fetch(`/api/revalidate-profile?path=/profile/band/${username}&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`);

				setBandMembersList((current) =>
					current.map((bandMember) => {
						if (bandMember._id === bandMemberToEdit._id) {
							return { ...bandMember, role: bandMemberToEdit.role };
						}
						return bandMember;
					})
				);
			},
			onError: (error) => {
				setError((prevState) => ({
					...prevState,
					title: "Info Updation Failed",
					message: "There was a problem in updating the info. Please try again",
					showErrorBox: true,
				}));
				console.log("updateBandMemberRole Error:", error);
			},
		});

		setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
		setOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-5xl">
					<i className="fa-solid fa-edit"></i>
				</div>
			}
			title={"Update Member Info"}
			content={
				<div>
					{bandMemberToEdit && (
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								await updateBandMember();
							}}
						>
							<div className="flex justify-center">
								<Image src={bandMemberToEdit.avatar} height={120} width={120} alt="Band member avatar" className="rounded" />

								<div className="ml-6 flex flex-col place-content-between">
									<div className="flex flex-col items-start">
										<p className="text-lg font-semibold">{bandMemberToEdit.name}</p>
										<p className="text-xs">@{bandMemberToEdit.username}</p>
									</div>
									<p className="text-xs text-start">{bandMemberToEdit.role}</p>
								</div>
							</div>

							<p className="text-base font-semibold text-start mt-8">Role</p>
							<input
								className="mt-1 dark:text-light-100 dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-[#777777] focus:border-primary-500"
								type="text"
								placeholder="Role"
								value={bandMemberToEdit.role}
								onChange={(e) => {
									setBandMemberToEdit({ ...bandMemberToEdit, role: e.target.value });
								}}
								required
							/>

							<div className="flex justify-end">
								<button
									type="submit"
									className="flex items-center mt-10 -mb-6 px-6 py-2 text-sm font-primary font-bold rounded-md bg-primary-500 hover:bg-primary-600 text-light-100"
								>
									Save
									<span className="ml-6 text-lg">
										<i className="fa-solid fa-arrow-right-long"></i>
									</span>
								</button>
							</div>
						</form>
					)}
				</div>
			}
			onClose={() => {
				setOpen(false);
			}}
		></Modal>
	);
};

export default EditBandMemberModal;
