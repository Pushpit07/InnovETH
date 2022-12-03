export default function CustomButton({ green = false, greenOutline = false, light200 = false, error = false, onClick, children, classes }) {
	return (
		<button
			onClick={() => (onClick ? onClick() : {})}
			className={
				green
					? `flex items-center justify-between rounded-lg bg-primary-500 hover:bg-primary-600 font-primary font-semibold text-light-100 ${
							classes ? classes : "text-lg px-8 py-2"
					  }`
					: greenOutline
					? `flex items-center justify-between rounded-lg bg-light-100 hover:bg-light-200 dark:bg-dark-600 border-2 border-primary-500 font-primary font-semibold  ${
							classes ? classes : "text-lg px-8 py-2"
					  }`
					: error
					? `flex items-center justify-between rounded-lg bg-error-400 hover:bg-error-500 font-primary font-semibold text-light-100 ${
							classes ? classes : "text-lg px-8 py-2"
					  }`
					: light200
					? `flex items-center justify-between rounded-lg bg-light-300/60 hover:bg-light-300/80 font-primary font-semibold text-dark-600 ${
							classes ? classes : "text-lg px-8 py-2"
					  }`
					: `flex items-center justify-between rounded-lg bg-light-100 hover:bg-light-200 font-primary font-semibold text-dark-600 ${
							classes ? classes : "text-lg px-8 py-2"
					  }`
			}
		>
			{children}
		</button>
	);
}
