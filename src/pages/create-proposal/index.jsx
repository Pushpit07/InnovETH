import { useState, useContext } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
	ssr: false,
});
import { Web3Storage } from "web3.storage";
import LoadingContext from "../../../store/loading-context";
import { createProposal } from "../../utils/smart-contract/functions";
import uploadFileToIPFS from "../../utils/image-crop/uploadToIPFS";
import convertDataURLtoFile from "../../utils/image-crop/convertDataURLtoFile";
import { useMoralis } from "react-moralis";

export default function CreatePostPage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [summary, setSummary] = useState("");
	const [, setLoading] = useContext(LoadingContext);
	const { Moralis } = useMoralis();

	function onImageUpload(file) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (data) => {
				const mimeFile = convertDataURLtoFile(data.target.result, "imageFile");
				uploadFileToIPFS(Moralis, mimeFile).then((ipfsHash) => {
					resolve(ipfsHash);
				});
			};
			reader.readAsDataURL(file);
		});
	}

	function makeStorageClient() {
		return new Web3Storage({
			token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZDMjhjQ2IzYjZiYjI0NGIxNzFhODMyNWFFMjUyOUYyZjBDNEVhZjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwMzA1MzU4NzksIm5hbWUiOiJFVEhJbmRpYSJ9.3Cf-pfV18veuuT96bNb1Z6ipc57YKCr45nqDhv0EM2Y",
		});
	}

	function makeFileObjects() {
		const obj = {
			name: title,
			summary: summary,
			description: description,
			image: "https://gateway.musixverse.com/ipfs/bafkreicwvbpgtdiyoj2d2tcfyd7mgrwwn46rlfrtvl4qvumv5uk7od745m",
		};
		const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

		const files = [new File([blob], "proposal.json")];
		return files;
	}

	async function storeFile() {
		const client = makeStorageClient();
		const cid = await client.put(makeFileObjects());
		console.log("stored file with cid:", cid);
		console.log("stored file with link:", `https://${cid}.ipfs.w3s.link/proposal.json`);
		return cid;
	}

	return (
		<div className="flex items-center justify-center w-screen">
			<div className="flex flex-col w-full my-32 max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
				<h1 className="pl-8 mt-8 mb-16 text-5xl text-center font-semibold font-primary">Put down your thoughts</h1>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						const cid = await storeFile();
						await createProposal(cid);
						setLoading(false);
					}}
					className="flex flex-col w-full"
				>
					<div className="flex flex-col mb-4">
						<label className="text-lg font-medium">Proposal title</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="p-2 mt-1 border-2 rounded outline-none border-light-300 focus:border-dark-200 active:border-dark-200"
							required
						></input>
					</div>
					<div className="flex flex-col mb-4">
						<label className="text-lg font-medium">Proposal Summary (about 75 words)</label>
						<textarea
							value={summary}
							onChange={(e) => setSummary(e.target.value)}
							className="p-2 min-h-[150px] mt-1 border-2 rounded outline-none border-light-300 focus:border-dark-200 active:border-dark-200"
							required
						/>
						{/* <input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="p-2 mt-1 border-2 rounded outline-none border-light-300 focus:border-dark-200 active:border-dark-200"
							required
						></input> */}
					</div>
					<label className="mt-4 text-lg font-medium">Full Description (Supports Markdown)</label>
					<MdEditor
						className="mt-1"
						style={{ height: "500px" }}
						placeholder="Enter your description here"
						view={{ fullScreen: false }}
						imageAccept=".jpg,.png,.jpeg,.svg,.hevc"
						onImageUpload={onImageUpload}
						renderHTML={(text) => {
							setDescription(text);
							// Call set markdown in moralis here and send text
							return <ReactMarkdown>{text}</ReactMarkdown>;
						}}
					/>
					<div className="flex justify-end w-full mt-8">
						<button type="submit" className="px-8 py-2 text-white rounded bg-[#3D0B56]">
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
