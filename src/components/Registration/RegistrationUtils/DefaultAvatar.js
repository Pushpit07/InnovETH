import Image from "next/image";
import { useState } from "react";

export default function DefaultAvatar(props) {
	const [currImage, setCurrImage] = useState(1);

	//Map out all the imgs from url
	const defaultAvatars = props.urls.map((url, idx) => {
		return (
			<div
				className={
					"w-[30px] h-[30px] relative overflow-hidden sm:w-[39px] sm:h-[39px] rounded-full cursor-pointer bg-light-300 " +
					(currImage === idx + 1 && props.urls.includes(props.avatar) ? "ring-2 ring-offset-2 ring-primary-500" : "")
				}
				key={idx}
				onClick={() => {
					setCurrImage(idx + 1);
					props.onImageSelection(props.urls[idx]);
				}}
			>
				<Image src={url} objectFit="contain" layout="fill" alt="default avatar" />
			</div>
		);
	});
	return <>{defaultAvatars}</>;
}
