import Modal from "../../layout/Modal/Modal";
import { useEffect, useRef } from "react";
import { getHuddleClient, useRootStore } from "@huddle01/huddle01-client";
import PeerVideoAudioElem from "../../components/PeerVideoAudioElem";

const HuddleModal = ({ isOpen, setOpen, name, bio }) => {
	const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);
	const stream = useRootStore((state) => state.stream);

	const enableStream = useRootStore((state) => state.enableStream);
	const pauseTracks = useRootStore((state) => state.pauseTracks);
	const isCamPaused = useRootStore((state) => state.isCamPaused);

	const peers = useRootStore((state) => state.peers);

	const peerId = useRootStore((state) => state.peerId);
	const lobbyPeers = useRootStore((state) => state.lobbyPeers);
	const roomState = useRootStore((state) => state.roomState);

	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	useEffect(() => {
		console.log({ peers: Object.values(peers), peerId, isCamPaused });
	}, [peers, peerId, isCamPaused]);

	useEffect(() => {
		console.log("roomState.joined:", roomState.joined);
	}, [roomState.joined]);

	return (
		<Modal
			isOpen={isOpen}
			classes="max-w-[68rem]"
			title={""}
			titleClasses="justify-start text-start"
			content={
				<div className="text-start whitespace-pre-wrap">
					<div className="flex flex-col justify-center items-center">
						{!isCamPaused && <video style={{ width: "80%", borderRadius: "10px" }} ref={videoRef} autoPlay muted></video>}

						{lobbyPeers[0] && <h2>Lobby Peers</h2>}
						<div>
							{lobbyPeers.map((peer) => (
								<div key={peer.peerId}>{peer.peerId}</div>
							))}
						</div>

						{/* {Object.values(peers)[0] && <h2>Peers</h2>} */}

						<div className="peers-grid flex gap-x-4 mt-4">
							{Object.values(peers).map((peer) => (
								<PeerVideoAudioElem peerIdAtIndex={peer.peerId} key={peer.peerId} />
							))}
						</div>

						<div className="card text-xs flex justify-center mt-8 gap-x-2">
							<button onClick={() => enableStream()} className="px-6 py-3 rounded-full bg-light-300 hover:bg-light-200">
								Enable Stream
							</button>
							<button onClick={() => pauseTracks()} className="px-6 py-3 rounded-full bg-light-300 hover:bg-light-200">
								Disable Stream
							</button>
							<button onClick={() => huddleClient.enableWebcam()} className="px-6 py-3 rounded-full bg-light-300 hover:bg-light-200">
								Enable Webcam
							</button>
							<button onClick={() => huddleClient.disableWebcam()} className="px-6 py-3 rounded-full bg-light-300 hover:bg-light-200">
								Disable Webcam
							</button>
							<button
								onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}
								className="px-6 py-3 rounded-full bg-light-300 hover:bg-light-200"
							>
								allowAllLobbyPeersToJoinRoom()
							</button>
						</div>
					</div>
				</div>
			}
			onClose={() => {
				setOpen(false);
			}}
		></Modal>
	);
};

export default HuddleModal;
