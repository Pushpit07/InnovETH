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

Moralis.Cloud.define("fetchProfileDetails", async (request) => {
	const query = new Moralis.Query("_User", { useMasterKey: true });
	const pipeline = [
		{
			match: {
				username: request.params.username,
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
			lookup: {
				from: "ProposalCreated",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$$ethAddress", "$creator"] },
						},
					},
					{
						$count: "numberOfProposals",
					},
					{
						$project: {
							numberOfProposals: 1,
						},
					},
				],
				as: "proposalsCreated",
			},
		},
		{
			lookup: {
				from: "Bookmarks",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$ethAddress", "$$ethAddress"] },
						},
					},
					{
						$count: "numberOfBookmarks",
					},
					{
						$project: {
							numberOfBookmarks: 1,
						},
					},
				],
				as: "numberOfBookmarks",
			},
		},
		{
			lookup: {
				from: "Bookmarks",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$ethAddress", "$$ethAddress"] },
						},
					},

					{
						$lookup: {
							from: "ProposalCreated",
							let: { proposalId: "$proposalId" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$proposalId", "$$proposalId"] }] } } },
								{
									$project: {
										_id: 0,
										proposalId: 1,
										image: 1,
										name: 1,
										summary: 1,
										description: 1,
									},
								},
							],
							as: "bookmarkedProposal",
						},
					},
					{
						$lookup: {
							from: "_User",
							let: { creator: "$creator" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$ethAddress", "$$creator"] }] } } },
								{
									$lookup: {
										from: "UserInfo",
										localField: "_id",
										foreignField: "userId",
										as: "userInfo",
									},
								},
								{
									$project: {
										_id: 0,
										name: 1,
										username: 1,
										ethAddress: 1,
										avatar: { $first: "$userInfo.avatar" },
									},
								},
							],
							as: "creatorUser",
						},
					},
					{
						$project: {
							_id: 0,
							bookmarkedProposal: { $first: "$bookmarkedProposal" },
						},
					},
					// {
					// 	$replaceRoot: {
					// 		newRoot: {
					// 			$mergeObjects: ["$$ROOT", "$bookmarkedProposal"],
					// 		},
					// 	},
					// },
					// {
					// 	$unset: "bookmarkedProposal",
					// },
					// {
					// 	$project: {
					// 		_id: 0,
					// 		proposalId: 1,
					// 		bookmarkedProposals: { $first: "$bookmarkedProposals" },
					// 	},
					// },
					// {
					// 	$replaceRoot: {
					// 		newRoot: {
					// 			$mergeObjects: ["$$ROOT", "$bookmarkedProposals"],
					// 		},
					// 	},
					// },
					// {
					// 	$unset: "bookmarkedProposals",
					// },
				],
				as: "bookmarks",
			},
		},
		{
			lookup: {
				from: "Followers",
				let: { userId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$follower_userId", "$$userId"] },
						},
					},
					{
						$count: "numberOfFollowing",
					},
					{
						$project: {
							numberOfFollowing: 1,
						},
					},
				],
				as: "following",
			},
		},
		{
			lookup: {
				from: "Followers",
				let: { userId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$following_userId", "$$userId"] },
						},
					},
					{
						$count: "numberOfFollowers",
					},
					{
						$project: {
							numberOfFollowers: 1,
						},
					},
				],
				as: "followers",
			},
		},
		{
			lookup: {
				from: "ProposalCreated",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $and: [{ $eq: ["$$ethAddress", "$creator"] }] },
						},
					},
					{
						$lookup: {
							from: "_User",
							let: { creator: "$creator" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$ethAddress", "$$creator"] }] } } },
								{
									$project: {
										_id: 0,
										name: 1,
										username: 1,
										ethAddress: 1,
									},
								},
							],
							as: "creatorUser",
						},
					},
					{
						$project: {
							_id: 0,
							block_timestamp: 1,
							proposalId: 1,
							summary: 1,
							creator: { $first: "$creatorUser" },
							name: 1,
							URIHash: 1,
							image: 1,
							description: 1,
						},
					},
					{ $sort: { block_timestamp: -1 } },
				],
				as: "proposals",
			},
		},
		{
			project: {
				_id: 0,
				ethAddress: 1,
				name: 1,
				username: 1,
				isArtist: 1,
				isArtistVerified: 1,
				createdAt: 1,
				avatar: { $first: "$userInfo.avatar" },
				coverImage: { $first: "$userInfo.coverImage" },
				spotify: { $first: "$userInfo.spotify" },
				instagram: { $first: "$userInfo.instagram" },
				facebook: { $first: "$userInfo.facebook" },
				twitter: { $first: "$userInfo.twitter" },
				bio: { $first: "$userInfo.bio" },
				country: { $first: "$userInfo.country" },
				numberOfProposals: { $first: "$proposalsCreated.numberOfProposals" },
				numberOfBookmarks: { $first: "$numberOfBookmarks.numberOfBookmarks" },
				numberOfFollowing: { $first: "$following.numberOfFollowing" },
				numberOfFollowers: { $first: "$followers.numberOfFollowers" },
				bookmarks: "$bookmarks",
				proposals: "$proposals",
			},
		},
	];
	const result = await query.aggregate(pipeline);
	return result[0];
});

Moralis.Cloud.define("fetchUserInfo", async (request) => {
	const query = new Moralis.Query("_User", { useMasterKey: true });
	const pipeline = [
		{
			match: {
				_id: request.params.userId,
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
				_id: 1,
				ethAddress: 1,
				name: 1,
				username: 1,
				avatar: { $first: "$userInfo.avatar" },
				coverImage: { $first: "$userInfo.coverImage" },
				bio: { $first: "$userInfo.bio" },
				spotify: { $first: "$userInfo.spotify" },
				instagram: { $first: "$userInfo.instagram" },
				twitter: { $first: "$userInfo.twitter" },
				facebook: { $first: "$userInfo.facebook" },
				country: { $first: "$userInfo.country" },
				state: { $first: "$userInfo.state" },
				city: { $first: "$userInfo.city" },
			},
		},
	];

	const result = await query.aggregate(pipeline);
	return result[0];
});

Moralis.Cloud.define("fetchUserPreferences", async (request) => {
	const query = new Moralis.Query("UserPreferences", { useMasterKey: true });
	const pipeline = [
		{
			match: {
				userId: request.params.userId,
			},
		},
	];

	const result = await query.aggregate(pipeline);
	return result[0];
});

Moralis.Cloud.define("updateUserInfo", async (request) => {
	const query = new Moralis.Query("UserInfo");
	query.equalTo("userId", request.user.id);
	const queryResult = await query.first();

	if (queryResult) {
		queryResult.set("avatar", request.params.avatar);
		queryResult.set("coverImage", request.params.coverImage);
		queryResult.set("bio", request.params.bio);
		queryResult.set("spotify", request.params.spotify);
		queryResult.set("instagram", request.params.instagram);
		queryResult.set("twitter", request.params.twitter);
		queryResult.set("facebook", request.params.facebook);
		queryResult.set("country", request.params.country);
		queryResult.set("state", request.params.state);
		queryResult.set("city", request.params.city);

		return queryResult.save();
	}
	return null;
});

Moralis.Cloud.define("updateUserPreferences", async (request) => {
	const query = new Moralis.Query("UserPreferences");
	query.equalTo("user", request.user);
	const queryResult = await query.first();

	if (queryResult) {
		queryResult.set("newsletter", request.params.newsletter);
		queryResult.set("tradeNotifications", request.params.tradeNotifications);

		return queryResult.save();
	}
	return null;
});

Moralis.Cloud.define("switchAccountType", async (request) => {
	if (request.user) {
		const query = new Moralis.Query("_User", { useMasterKey: true });
		query.equalTo("objectId", request.user.id);
		const queryResult = await query.first({ useMasterKey: true });

		if (queryResult) {
			if (queryResult.attributes.isArtist) {
				queryResult.set("isArtist", false);
				queryResult.set("isArtistVerified", false);
			} else {
				queryResult.set("isArtist", true);
			}
			return queryResult.save(null, { useMasterKey: true });
		}
	}
	return null;
});

Moralis.Cloud.define("fetchProposals", async (request) => {
	const query = new Moralis.Query("ProposalCreated", { useMasterKey: true });
	const pipeline = [
		{
			lookup: {
				from: "_User",
				let: { creator: "$creator" },
				pipeline: [
					{ $match: { $expr: { $and: [{ $eq: ["$ethAddress", "$$creator"] }] } } },
					{
						$lookup: {
							from: "UserInfo",
							localField: "_id",
							foreignField: "userId",
							as: "userInfo",
						},
					},
					{
						$project: {
							_id: 0,
							name: 1,
							username: 1,
							ethAddress: 1,
							isArtistVerified: 1,
							avatar: { $first: "$userInfo.avatar" },
						},
					},
				],
				as: "user",
			},
		},
		{
			project: {
				_id: 1,
				URIHash: 1,
				address: 1,
				block_timestamp: 1,
				createdAt: 1,
				creator: 1,
				description: 1,
				summary: 1,
				image: 1,
				name: 1,
				proposalId: 1,
				user: { $first: "$user" },
			},
		},
	];

	const result = await query.aggregate(pipeline);
	return result;
});

Moralis.Cloud.afterSave("ProposalCreated", async (request) => {
	if (!request.object.get("description")) {
		await Moralis.Cloud.httpRequest({
			url: `https://${request.object.get("URIHash")}.ipfs.w3s.link/proposal.json`,
		}).then(
			async (httpResponse) => {
				const metadata = httpResponse.data;

				const objectId = request.object.id;
				const ProposalCreated = Moralis.Object.extend("ProposalCreated");
				const query = new Moralis.Query(ProposalCreated);
				query.equalTo("objectId", objectId);
				const proposal = await query.first();

				// success
				proposal.set("name", metadata.name);
				proposal.set("summary", metadata.summary);
				proposal.set("description", metadata.description);
				proposal.set("image", metadata.image);
				await proposal.save();
			},
			(httpResponse) => {
				// if error
				logger.error(`Request failed with response code ${httpResponse.status}`);
			}
		);
	}
});

Moralis.Cloud.define("fetchProposalDetails", async (request) => {
	const query = new Moralis.Query("ProposalCreated", { useMasterKey: true });
	const pipeline = [
		{
			match: {
				proposalId: request.params.proposalId,
			},
		},
		{
			lookup: {
				from: "_User",
				let: { creator: "$creator" },
				pipeline: [
					{ $match: { $expr: { $and: [{ $eq: ["$ethAddress", "$$creator"] }] } } },
					{
						$lookup: {
							from: "UserInfo",
							localField: "_id",
							foreignField: "userId",
							as: "userInfo",
						},
					},
					{
						$project: {
							_id: 0,
							name: 1,
							username: 1,
							ethAddress: 1,
							isArtistVerified: 1,
							avatar: { $first: "$userInfo.avatar" },
						},
					},
				],
				as: "user",
			},
		},
		{
			project: {
				_id: 1,
				URIHash: 1,
				address: 1,
				block_timestamp: 1,
				createdAt: 1,
				creator: 1,
				summary: 1,
				description: 1,
				image: 1,
				name: 1,
				proposalId: 1,
				user: { $first: "$user" },
			},
		},
	];

	const result = await query.aggregate(pipeline);
	return result[0];
});

Moralis.Cloud.define("fetchUserHasJoined", async (request) => {
	const query = new Moralis.Query("TokenMinted", { useMasterKey: true });
	const pipeline = [
		{
			match: {
				proposalId: request.params.proposalId,
				caller: request.user.attributes.ethAddress,
			},
		},
	];

	const result = await query.aggregate(pipeline);

	if (result[0]) {
		return true;
	}
	return false;
});
