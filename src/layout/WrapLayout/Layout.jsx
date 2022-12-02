import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import LoadingContext from "../../../store/loading-context";
import AuthModalContext from "../../../store/authModal-context";
import Loading from "../Loading/Loading";
import ErrorBox from "../Modal/ErrorBox";
import SuccessBox from "../Modal/SuccessBox";
import Navbar from "./Navbar";
import AuthModal from "../Modal/AuthModal";

const Layout = ({ children }) => {
	const [, setLoading] = useContext(LoadingContext);
	const [authModalOpen, setAuthModalOpen] = useContext(AuthModalContext);
	const { isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis();

	useEffect(() => {
		if (!isWeb3Enabled && isAuthenticated) enableWeb3();
	}, [isWeb3Enabled, isAuthenticated, enableWeb3]);

	const router = useRouter();

	router.events.on("routeChangeStart", () => setLoading(true));
	router.events.on("routeChangeComplete", () => setLoading(false));
	router.events.on("routeChangeError", () => setLoading(false));

	return (
		<>
			{!router.pathname.startsWith("/auth") && <Navbar />}
			<AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
			{children}
			<Loading />
			<ErrorBox />
			<SuccessBox />
		</>
	);
};

export default Layout;
