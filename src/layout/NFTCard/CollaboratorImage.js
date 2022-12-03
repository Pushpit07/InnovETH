import Image from "next/image";

const CollaboratorImage = ({ collaborator }) => {
	return (
		<div className={`rounded-full flex items-end relative`}>
			{collaborator ? <Image priority src={collaborator.avatar} height="30" width="30" alt="collaborator's avatar" className="rounded-full" /> : null}
		</div>
	);
};

export default CollaboratorImage;
