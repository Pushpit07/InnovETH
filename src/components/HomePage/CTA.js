import Link from "next/link";

export default function CTA() {
	return (
		<div className="flex flex-col items-center justify-center w-full px-10 pt-20 sm:px-16 xl:px-20 2xl:px-36">
			<div className="overflow-x-hidden flex flex-col lg:flex-row justify-between bg-[#eeeeee] w-full rounded-2xl md:pt-10 pt-16 p-10 md:px-14 relative">
				<div className="self-start lg:self-center">
					<h1 className="text-3xl font-semibold font-primary">Get Started</h1>
					<p className="mt-2 text-sm font-secondary">For more details, feel free to contact</p>
					<a href="mailto:contact@musixverse.com" target="_blank" rel="noopener noreferrer" className="block text-sm font-primary text-primary-200">
						pushpit@musixverse.com
					</a>

					<Link href="/artist-verification" passHref>
						<button className="px-8 py-3 mt-8 text-xs text-white bg-primary-200 hover:bg-primary-300 font-primary rounded-xl">
							View artist verification requests
						</button>
					</Link>
				</div>

				<div className="self-end -mb-10 -mr-56 lg:-mr-14">
					<img
						src="/cta.png"
						className="h-[500px] min-w-[680px] md:min-w-0 lg:h-[370px] xl:h-[470px] md:aspect-auto"
						alt="Boy with mic and music icons"
					/>
				</div>
			</div>
		</div>
	);
}
