import Head from "next/head";
import { title_main_page, meta_description } from "../constants";
import CTA from "../components/HomePage/CTA";

function Home() {
	return (
		<>
			<Head>
				<title>{title_main_page}</title>
				<meta name="description" content={meta_description} />
			</Head>

			<div className="h-screen w-screen relative flex flex-col items-center bg-light-200">
				<h1 className="mt-40 mb-4 text-5xl font-semibold text-center font-primary">Innowise</h1>
				<p>Innovate & Improvise</p>
				<CTA />
			</div>
		</>
	);
}

export default Home;
