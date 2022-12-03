import ReactMarkdown from "react-markdown";
import DiscussionIntro from "./DiscussionIntro";
import dynamic from "next/dynamic";
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
	ssr: false,
});
import uploadFileToIPFS from "../../utils/image-crop/uploadToIPFS";
import convertDataURLtoFile from "../../utils/image-crop/convertDataURLtoFile";
import { useContext } from "react";
import LoadingContext from "../../../store/loading-context";
import { useState } from "react";

export default function Discussion({proposal, handleJoin}){
    const [, setLoading] = useContext(LoadingContext);
    const [comment, setComment] = useState("");

    function onImageUpload(file) {
        setLoading(true);
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (data) => {
				const mimeFile = convertDataURLtoFile(data.target.result, "imageFile")
				uploadFileToIPFS(Moralis, mimeFile)
                    .then((ipfsHash)=>{setLoading(false);resolve(ipfsHash)})
                    .catch((e)=>{console.log(e); setLoading(false)});
			};
			reader.readAsDataURL(file);
		});
	}

    const handleCommentSubmission = (e)=>{
        //Do things here (PUSHPIT)
    }

    return(
        <>
            <div className="w-screen bg-[#E6D4FF] flex flex-col items-center justify-center pt-32 pb-7">
                <DiscussionIntro proposal={proposal} handleJoin={handleJoin}/>
                <div className="w-full max-w-[1920px] mt-8 px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36 flex">
                    <div className="w-full max-w-[650px] bg-white p-8 rounded-3xl">
                        <h3 className="mb-10 text-xl font-semibold">Description:</h3>
                        <ReactMarkdown>{proposal.description}</ReactMarkdown>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-screen pt-20">
                <div className="w-full max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
                    <form onSubmit={handleCommentSubmission} className="rounded-[4.5rem] bg-light-200">
                        <h4 className="text-xl my-7">Express your thoughts</h4>
                        <MdEditor
                            className="mt-1"
                            style={{ height: "500px" }}
                            placeholder="Enter your comment here (Markdown is Supported)"
                            view={{ fullScreen: false }}
                            imageAccept=".jpg,.png,.jpeg,.svg,.hevc"
                            onImageUpload={onImageUpload}
                            renderHTML={(text) => {
                                setComment(text);
                                return <ReactMarkdown>{text}</ReactMarkdown>;
                            }}
                        />
                        <button type="submit" className="bg-[#3D0B56] text-lg px-16 py-3 text-white rounded-xl">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}