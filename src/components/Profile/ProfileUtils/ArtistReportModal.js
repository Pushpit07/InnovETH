import { useState, useContext } from "react";
import Modal from "../../../layout/Modal/Modal";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import ReportFilterDropdown from "../../../layout/ReportFilterDropdown";
import { reportProfileFilters } from "../../../constants";
import StatusContext from "../../../../store/status-context";

const ArtistReportModal = ({ isOpen, setOpen, username, isBand }) => {
	const { user } = useMoralis();
	const [reason, setReason] = useState(reportProfileFilters[0]);
	const [, , setSuccess, setError] = useContext(StatusContext);

	const { fetch: reportProfile } = useMoralisCloudFunction("reportProfile", { username: username, reason: reason }, { autoFetch: false });
	const { fetch: reportBand } = useMoralisCloudFunction("reportBand", { username: username, reason: reason }, { autoFetch: false });

	const reportUserProfile = () => {
		if (user && reason) {
			if (isBand) {
				reportBand({
					onSuccess: async (object) => {
						if (object) {
							setSuccess((prevState) => ({
								...prevState,
								title: "Profile Reported",
								message: "You report has been recorded. We will review this report soon and take appropriate action.",
								showSuccessBox: true,
							}));
						}
					},
					onError: (error) => {
						console.log("reportBand Error:", error);
					},
				});
			} else {
				reportProfile({
					onSuccess: async (object) => {
						if (object) {
							setSuccess((prevState) => ({
								...prevState,
								title: "Profile Reported",
								message: "You report has been recorded. We will review this report soon and take appropriate action.",
								showSuccessBox: true,
							}));
						}
					},
					onError: (error) => {
						console.log("reportProfile Error:", error);
					},
				});
			}
		} else {
			setError((prevState) => ({
				...prevState,
				title: "Report Failed",
				message: "There was a problem in submitting your report. Please try again",
				showErrorBox: true,
			}));
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			image={
				<div className="mx-auto flex items-center relative justify-center h-24 w-24 text-6xl">
					<label htmlFor="create-nft-form-submit" className="flex justify-center items-center w-14 h-14 border-2 rounded-full border-red-600">
						<i className="fa-solid fa-flag text-2xl text-red-600"></i>
					</label>
				</div>
			}
			title={<div className="text-lg">Are you sure you want to report this profile?</div>}
			content={
				<div className="flex-1 text-sm font-semibold md:text-base font-secondary">
					<p className="mb-1 font-primary text-sm text-left">Choose a category</p>
					<ReportFilterDropdown optionsArray={reportProfileFilters} initialValue={reportProfileFilters[0]} reason={reason} setReason={setReason} />
				</div>
			}
			onClose={() => {
				setOpen(false);
			}}
			buttons={[
				{
					role: "custom",
					onClick: () => {
						reportUserProfile();
						setOpen(false);
					},
					toClose: true,
					classes: "flex items-center px-4 py-3 mr-2 mb-2 text-sm font-primary font-bold rounded-md bg-red-600 hover:bg-red-700 text-light-100",
					label: (
						<>
							Report Profile
							<span className="ml-8 text-xl">
								<i className="fa-solid fa-arrow-right-long"></i>
							</span>
						</>
					),
				},
			]}
		></Modal>
	);
};

export default ArtistReportModal;
