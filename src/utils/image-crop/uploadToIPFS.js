export default async function uploadFileToIPFS(Moralis, fileToUpload) {
	if (fileToUpload === null) return null;
	const file = new Moralis.File("file", fileToUpload);
	await file.saveIPFS();
	return file.ipfs();
}
