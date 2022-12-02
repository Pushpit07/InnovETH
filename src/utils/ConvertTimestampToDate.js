const pad = (num) => ("0" + num).slice(-2);

function convertTimestampToDate(timestamp) {
	const _timestamp = new Date(timestamp);

	return (
		_timestamp.getDate() +
		" " +
		_timestamp.toDateString().split(" ")[1] +
		" " +
		_timestamp.getFullYear() +
		", " +
		pad(_timestamp.getHours()) +
		":" +
		pad(_timestamp.getMinutes())
	);
}

module.exports = {
	convertTimestampToDate,
};
