import { useContext } from "react";
import Image from "next/image";
import { useMoralisCloudFunction } from "react-moralis";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import Modal from "../../../layout/Modal/Modal";

const RemoveBandMemberModal = ({ isOpen, setOpen, bandId, username, bandMemberToEdit, setBandMembersList }) => {
	const [, setLoading] = useContext(LoadingContext);
	const [, , setSuccess, setError] = useContext(StatusContext);

	const { fetch: removeBandMember } = useMoralisCloudFunction("removeBandMember", { bandId: bandId, bandMember: bandMemberToEdit }, { autoFetch: false });

	const removeSelectedBandMember = async () => {
		setLoading({
			status: true,
			title: "Removing Member from Band...",
		});

		await removeBandMember({
			onSuccess: async (object) => {
				setSuccess((prevState) => ({
					...prevState,
					title: "Removed Band Member",
					message: "Selected Band Member was removed successfully!",
					showSuccessBox: true,
				}));
				await fetch(`/api/revalidate-profile?path=/profile/band/${username}&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`);

				setBandMembersList((prevState) => {
					const bandMembers = prevState.filter((bandMember) => bandMember._id !== bandMemberToEdit._id);
					return bandMembers;
				});
			},
			onError: (error) => {
				setError((prevState) => ({
					...prevState,
					title: "Member Removal Failed",
					message: "There was a problem in removing the band member. Please try again",
					showErrorBox: true,
				}));
				console.log("removeBandMember Error:", error);
			},
		});

		setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
		setOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-4xl">
					<i className="fa-solid fa-trash"></i>
				</div>
			}
			title={"Remove Band Member"}
			content={
				<div>
					{bandMemberToEdit && (
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								await removeSelectedBandMember();
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

							<p className="text-sm font-semibold text-center mt-10">Are you sure you want to remove {bandMemberToEdit.name}?</p>

							<div className="flex justify-end">
								<button
									type="submit"
									className="flex items-center mt-10 -mb-6 px-6 py-2 text-sm font-primary font-bold rounded-md bg-error-400 hover:bg-error-500 text-light-100"
								>
									Remove
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

export default RemoveBandMemberModal;
