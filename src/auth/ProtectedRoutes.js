import { useEffect, useContext } from "react";
import { appRoutes } from "./constants";
import { useMoralis } from "react-moralis";
import LoadingContext from "../../store/loading-context";

// Check if user is on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

const ProtectedRoutes = ({ router, children }) => {
	const [, setLoading] = useContext(LoadingContext);

	// Identify authenticated user
	const { isAuthenticated, user, isInitialized, isWeb3Enabled, enableWeb3, refetchUserData } = useMoralis();

	// @dev These routes are protected for unauthenticated users
	const protectedRoutes = [appRoutes.REGISTER, appRoutes.SETTINGS, appRoutes.CREATE_POST];
	/**
	 * @const pathIsProtected Checks if path exists in the protectedRoutes array
	 */
	const pathIsProtected = protectedRoutes.some((route) => router.pathname.includes(route));

	// @dev These routes are protected until a user confirms their email
	const protectedRoutesForAuthenticatedUserEmailUnverified = [appRoutes.REGISTER, appRoutes.CREATE_POST];
	/**
	 * @const pathIsProtectedForAuthenticatedUserEmailUnverified Checks if path exists in the protectedRoutesForAuthenticatedUserEmailUnverified array
	 */
	const pathIsProtectedForAuthenticatedUserEmailUnverified = protectedRoutesForAuthenticatedUserEmailUnverified.some((route) =>
		router.pathname.includes(route)
	);

	// @dev These routes are protected for a logged in user
	const protectedRoutesForAuthenticatedUser = [appRoutes.REGISTER];
	/**
	 * @const pathIsProtectedForAuthenticatedUser Checks if path exists in the protectedRoutesForAuthenticatedUser array
	 */
	const pathIsProtectedForAuthenticatedUser = protectedRoutesForAuthenticatedUser.some((route) => router.pathname.includes(route));

	async function refetchData() {
		await refetchUserData();
	}

	// useEffect(() => {
	// 	function checkPath() {
	// 		if (isInitialized) {
	// 			if (!isAuthenticated) {
	// 				if (isBrowser() && pathIsProtected) {
	// 					router.push(appRoutes.HOMEPAGE);
	// 				}
	// 			} else {
	// 				// Authenticated
	// 				refetchData();
	// 				if (isBrowser() && !user.attributes.email) {
	// 					if (!router.pathname.startsWith(appRoutes.REGISTER)) router.push(appRoutes.REGISTER);
	// 				} else if (isBrowser() && pathIsProtectedForAuthenticatedUserEmailUnverified && !user.attributes.emailVerified) {
	// 					router.push(appRoutes.CONFIRM_EMAIL);
	// 				} else if (isBrowser() && pathIsProtectedForAuthenticatedUser) {
	// 					router.push(appRoutes.HOMEPAGE);
	// 				}
	// 			}

	// 			setLoading(false);
	// 		}
	// 	}
	// 	checkPath();
	// }, [router.pathname, isInitialized, isAuthenticated]);

	// useEffect(() => {
	// 	if (!isWeb3Enabled && isAuthenticated) enableWeb3();
	// }, [isWeb3Enabled, isAuthenticated, enableWeb3]);

	return children;
};

export default ProtectedRoutes;
