import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import mxv_tick from "/public/assets/mxv_tick.svg";
import Tooltip from "../../../layout/Tooltip/Tooltip";
import dynamic from "next/dynamic";
const SendInviteModal = dynamic(() => import("../../../layout/Modal/SendInviteModal"));
const EditBandMemberModal = dynamic(() => import("./EditBandMemberModal"));
const RemoveBandMemberModal = dynamic(() => import("./RemoveBandMemberModal"));
const AddBandMemberModal = dynamic(() => import("./AddBandMemberModal"));

const BandMembers = ({ bandId, username, bandMembers, updatedBandMembersList }) => {
	const { Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, , setSuccess, setError] = useContext(StatusContext);

	// Invite artist modal states
	const [isInvitationModalOpen, setInvitationModalOpen] = useState(false);
	const [invitedArtistEmail, setInvitedArtistEmail] = useState("");

	const [bandMembersList, setBandMembersList] = useState([]);
	useEffect(() => {
		const _memberList = [];
		bandMembers.map((bandMember) => {
			updatedBandMembersList.map((updatedBandMember) => {
				if (bandMember.userId === updatedBandMember._id) {
					updatedBandMember.role = bandMember.role;
					updatedBandMember.hasAcceptedBandInvite = bandMember.hasAcceptedBandInvite;
					_memberList.push(updatedBandMember);
				}
			});
		});
		setBandMembersList(_memberList);
	}, [bandMembers, updatedBandMembersList]);

	// Edit Band Member Info
	const [bandMemberToEdit, setBandMemberToEdit] = useState(null);
	const [isEditBandMemberModalOpen, setEditBandMemberModalOpen] = useState(false);

	// Remove Band Member Modal
	const [isRemoveBandMemberModalOpen, setRemoveBandMemberModalOpen] = useState(false);
	// Add Band Member Modal
	const [isAddBandMemberModalOpen, setAddBandMemberModalOpen] = useState(false);

	const sendBandInvitationEmailToArtistWhoHasNotAcceptedInvitation = async (member) => {
		setLoading({
			status: true,
			title: "Sending Invite...",
		});

		try {
			await Moralis.Cloud.run("sendBandInvitationEmailToArtist", { bandId: bandId, bandMember: member }).then(() => {
				setSuccess((prevState) => ({
					...prevState,
					title: "Band Invitation Sent",
					message: `Band invite email was sent successfully to ${member.name}!`,
					showSuccessBox: true,
				}));
			});
		} catch (error) {
			setError((prevState) => ({
				...prevState,
				title: "Band Invitation Error",
				message: "There was a problem in sending the band invitation. Please try again",
				showErrorBox: true,
			}));
			console.log("sendBandInvitationEmailToArtist Error:", error);
		}

		setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
	};

	return (
		<div className="w-full mt-10 p-8 xl:p-10 bg-light-300 dark:bg-dark-600 rounded-xl">
			<p className="font-tertiary text-4xl">Band Members</p>

			<div className="flex flex-col items-start justify-start mt-8">
				{bandMembersList &&
					bandMembersList.map((member) => {
						return (
							<div key={member._id || member.userId} className="w-full flex items-center justify-start mt-2 gap-6">
								<div className="w-full sm:w-1/2 flex px-6 py-2 rounded-full items-center justify-center hover:bg-light-200 dark:hover:bg-dark-800">
									<Link href={`/profile/${member.username}`} passHref>
										<a target="_blank" rel="noopener noreferrer" className="w-full flex text-start cursor-pointer">
											<div className="flex flex-col self-center mr-2">
												{member.hasAcceptedBandInvite ? (
													<Tooltip
														labelText={
															<span className="text-primary-600 text-xl">
																<i className="fa-solid fa-circle-check"></i>
															</span>
														}
														message={"Artist has accepted band invite."}
														tooltipLocation={"left"}
													/>
												) : (
													<Tooltip
														labelText={
															<span className="text-error-600 text-xl">
																<i className="fa-solid fa-circle-xmark"></i>
															</span>
														}
														message={"Artist hasn't accepted band invite yet."}
														tooltipLocation={"left"}
													/>
												)}
											</div>
											<Image src={member.avatar} height={50} width={50} alt="Band member avatar" className="rounded-full" />
											<div className="w-full flex justify-between">
												<div className="flex flex-col place-content-between">
													<p className="ml-4 text-sm font-semibold">
														{member.name}
														{member.isArtistVerified && (
															<span className="ml-1">
																<Image src={mxv_tick} width={14} height={14} alt="mxv_verified" className="ml-10" />
															</span>
														)}
													</p>
													<p className="ml-4 text-xs items-end">@{member.username}</p>
												</div>
												<div className="flex flex-col self-center">
													<p className="text-xs">{member.role}</p>
												</div>
											</div>
										</a>
									</Link>
								</div>

								<span
									onClick={() => {
										setBandMemberToEdit(member);
										setEditBandMemberModalOpen(true);
									}}
									className="text-sm bg-primary-500/30 hover:bg-primary-500/60 cursor-pointer px-6 py-1 rounded-full"
								>
									Edit
								</span>
								<span
									onClick={() => {
										setBandMemberToEdit(member);
										setRemoveBandMemberModalOpen(true);
									}}
									className="text-sm bg-error-600/30 hover:bg-error-600/60 cursor-pointer px-6 py-1 rounded-full"
								>
									Remove
								</span>

								{!member.hasAcceptedBandInvite && (
									<span
										onClick={() => {
											sendBandInvitationEmailToArtistWhoHasNotAcceptedInvitation(member);
										}}
										className="text-sm bg-primary-500/30 hover:bg-primary-500/60 cursor-pointer px-6 py-1 rounded-full"
									>
										Send Invite Email
									</span>
								)}
							</div>
						);
					})}
			</div>

			{bandMembersList && bandMembersList.length < 10 && (
				<div className="flex items-center justify-start mt-4">
					<button
						type="button"
						className="rounded-full flex justify-center items-center w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white"
						onClick={() => {
							setAddBandMemberModalOpen(true);
						}}
					>
						+
					</button>
					<span className="pl-3 text-sm font-normal">Add more members</span>
				</div>
			)}

			<p className="text-xs text-[#777777] font-normal mt-6">
				Can&apos;t find your fellow band member here? Invite them to Musixverse-&nbsp;
				<a onClick={() => setInvitationModalOpen(true)} className="cursor-pointer text-primary-600 hover:underline">
					Send an invite
				</a>
			</p>

			<SendInviteModal
				isOpen={isInvitationModalOpen}
				setOpen={setInvitationModalOpen}
				onClose={() => setInvitedArtistEmail("")}
				invitedArtistEmail={invitedArtistEmail}
				onEmailChange={(value) => setInvitedArtistEmail(value)}
			/>
			<EditBandMemberModal
				isOpen={isEditBandMemberModalOpen}
				setOpen={setEditBandMemberModalOpen}
				bandId={bandId}
				username={username}
				bandMemberToEdit={bandMemberToEdit}
				setBandMemberToEdit={setBandMemberToEdit}
				setBandMembersList={setBandMembersList}
			/>
			<RemoveBandMemberModal
				isOpen={isRemoveBandMemberModalOpen}
				setOpen={setRemoveBandMemberModalOpen}
				bandId={bandId}
				username={username}
				bandMemberToEdit={bandMemberToEdit}
				setBandMembersList={setBandMembersList}
			/>
			<AddBandMemberModal
				isOpen={isAddBandMemberModalOpen}
				setOpen={setAddBandMemberModalOpen}
				bandId={bandId}
				setBandMembersList={setBandMembersList}
				setInvitationModalOpen={setInvitationModalOpen}
			/>
		</div>
	);
};

export default BandMembers;
