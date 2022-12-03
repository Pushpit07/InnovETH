import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import styles from "../../styles/Profile/InputDropdown.module.css";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function ReportFilterDropdown({ optionsArray, initialValue, reason, setReason }) {
	const [currentFilter, setCurrentFilter] = useState(initialValue);
	const [textfield, setTextField] = useState(false);

	const handleOptionSelect = (e) => {
		let selectedValue = e.target.textContent;
		if (selectedValue === "Other") {
			selectedValue = "Other";
			setReason("");
			setTextField(true);
			setCurrentFilter(selectedValue);
		} else {
			setTextField(false);
			setCurrentFilter(selectedValue);
			setReason(selectedValue);
		}
	};

	// Map all the options into a items renderable array
	const dropdownOptions = optionsArray.map((option, idx) => {
		return (
			<Menu.Item key={idx}>
				{({ active }) => (
					<li
						className={classNames(
							active ? "bg-gray-100 dark:bg-dark-800 text-gray-900" : "text-gray-700",
							"block px-4 py-2 text-sm cursor-pointer dark:text-light-100"
						)}
						onClick={handleOptionSelect}
						value={idx}
					>
						{option}
					</li>
				)}
			</Menu.Item>
		);
	});

	return (
		<Menu as="div" className="relative inline-block w-full text-left">
			{/* The visible dropdown button */}
			<div>
				<Menu.Button
					className={
						"dark:bg-[#323232] bg-[#D9D9D9] hover:dark:border-[red] dark:text-light-100 dark:border-[#323232] inline-flex justify-between text-sm font-medium text-[#383838]  border-2 border-transparent w-full px-4 py-2 rounded-md hover:border-[red]"
					}
				>
					{currentFilter.length > 40 ? currentFilter.substring(0, 40) + "..." : currentFilter}
					<ChevronDownIcon className="ml-2 h-5 w-5 text-[red]" aria-hidden="true" />
				</Menu.Button>
			</div>
			{/* Dropdown menu */}
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 w-full mt-3 origin-top-right rounded-md shadow-lg bg-light-300 dark:bg-dark-600 ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className={styles["menu-item-div"]}>{[...dropdownOptions]}</div>
				</Menu.Items>
			</Transition>

			{textfield && (
				<div className="flex flex-col mt-4">
					<label className="font-primary text-sm" htmlFor="report-profile">
						Please specify below:
					</label>
					<textarea
						className="resize-none dark:bg-[#1a1a1a] mt-1 w-full p-2 border-[2px] border-red-500 rounded-md focus:outline-none focus:shadow-none text-sm font-normal"
						name="report-profile"
						id="report-profile"
						rows="4"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
					></textarea>
				</div>
			)}
		</Menu>
	);
}
