import { useState, useEffect } from "react";
import { MoralisProvider } from "react-moralis";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { connectSmartContract } from "../utils/smart-contract/functions";
import StatusContext from "../../store/status-context";
import LoadingContext from "../../store/loading-context";
import AuthModalContext from "../../store/authModal-context";
import ProtectedRoutes from "../auth/ProtectedRoutes";
import "../../styles/globals.css";
import Layout from "../layout/WrapLayout/Layout";
import ScrollToPageTop from "../utils/ScrollToPageTop";
import { PARSE_APP_ID, PARSE_SERVER_URL } from "../constants";
import { HuddleClientProvider, getHuddleClient } from "@huddle01/huddle01-client";

function App({ Component, pageProps, router }) {
	const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState({
		title: "",
		message: "",
		showErrorBox: false,
	});
	const [success, setSuccess] = useState({
		title: "",
		message: "",
		showSuccessBox: false,
	});
	const [authModalOpen, setAuthModalOpen] = useState(false);

	// This is a workaround for the issue with the next-themes package. Without this, the theme was not being applied correctly.
	const [mounted, setMounted] = useState(false);
	// When mounted on client, now we can show the UI
	useEffect(() => {
		setMounted(true);
		// connectSmartContract();
	}, []);
	if (!mounted) return null;

	return (
		<>
			<Script src="https://kit.fontawesome.com/8f4546bba1.js" crossOrigin="anonymous"></Script>
			<Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></Script>

			<HuddleClientProvider value={huddleClient}>
				<MoralisProvider appId={PARSE_APP_ID} serverUrl={PARSE_SERVER_URL}>
					<ThemeProvider attribute="class" enableSystem={false} forcedTheme="light" defaultTheme="light">
						<LoadingContext.Provider value={[isLoading, setLoading]}>
							<AuthModalContext.Provider value={[authModalOpen, setAuthModalOpen]}>
								<StatusContext.Provider value={[error, success, setSuccess, setError]}>
									<ProtectedRoutes router={router}>
										<Layout>
											<ScrollToPageTop />
											<Component {...pageProps} />
										</Layout>
									</ProtectedRoutes>
								</StatusContext.Provider>
							</AuthModalContext.Provider>
						</LoadingContext.Provider>
					</ThemeProvider>
				</MoralisProvider>
			</HuddleClientProvider>
		</>
	);
}

export default App;
