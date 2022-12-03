import Head from "next/head";
import { meta_description } from "../../constants";
import InnovatorRegistration from "../../components/Registration/InnovatorRegistration";
import { useEffect, useContext } from "react";
import { useMoralis } from "react-moralis";
import LoadingContext from "../../../store/loading-context";

const Innovator_Page = () => {
	const { user, isInitialized } = useMoralis();
	// Context Management
	const [, setLoading] = useContext(LoadingContext);

	useEffect(() => {
		setLoading(true);
		if (isInitialized && user) {
			setLoading(false);
		}
		return () => {
			setLoading(false);
		};
	}, [isInitialized, user, setLoading]);

	return (
		<>
			<Head>
				<title>InnovETH | Innovator Registration</title>
				<meta name="description" content={meta_description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<InnovatorRegistration />
		</>
	);
};

export default Innovator_Page;
