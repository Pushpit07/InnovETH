Moralis.Cloud.define("fetchUserAvatarFromAddress", async (request) => {
	if (request.params.address) {
		const query = new Moralis.Query("_User", { useMasterKey: true });
		const pipeline = [
			{
				match: {
					ethAddress: request.params.address,
				},
			},
			{
				lookup: {
					from: "UserInfo",
					localField: "_id",
					foreignField: "userId",
					as: "userInfo",
				},
			},
			{
				project: {
					"userInfo.avatar": 1,
				},
			},
		];
		const result = await query.aggregate(pipeline);
		return result[0].userInfo[0].avatar;
	}
	return null;
});

Moralis.Cloud.define("checkUsernameAvailability", async (request) => {
	if (request.params.username) {
		const query = new Moralis.Query("_User", { useMasterKey: true });
		query.equalTo("username", request.params.username);
		const result = await query.first({ useMasterKey: true });
		if (result) {
			return "Username already exists!";
		}
		return false;
	}
	return null;
});

Moralis.Cloud.define("checkEmailExists", async (request) => {
	if (request.params.email) {
		const query = new Moralis.Query("_User", { useMasterKey: true });
		query.equalTo("email", request.params.email);
		query.equalTo("emailVerified", true);
		const result = await query.first({ useMasterKey: true });
		if (result) {
			return "An account with this email already exists";
		}
		return false;
	}
	return null;
});
