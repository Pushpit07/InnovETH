import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { meta_description } from "../../constants";

function DoesNotExist() {
	const router = useRouter();
	const { username } = router.query;

	return (
		<>
			<Head>
				<title>Musixverse | Profile Does Not Exist</title>
				<meta name="description" content={meta_description} />
			</Head>

			<main className="m-auto max-w-screen-2xl md:w-11/12 px-4 md:px-20 py-24 text-center bg-light-200 dark:bg-dark-800">
				<h1 className="md:text-6xl text-5xl font-primary font-semibold mb-2 pt-20">Musixverse</h1>
				<p className="md:text-md text-sm">
					<i>Hear it. Own it. Live it.</i>
				</p>

				<div className="flex flex-row justify-start sm:mt-24 mt-16 mb-10">
					<div className="w-full grid grid-cols-5 gap-4">
						<div className="col-span-5 p-10 border-2 border-gray-400 rounded-md">
							<div className="mb-16 font-secondary text-lg">User Profile with the username &quot;{username}&quot; does not exist</div>

							<Link href="/" passHref={true}>
								<button className="px-5 py-3 mt-16 text-xs text-white bg-primary-600 hover:bg-primary-700 font-primary rounded-lg">
									Go Back to HomePage
								</button>
							</Link>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

export default DoesNotExist;
