import { useRef, useState, useEffect, useContext } from "react";
import { useMoralis } from "react-moralis";
import DefaultAvatar from "./DefaultAvatar";
import { uploadBase64ToIPFS } from "../../../utils/image-crop/uploadToIPFS";
import CropImageModal from "./CropImageModal";
import LoadingContext from "../../../../store/loading-context";
import Image from "next/image";

export default function SelectAvatar({ defaultAvatarUrls, avatar, setAvatar }) {
	const [showModal, setShowModal] = useState(false);
	const [imageToCrop, setImageToCrop] = useState(undefined);
	const [croppedImage, setCroppedImage] = useState(undefined);
	const { Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const uploadedImage = useRef(null);
	const uploadImage = useRef(null);
	const [selectedAvatar, setSelectedAvatar] = useState(avatar ? avatar : defaultAvatarUrls[0]);

	useEffect(() => {
		setSelectedAvatar(avatar ? avatar : defaultAvatarUrls[0]);
	}, [avatar, defaultAvatarUrls]);

	useEffect(() => {
		async function setProfileImage() {
			if (croppedImage !== undefined) {
				// uploadedImage.current.src = croppedImage;
				setSelectedAvatar(croppedImage);
				setLoading({
					status: true,
					title: "Uploading Avatar",
					message: "Please wait while we upload your file...",
					showProgressBar: false,
					progress: 0,
				});

				try {
					// Get the uploadBase64ToIPFS async function
					await uploadBase64ToIPFS(Moralis, croppedImage, "avatar", setLoading).then((url) => {
						setAvatar(url);
						setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
					});
				} catch (err) {
					setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
					if (err.message && err.message == "request entity too large") {
						setError({
							title: "File too large",
							message: "Please select a file with smaller size",
							showErrorBox: true,
						});
					} else {
						setError((prevState) => ({
							...prevState,
							title: "Oops! Something went wrong.",
							message: "Please try again later.",
							showErrorBox: true,
						}));
					}
					return;
				}
			}
		}
		setProfileImage();
	}, [croppedImage, setAvatar, setLoading, Moralis]);

	const circularCrop = true;
	const aspectRatio = { width: 1, height: 1 };

	// const cropModalValues = { showModal, setShowModal, imageToCrop, setCroppedImage, circularCrop, aspectRatio };

	const handleImageSelection = (selectedUrl) => {
		// const el = uploadedImage.current;
		// el.src = selectedUrl;
		// Reset the uploaded file
		uploadImage.current.value = "";
		setSelectedAvatar(selectedUrl);
		setAvatar(selectedUrl);
	};

	const handleImageUpload = (event) => {
		// If file size is > 10 MB show error box
		if (event.target.files[0] && event.target.files[0].size > 10000000) {
			setError({
				title: "File size too large",
				message: "Uploaded image should be less than 10 MB",
				showErrorBox: true,
			});
			uploadImage.current.value = "";
			return;
		}
		const imageURL = URL.createObjectURL(event.target.files[0]);
		uploadImage.current.value = "";
		setImageToCrop(imageURL);
		setShowModal(true);
	};

	return (
		<>
			<div className="flex">
				<div className={"w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full relative overflow-hidden"}>
					<Image src={selectedAvatar} key={selectedAvatar} objectFit="contain" layout="fill" alt="Selected Avatar" priority />
				</div>
				{/* <img className={"w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full"} ref={uploadedImage} src={defaultAvatarUrls[0]} alt="Selected Avatar"></img> */}

				{/* Avatars */}
				<div className="max-w-[200px] ml-5">
					<p className="text-secondary text-[14px] sm:text-[15px] mb-2 font-secondary">Upload or select an Avatar</p>
					<div className="grid grid-cols-4 gap-x-1 gap-y-2">
						<DefaultAvatar onImageSelection={handleImageSelection} urls={defaultAvatarUrls} avatar={avatar} />
						<label
							htmlFor="upload-avatar"
							className="flex items-center justify-center
                        text-dark-800 cursor-pointer w-[30px] h-[30px] sm:w-[39px] sm:h-[39px] rounded-full bg-light-300 hover:bg-[#bad9d5] text-[18px] sm:text-[20px]"
						>
							<i className="text-dark-800 fa fa-upload"></i>
						</label>
					</div>
					<input ref={uploadImage} className="hidden" onChange={handleImageUpload} type={"file"} id="upload-avatar" accept="image/*" />
				</div>
			</div>
			<CropImageModal {...{ showModal, setShowModal, imageToCrop, setCroppedImage, circularCrop, aspectRatio }} />
		</>
	);
}
