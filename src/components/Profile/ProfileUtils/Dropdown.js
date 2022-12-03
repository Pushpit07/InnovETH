import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ setSortingFilter }) {
	const [currentFilter, setCurrentFilter] = useState("Newest First");
	const handleOptionSelect = (e) => {
		setCurrentFilter(e.target.textContent);
		setSortingFilter(e.target.textContent);
	};

	const optionsArray = ["Newest First", "Oldest First", "Price- High to Low", "Price- Low to High"];
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
					>
						{option}
					</li>
				)}
			</Menu.Item>
		);
	});

	return (
		<Menu as="div" className="relative inline-block text-left">
			{/* The visible dropdown button */}
			<div>
				<Menu.Button className="inline-flex justify-center ml-3 text-sm font-medium text-gray-700 bg-transparent focus:outline-none dark:text-light-100">
					{currentFilter}
					<ChevronDownIcon className="ml-2 h-5 w-5 text-[#6cc027]" aria-hidden="true" />
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
				<Menu.Items className="absolute right-0 w-56 mt-3 origin-top-right rounded-md shadow-lg bg-light-300 dark:bg-dark-600 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
					<div className="py-1">{dropdownOptions}</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
