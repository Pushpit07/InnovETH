export default function Button(props) {
	return (
		<button
			type="submit"
			className="flex justify-center items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-[14px] text-light-100 py-3 px-8 rounded-lg mt-6 font-primary font-semibold max-w-[210px]"
		>
			{props.children}
		</button>
	);
}
