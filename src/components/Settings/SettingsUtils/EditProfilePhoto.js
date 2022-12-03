import { useState, useRef, useContext, useEffect } from "react";
import { useMoralis } from "react-moralis";
import CustomButton from "../../../layout/CustomButton";
import { uploadBase64ToIPFS } from "../../../utils/image-crop/uploadToIPFS";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import CropImageModal from "../../Registration/RegistrationUtils/CropImageModal";
import Image from "next/image";
import Tooltip from "../../../layout/Tooltip/Tooltip";

export default function EditProfilePhoto({ avatar, setAvatar }) {
	const profilePictureInput = useRef(null);
	const { Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, , , setError] = useContext(StatusContext);
	// Crop Modal states
	const [showModal, setShowModal] = useState(false);
	const [imageToCrop, setImageToCrop] = useState(undefined);
	const [croppedImage, setCroppedImage] = useState(undefined);
	const aspectRatio = { width: 1, height: 1 };
	const circularCrop = false;
	const cropModalValues = { showModal, setShowModal, imageToCrop, setCroppedImage, circularCrop, aspectRatio };

	useEffect(() => {
		if (croppedImage !== undefined) {
			setLoading({ status: true, title: "Uploading Avatar", message: "Please wait while we upload your file...", showProgressBar: false, progress: 0 });
			try {
				uploadBase64ToIPFS(Moralis, croppedImage, "avatar", setLoading).then((url) => {
					setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
					setAvatar(url);
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
	}, [Moralis, croppedImage, setAvatar, setError, setLoading]);

	const handleAvatarChange = (event) => {
		// If file size is > 10 MB show error box
		if (event.target.files[0] && event.target.files[0].size > 10000000) {
			setError({
				title: "File size too large",
				message: "Uploaded image should be less than 10 MB",
				showErrorBox: true,
			});
			profilePictureInput.current.value = "";
			return;
		}
		const imageURL = URL.createObjectURL(event.target.files[0]);
		profilePictureInput.current.value = "";
		setImageToCrop(imageURL);
		setShowModal(true);
	};

	return (
		<>
			<div className="flex flex-col">
				<p className="mb-5 text-sm font-medium md:text-base font-secondary">
					Profile Picture
					<Tooltip
						labelText={<i className="ml-2 text-base md:text-lg fa fa-info-circle"></i>}
						message={"Recommended dimensions: 		640 x 640 px"}
						tooltipLocation={"bottom"}
					/>
				</p>
				<label className="relative cursor-pointer w-fit" htmlFor="upload-image-inp">
					<div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full relative overflow-hidden">
						<Image
							src={
								croppedImage
									? croppedImage
									: avatar
									? avatar
									: "https://ipfs.moralis.io:2053/ipfs/Qmcn1aZ4PKUUzwpTncuSbruwLD98dtiNqvoJG5zm8EMwXZ"
							}
							objectFit="contain"
							layout="fill"
							alt="Current Avatar"
							priority
						/>
					</div>

					<input
						ref={profilePictureInput}
						type="file"
						id="upload-image-inp"
						onChange={handleAvatarChange}
						accept="image/*"
						className="hidden mt-2 mb-2"
					/>
					<label
						className="absolute flex items-center justify-center p-2 pr-1 rounded-lg cursor-pointer right-1 bottom-2 bg-dark-800"
						htmlFor="upload-image-inp"
					>
						<i className="far fa-edit text-light-200"></i>
					</label>
				</label>

				<div className="flex h-full">
					<div className="self-end mb-1">
						<CustomButton green={true} classes="text-sm px-8 py-3">
							Save Changes
						</CustomButton>
					</div>
				</div>
			</div>
			<CropImageModal {...cropModalValues} />
		</>
	);
}
