import Head from "next/head";
import { meta_description } from "../../constants";
import CompanyRegistration from "../../components/Registration/CompanyRegistration";
import { useEffect, useContext } from "react";
import { useMoralis } from "react-moralis";
import LoadingContext from "../../../store/loading-context";

const CompanyDetails = () => {
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
				<title>Innovise | Project Registration</title>
				<meta name="description" content={meta_description} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* Component */}
			<CompanyRegistration />
		</>
	);
};

export default CompanyDetails;
