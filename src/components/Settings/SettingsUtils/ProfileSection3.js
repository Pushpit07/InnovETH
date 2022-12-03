import { useContext } from "react";
import StatusContext from "../../../../store/status-context";

export default function ProfileSection3({ balance, walletAddress }) {
	const [, , setSuccess] = useContext(StatusContext);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(walletAddress);
		setSuccess({
			title: "Copied to Clipboard",
			message: "Wallet address copied successfully",
			showSuccessBox: true,
		});
	};

	return (
		<div className="flex flex-col flex-1 p-8 mt-10 md:flex-row xl:p-10 bg-light-300 dark:bg-dark-600 rounded-xl">
			<h1 className="mb-4 self-end text-3xl md:mb-0 md:mr-8 xl:text-4xl font-tertiary">WALLET ADDRESS</h1>
			<div className="flex items-center justify-between flex-1 px-4 py-2 rounded-lg bg-light-100 dark:bg-[#323232]">
				<span className="max-w-[180px] md:max-w-[280px] truncate md:text-base align-bottom text-sm font-secondary xl:max-w-none">{walletAddress}</span>
				<button type="button" className="w-fit h-fit" onClick={copyToClipboard}>
					<i className="far fa-clipboard text-primary-500"></i>
				</button>
			</div>
			<div className="ml-6 self-end text-xl xl:text-2xl font-tertiary">
				Balance:{" "}
				<span className="ml-1 text-md font-primary">
					{balance}
					<span className="ml-1 text-sm font-secondary">MATIC</span>
				</span>
			</div>
		</div>
	);
}
