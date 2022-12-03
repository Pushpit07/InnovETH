import CustomButton from "../../../layout/CustomButton";
import HelpDropdown from "./HelpDropdown";

export default function LockAccount() {
	return (
		<>
			<h3 className="mb-1 text-lg font-semibold mt-7 font-secondary">Help with a compromised account</h3>
			<p className="font-secondary text-[15px] max-w-[941px] mb-5">
				If you believe your account has been compromised, we can help you by immediately locking your account to prevent any unauthorized transactions
				using Musixverse. <a className="font-semibold font-secondary text-primary-500">Learn more</a>
			</p>
			<div
				className={
					"dark:border-dark-800 dark:bg-dark-800 dark:hover:border-primary-500 flex max-w-fit sm:w-auto ml-0 mt-3 sm:mt-0 items-center px-4 py-2 bg-white border-2 rounded-xl hover:border-primary-500"
				}
			>
				<p className={"dark:text-light-100 mt-[1px] text-sm font-medium text-gray-700"}>Your Issue: </p>
				<HelpDropdown />
			</div>
			<div className="flex items-baseline my-6">
				<input type={"checkbox"}></input>
				<p className="ml-2 font-secondary align-top text-[15px]">
					Confirm that you agree to all terms, conditions, and policies of Musixverse.{" "}
					<a href="#" className="font-medium text-primary-500">
						terms of services.
					</a>
				</p>
			</div>
			<CustomButton green={true}>Lock Account</CustomButton>
		</>
	);
}
