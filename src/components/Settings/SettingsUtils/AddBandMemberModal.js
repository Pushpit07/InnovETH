import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useMoralisCloudFunction } from "react-moralis";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import Modal from "../../../layout/Modal/Modal";

const AddBandMemberModal = ({ isOpen, setOpen, bandId, setBandMembersList, setInvitationModalOpen }) => {
	const [, setLoading] = useContext(LoadingContext);
	const [, , setSuccess, setError] = useContext(StatusContext);

	const [bandMemberToAdd, setBandMemberToAdd] = useState([
		{ userId: "", name: "", username: "", role: "", address: "", avatar: "", hasAcceptedBandInvite: false },
	]);

	const { fetch: addBandMember } = useMoralisCloudFunction("addBandMember", { bandId: bandId, bandMember: bandMemberToAdd[0] }, { autoFetch: false });

	const addSelectedBandMember = async () => {
		setLoading({
			status: true,
			title: "Adding Member to Band...",
		});

		await addBandMember({
			onSuccess: async (object) => {
				setSuccess((prevState) => ({
					...prevState,
					title: "Band Member Added",
					message: "Selected Band Member was added successfully!",
					showSuccessBox: true,
				}));

				const _bandMemberToAdd = bandMemberToAdd[0];
				_bandMemberToAdd._id = _bandMemberToAdd.userId;
				_bandMemberToAdd.isArtistVerified = true;
				delete _bandMemberToAdd.userId;

				setBandMembersList((prevState) => [...prevState, _bandMemberToAdd]);
				handleRemoveMemberClick();
			},
			onError: (error) => {
				setError((prevState) => ({
					...prevState,
					title: "Member addition failed",
					message: "There was a problem in adding the band member. Please try again",
					showErrorBox: true,
				}));
				console.log("addBandMember Error:", error);
			},
		});

		setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
		setOpen(false);
	};

	// Search band member states
	const [filteredUsers, setFilteredUsers] = useState("");
	const [usernameEntered, setUsernameEntered] = useState("");
	const [searchedUsername, setSearchedUsername] = useState("");

	// handle input change
	const handleInputChange = (e, index) => {
		const { name, value } = e.target;
		const list = [...bandMemberToAdd];
		list[index][name] = value;
		setBandMemberToAdd(list);
	};

	// handle click event of the Remove button
	const handleRemoveMemberClick = () => {
		setBandMemberToAdd([{ userId: "", name: "", username: "", role: "", address: "", avatar: "", hasAcceptedBandInvite: false }]);
	};

	const setBandMemberInfo = async (user, index) => {
		const list = [...bandMemberToAdd];
		list[index]["userId"] = user.objectId;
		list[index]["name"] = user.name;
		list[index]["username"] = user.username;
		list[index]["address"] = user.ethAddress;
		list[index]["avatar"] = user.userInfo[0].avatar;
		setBandMemberToAdd(list);
		setFilteredUsers("");
		setUsernameEntered("");
		setSearchedUsername("");
	};

	const filterUsers = async (e) => {
		const keyword = e.target.value;
		if (keyword === "") {
			// If the text field is empty, show no users
			setFilteredUsers("");
		}
		setSearchedUsername(keyword);
	};

	const { fetch: fetchMatchingVerifiedArtists } = useMoralisCloudFunction(
		"fetchMatchingVerifiedArtists",
		{ username: searchedUsername },
		{
			autoFetch: false,
		}
	);
	useEffect(() => {
		if (searchedUsername !== "") {
			fetchMatchingVerifiedArtists({
				onSuccess: async (object) => {
					setFilteredUsers(
						await object.filter(function (userObj) {
							return !bandMemberToAdd.some(function (collaboratorObj) {
								return userObj.username === collaboratorObj.username; // return the ones with equal id
							});
						})
					);
				},
				onError: (error) => {
					console.log("fetchMatchingVerifiedArtists Error:", error);
				},
			});
		}
	}, [searchedUsername]);

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-4xl">
					<i className="fa-solid fa-user-plus"></i>
				</div>
			}
			title={"Add Band Member"}
			content={
				<div>
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							await addSelectedBandMember();
						}}
					>
						<div className="flex justify-start">
							<div className="flex flex-col gap-4 text-gray-700 mt-4">
								{bandMemberToAdd.map((member, index) => {
									return (
										<div key={index} className="grid grid-cols-12 gap-2">
											<div className="relative col-span-6">
												{member.username ? (
													<>
														{member.avatar && (
															<div className="absolute flex items-center h-full ml-2">
																<Image
																	src={member.avatar}
																	height="30"
																	width="30"
																	alt="member's avatar"
																	className="rounded-full"
																/>
															</div>
														)}
														<input
															className="bg-gray-100 dark:bg-[#272626] dark:text-light-100 dark:border-[#323232] w-full px-12 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-[#777777]"
															id="username"
															name="username"
															type="text"
															placeholder="Username"
															value={member.name}
															readOnly
															required
														/>
													</>
												) : (
													<input
														className="dark:text-light-100 dark:bg-[#323232] dark:border-[#323232] dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-[#777777] focus:border-primary-500"
														id="username"
														name="username"
														type="text"
														placeholder="Username"
														value={usernameEntered}
														autoComplete="off"
														onChange={(e) => {
															setUsernameEntered(e.target.value);
															filterUsers(e);
														}}
														required
													/>
												)}

												{!member.username && filteredUsers ? (
													<div className="absolute w-[300px]">
														{filteredUsers.length > 0 ? (
															filteredUsers.map((user, idx) => (
																<a key={user.objectId} className="flex flex-col basis-full">
																	{filteredUsers.length === 1 ? (
																		<button
																			type="button"
																			className="flex items-center justify-start px-3 py-2 rounded bg-zinc-100 dark:bg-dark-600 hover:text-light-100 dark:text-light-100 hover:bg-primary-500 dark:hover:bg-primary-500 text-start"
																			onClick={() => {
																				setBandMemberInfo(user, index);
																			}}
																		>
																			{user.userInfo[0] ? (
																				<Image
																					src={user.userInfo[0].avatar}
																					height="30"
																					width="30"
																					className="rounded-full"
																					alt="user's avatar"
																				/>
																			) : (
																				""
																			)}
																			<span className="ml-2">{user.name}</span>
																			<div>
																				<span className="ml-2 text-xs font-normal">@{user.username}</span>
																			</div>
																		</button>
																	) : idx === 0 ? (
																		<button
																			type="button"
																			className="flex items-center justify-start px-3 py-2 rounded-t bg-zinc-100 dark:bg-dark-600 hover:text-light-100 dark:text-light-100 hover:bg-primary-500 dark:hover:bg-primary-500 text-start"
																			onClick={() => {
																				setBandMemberInfo(user, index);
																			}}
																		>
																			{user.userInfo[0] ? (
																				<Image
																					src={user.userInfo[0].avatar}
																					height="30"
																					width="30"
																					className="rounded-full"
																					alt="user's avatar"
																				/>
																			) : (
																				""
																			)}
																			<span className="ml-2">{user.name}</span>
																			<div>
																				<span className="ml-2 text-xs font-normal">@{user.username}</span>
																			</div>
																		</button>
																	) : filteredUsers.length === idx + 1 ? (
																		<button
																			type="button"
																			className="flex items-center justify-start px-3 py-2 rounded-b bg-zinc-100 dark:bg-dark-600 hover:text-light-100 dark:text-light-100 hover:bg-primary-500 dark:hover:bg-primary-500 text-start"
																			onClick={() => {
																				setBandMemberInfo(user, index);
																			}}
																		>
																			{user.userInfo[0] ? (
																				<Image
																					src={user.userInfo[0].avatar}
																					height="30"
																					width="30"
																					className="rounded-full"
																					alt="user's avatar"
																				/>
																			) : (
																				""
																			)}
																			<span className="ml-2">{user.name}</span>
																			<div>
																				<span className="ml-2 text-xs font-normal">@{user.username}</span>
																			</div>
																		</button>
																	) : (
																		<button
																			type="button"
																			className="flex items-center justify-start px-3 py-2 bg-zinc-100 dark:bg-dark-600 hover:text-light-100 dark:text-light-100 hover:bg-primary-500 dark:hover:bg-primary-500 text-start"
																			onClick={() => {
																				setBandMemberInfo(user, index);
																			}}
																		>
																			{user.userInfo[0] ? (
																				<Image
																					src={user.userInfo[0].avatar}
																					height="30"
																					width="30"
																					className="rounded-full"
																					alt="user's avatar"
																				/>
																			) : (
																				""
																			)}
																			<span className="ml-2">{user.name}</span>
																			<div>
																				<span className="ml-2 text-xs font-normal">@{user.username}</span>
																			</div>
																		</button>
																	)}
																</a>
															))
														) : (
															<a key={"no"} className="flex flex-col basis-full">
																<button
																	type="button"
																	onClick={() => {
																		setOpen(false);
																		setInvitationModalOpen(true);
																		setUsernameEntered("");
																		setSearchedUsername("");
																	}}
																	className="justify-start px-6 py-3 rounded bg-zinc-100 hover:bg-gray-200 dark:bg-dark-600 dark:text-light-100 text-start"
																>
																	<span className="text-xs">
																		No results found.&nbsp;&nbsp;
																		<a className="cursor-pointer text-primary-600 hover:underline">
																			Send an Invite <i className="fa-solid fa-arrow-right"></i>
																		</a>
																	</span>
																</button>
															</a>
														)}
													</div>
												) : null}
											</div>

											<div className="col-span-5">
												<input
													className="dark:bg-[#323232] dark:border-[#323232] dark:text-light-100 dark:focus:border-primary-500 w-full px-4 py-2 text-sm border-2 rounded-lg shadow-sm outline-none border-[#777777] focus:border-primary-500"
													name="role"
													type="text"
													placeholder="Role. Eg. Drummer"
													value={member.role}
													onChange={(e) => handleInputChange(e, index)}
													required
												/>
											</div>

											{member.username && (
												<div className="flex justify-center items-center">
													<div
														onClick={() => handleRemoveMemberClick()}
														className="w-8 h-8 flex justify-center items-center rounded-lg transition-all duration-200 cursor-pointer dark:text-light-100 hover:bg-zinc-500/20 "
													>
														<i className="fa-solid fa-xmark"></i>
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>

						<p className="flex text-start text-xs text-[#777777] mt-10">
							We will send band invite email to the selected member once you click the &ldquo;Add Member&rdquo; button.
						</p>
						<p className="flex text-start text-xs text-[#777777] mt-2">
							You will not be able to create NFTs until all band members have verified their band invite email.
						</p>

						<div className="flex justify-end">
							<button
								type="submit"
								className="flex items-center mt-6 -mb-6 px-6 py-2 text-sm font-primary font-bold rounded-md bg-primary-500 hover:bg-primary-600 text-light-100"
							>
								Add Member
								<span className="ml-6 text-lg">
									<i className="fa-solid fa-arrow-right-long"></i>
								</span>
							</button>
						</div>
					</form>
				</div>
			}
			onClose={() => {
				setOpen(false);
			}}
		></Modal>
	);
};

export default AddBandMemberModal;
