async function convertMaticToUSD(price) {
	const COINBASE_BASE_URL = "https://api.coinbase.com/v2";
	const res = await fetch(`${COINBASE_BASE_URL}/prices/MATIC-USD/buy`);
	const result = await res.json();
	return (result.data.amount * price).toFixed(2);
}

async function convertMaticToINR(price) {
	const COINBASE_BASE_URL = "https://api.coinbase.com/v2";
	const res = await fetch(`${COINBASE_BASE_URL}/prices/MATIC-INR/buy`);
	const result = await res.json();
	return (result.data.amount * price).toFixed(0);
}

function truncatePrice(price) {
	let truncatedPrice = price;
	if (price >= 1000000) {
		truncatedPrice = Number((price / 1000000).toFixed(2)) + " M";
	} else if (price >= 1000) {
		truncatedPrice = Number((price / 1000).toFixed(2)) + " K";
	}

	return truncatedPrice;
}

module.exports = {
	convertMaticToUSD,
	convertMaticToINR,
	truncatePrice,
};
