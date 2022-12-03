import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import { uploadBase64ToIPFS } from "../../../utils/image-crop/uploadToIPFS";
import LoadingContext from "../../../../store/loading-context";
import StatusContext from "../../../../store/status-context";
import CropImageModal from "../../Registration/RegistrationUtils/CropImageModal";
import Tooltip from "../../../layout/Tooltip/Tooltip";

export default function CoverPhoto({ coverImage, setCoverImage }) {
	const coverPictureInput = useRef(null);
	const { Moralis } = useMoralis();
	const [, setLoading] = useContext(LoadingContext);
	const [, , , setError] = useContext(StatusContext);
	// Crop Modal states
	const [showModal, setShowModal] = useState(false);
	const [imageToCrop, setImageToCrop] = useState(undefined);
	const [croppedImage, setCroppedImage] = useState(undefined);

	const aspectRatio = { width: 1918, height: 350 };
	const circularCrop = false;
	const cropModalValues = { showModal, setShowModal, imageToCrop, setCroppedImage, circularCrop, aspectRatio };

	useEffect(() => {
		if (croppedImage !== undefined) {
			setLoading({
				status: true,
				title: "Uploading Cover Photo",
				message: "Please wait while we upload your file...",
				showProgressBar: false,
				progress: 0,
			});

			try {
				uploadBase64ToIPFS(Moralis, croppedImage, "cover-image", setLoading).then((url) => {
					setLoading({ status: false, title: "", message: "", showProgressBar: false, progress: 0 });
					setCoverImage(url);
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
	}, [Moralis, croppedImage, setCoverImage, setError, setLoading]);

	const handleCoverChange = (event) => {
		// If file size is > 10 MB show error box
		if (event.target.files[0] && event.target.files[0].size > 10000000) {
			setError({
				title: "File size too large",
				message: "Uploaded image should be less than 10 MB",
				showErrorBox: true,
			});
			coverPictureInput.current.value = "";
			return;
		}
		const imageURL = URL.createObjectURL(event.target.files[0]);
		coverPictureInput.current.value = "";
		setImageToCrop(imageURL);
		setShowModal(true);
	};

	return (
		<>
			<div className="flex flex-col flex-1">
				<p className="mb-2 text-sm font-medium md:text-base md:mb-5 font-secondary">
					Cover Photo
					<Tooltip
						labelText={<i className="ml-2 text-base md:text-lg fa fa-info-circle"></i>}
						message={"Recommended dimensions:		 1500 x 500 px"}
						tooltipLocation={"bottom"}
					/>
				</p>
				<label className="relative w-full h-fit" htmlFor="upload-cover-image">
					<div className={"w-full h-full hover:cursor-pointer"}>
						<div className="w-full rounded-lg relative overflow-hidden aspect-[5.48]">
							<Image
								src={
									croppedImage
										? croppedImage
										: coverImage
										? coverImage
										: "https://ipfs.moralis.io:2053/ipfs/Qmcn1aZ4PKUUzwpTncuSbruwLD98dtiNqvoJG5zm8EMwXZ"
								}
								objectFit="contain"
								layout="fill"
								alt="cover photo"
								priority
							/>
						</div>
					</div>
					<input ref={coverPictureInput} type="file" id="upload-cover-image" onChange={handleCoverChange} accept="image/*" className="hidden" />
					<label
						className="absolute flex items-center justify-center p-2 pr-1 rounded-lg cursor-pointer -right-3 -bottom-2 bg-dark-800"
						htmlFor="upload-cover-image"
					>
						<i className="far fa-edit text-light-200"></i>
					</label>
				</label>
			</div>
			<CropImageModal {...cropModalValues} />
		</>
	);
}
