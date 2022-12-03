import Modal from "../../../layout/Modal/Modal";

const ArtistBioModal = ({ isOpen, setOpen, name, bio }) => {
	return (
		<Modal
			isOpen={isOpen}
			classes="max-w-[48rem]"
			title={<div className="flex ml-8">About {name}</div>}
			titleClasses="justify-start text-start"
			content={<div className="text-start whitespace-pre-wrap">{bio}</div>}
			onClose={() => {
				setOpen(false);
			}}
		></Modal>
	);
};

export default ArtistBioModal;
