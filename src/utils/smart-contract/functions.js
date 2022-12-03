import Web3 from "web3";
import Moralis from "moralis";
// Importing contract abi, address, and other variables
import { INNOVETH_FACET_CONTRACT_ABI, INNOVETH_GETTERS_FACET_CONTRACT_ABI, INNOVETH_SETTERS_FACET_CONTRACT_ABI } from "../../constants";

var MUSIXVERSE;

async function addPolygonNetwork() {
	const { ethereum } = window;

	if (window && window.localStorage.walletconnect) {
	} else {
		try {
			await ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [
					{
						chainId:
							process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "80001"
								? "0x13881" // Hexadecimal version of 80001, prefixed with 0x
								: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "137"
								? "0x89" // Hexadecimal version of 137, prefixed with 0x
								: null,
					},
				],
			});
		} catch (error) {
			if (error.code === 4902) {
				try {
					await ethereum.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId:
									process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "80001"
										? "0x13881" // Hexadecimal version of 80001, prefixed with 0x
										: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "137"
										? "0x89" // Hexadecimal version of 137, prefixed with 0x
										: null,
								chainName:
									process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "80001"
										? "Polygon Mumbai Testnet"
										: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "137"
										? "Polygon Mainnet"
										: null,
								nativeCurrency: {
									name: "MATIC",
									symbol: "MATIC",
									decimals: 18,
								},
								rpcUrls:
									process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "80001"
										? ["https://matic-mumbai.chainstacklabs.com/"]
										: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "137"
										? ["https://matic-mainnet.chainstacklabs.com"]
										: null,
								blockExplorerUrls:
									process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "80001"
										? ["https://mumbai.polygonscan.com/"]
										: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID === "137"
										? ["https://polygonscan.com/"]
										: null,
								iconUrls: [""],
							},
						],
					});
				} catch (addError) {
					console.log("Did not add network");
				}
			}
		}
	}
}

async function connectSmartContract() {
	const { ethereum } = window;

	const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_RPC_URL);
	window.web3 = new Web3(provider);

	const web3 = window.web3;
	MUSIXVERSE = await new web3.eth.Contract(INNOVETH_FACET_CONTRACT_ABI, process.env.NEXT_PUBLIC_INNOVETH_DIAMOND_ADDRESS);
	console.log("Contract connected");

	if (ethereum && (await ethereum.request({ method: "net_version" })) !== process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_ID.toString()) {
		await addPolygonNetwork();
	} else if (ethereum) {
		await addPolygonNetwork();
		window.web3 = new Web3(ethereum);
	}
}

async function createProposal(metadataHash) {
	if (window.localStorage.walletconnect) {
		await Moralis.enableWeb3({ provider: "walletconnect" });

		const sendOptions = {
			contractAddress: process.env.NEXT_PUBLIC_INNOVETH_DIAMOND_ADDRESS,
			functionName: "createProposal",
			abi: INNOVETH_FACET_CONTRACT_ABI,
			params: {
				URIHash: metadataHash,
			},
		};

		const transaction = await Moralis.executeFunction(sendOptions);
		// Wait until the transaction is confirmed
		await transaction.wait();
		return;
	}

	const { ethereum } = window;
	const callerAddress = Moralis.User.current().attributes.ethAddress;
	if (callerAddress === ethereum.selectedAddress) {
		const sendOptions = {
			contractAddress: process.env.NEXT_PUBLIC_INNOVETH_DIAMOND_ADDRESS,
			functionName: "createProposal",
			abi: INNOVETH_FACET_CONTRACT_ABI,
			params: {
				URIHash: metadataHash,
			},
		};

		const transaction = await Moralis.executeFunction(sendOptions);
		// Wait until the transaction is confirmed
		await transaction.wait();
	} else {
		window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [
				{
					eth_accounts: {},
				},
			],
		});
		throw { title: "User is not connected to the same wallet", message: "Please connect to the same wallet as your Musixverse account." };
	}
}

async function joinDiscussion(proposalId) {
	if (window.localStorage.walletconnect) {
		await Moralis.enableWeb3({ provider: "walletconnect" });

		const sendOptions = {
			contractAddress: process.env.NEXT_PUBLIC_INNOVETH_DIAMOND_ADDRESS,
			functionName: "joinDiscussion",
			abi: INNOVETH_FACET_CONTRACT_ABI,
			params: {
				proposalId: proposalId,
			},
		};

		const transaction = await Moralis.executeFunction(sendOptions);
		// Wait until the transaction is confirmed
		await transaction.wait();
		return;
	}

	const { ethereum } = window;
	const callerAddress = Moralis.User.current().attributes.ethAddress;
	if (callerAddress === ethereum.selectedAddress) {
		const sendOptions = {
			contractAddress: process.env.NEXT_PUBLIC_INNOVETH_DIAMOND_ADDRESS,
			functionName: "joinDiscussion",
			abi: INNOVETH_FACET_CONTRACT_ABI,
			params: {
				proposalId: proposalId,
			},
		};

		const transaction = await Moralis.executeFunction(sendOptions);
		// Wait until the transaction is confirmed
		await transaction.wait();
	} else {
		window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [
				{
					eth_accounts: {},
				},
			],
		});
		throw { title: "User is not connected to the same wallet", message: "Please connect to the same wallet as your Musixverse account." };
	}
}

module.exports = {
	addPolygonNetwork,
	connectSmartContract,
	createProposal,
	joinDiscussion,
};
