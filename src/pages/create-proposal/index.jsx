import { useState } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
	ssr: false,
});
import { Web3Storage } from "web3.storage";

export default function CreatePostPage() {
	const [title, setTitle] = useState("Test title");
	const [description, setDescription] = useState(
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	);

	function onImageUpload(file) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (data) => {
				resolve(data.target.result);
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
			title: title,
			description: description,
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
			<div className="flex flex-col w-full mt-32 max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						storeFile();
					}}
					className="flex flex-col w-full"
				>
					<div className="flex flex-col mb-4">
						<label className="text-lg font-medium">Proposal title</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="mt-1 p-2 rounded outline-none border-2 border-light-300 focus:border-dark-200 active:border-dark-200"
							required
						></input>
					</div>
					<label className="mt-4 text-lg font-medium">Description</label>
					<MdEditor
						className="mt-1"
						style={{ height: "500px" }}
						placeholder="Enter your markdown here"
						view={{ fullScreen: false }}
						imageAccept=".jpg,.png,.jpeg,.svg,.hevc"
						onImageUpload={onImageUpload}
						renderHTML={(text) => {
							// Call set markdown in moralis here and send text
							return <ReactMarkdown>{text}</ReactMarkdown>;
						}}
					/>
					<div className="flex justify-end w-full mt-8">
						<button type="submit" className="px-8 py-2 bg-primary-200 text-white rounded">
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
