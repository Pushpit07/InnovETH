import Head from "next/head";
import { meta_description } from "../../constants";

const InnovationHub = ({}) => {
	return (
		<>
			<Head>
				<title>Innovise | Innovation Hub</title>
				<meta name="description" content={meta_description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="h-screen w-screen relative flex flex-col items-center bg-light-200">
				<h1 className="mt-40 mb-4 text-5xl font-semibold text-center font-primary">Innovation Hub</h1>
			</div>
		</>
	);
};

export default InnovationHub;
