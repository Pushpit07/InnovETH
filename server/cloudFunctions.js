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
				from: "ArtistVerification",
				localField: "_id",
				foreignField: "userId",
				as: "artistVerification",
			},
		},
		{
			lookup: {
				from: "TrackMinted",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $in: ["$$ethAddress", "$collaborators.address"] },
						},
					},
					{
						$count: "numberOfTracks",
					},
					{
						$project: {
							numberOfTracks: 1,
						},
					},
				],
				as: "tracksMinted",
			},
		},
		{
			lookup: {
				from: "Favourites",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$ethAddress", "$$ethAddress"] },
						},
					},
					{
						$count: "numberOfFavouriteTokens",
					},
					{
						$project: {
							numberOfFavouriteTokens: 1,
						},
					},
				],
				as: "numberOfFavourites",
			},
		},
		{
			lookup: {
				from: "Favourites",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$ethAddress", "$$ethAddress"] },
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							let: { tokenId: "$tokenId" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenId"] }] } } },
								{
									$lookup: {
										from: "TrackMinted",
										let: { trackId: "$trackId" },
										pipeline: [
											{ $match: { $expr: { $and: [{ $eq: ["$trackId", "$$trackId"] }] } } },
											{
												$lookup: {
													from: "_User",
													let: { collaborators: "$collaborators" },
													pipeline: [
														{
															$match: {
																$expr: {
																	$in: ["$ethAddress", "$$collaborators.address"],
																},
															},
														},
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
													as: "collaboratorUsers",
												},
											},
											{
												$lookup: {
													from: "TokenCreated",
													let: { trackId: "$trackId" },
													pipeline: [
														{
															$match: {
																$expr: { $and: [{ $eq: ["$trackId", "$$trackId"] }] },
															},
														},
														{
															$lookup: {
																from: "TokenPriceUpdated",
																let: { tokenId: "$tokenId" },
																pipeline: [
																	{
																		$match: {
																			$expr: {
																				$and: [{ $eq: ["$tokenId", "$$tokenId"] }],
																			},
																		},
																	},
																	{ $sort: { block_timestamp: -1 } },
																	{ $limit: 1 },
																	{ $project: { _id: 0, price: "$newPrice" } },
																],
																as: "tokenPriceUpdated",
															},
														},
														{
															$project: {
																_id: 0,
																tokenId: 1,
																localTokenId: 1,
																price: {
																	$ifNull: [
																		{
																			$first: "$tokenPriceUpdated.price",
																		},
																		"$price",
																	],
																},
															},
														},
													],
													as: "otherTokensOfTrack",
												},
											},
											{
												$project: {
													_id: 0,
													trackId: 1,
													artwork: 1,
													artist: 1,
													artistAddress: 1,
													audio: 1,
													collaborators: 1,
													numberOfCopies: 1,
													genre: 1,
													title: 1,
													collaboratorUsers: 1,
													otherTokensOfTrack: 1,
												},
											},
										],
										as: "favouriteToken",
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
													username: 1,
													ethAddress: 1,
													isArtistVerified: 1,
												},
											},
										],
										as: "artistUser",
									},
								},
								{
									$lookup: {
										from: "TokenPriceUpdated",
										let: { tokenId: "$tokenId" },
										pipeline: [
											{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenId"] }] } } },
											{ $sort: { block_timestamp: -1 } },
											{ $limit: 1 },
											{ $project: { _id: 0, price: "$newPrice" } },
										],
										as: "tokenPriceUpdated",
									},
								},
								{
									$project: {
										_id: 0,
										localTokenId: "$localTokenId",
										price: {
											$ifNull: [
												{
													$first: "$tokenPriceUpdated.price",
												},
												"$price",
											],
										},
										isArtistVerified: { $first: "$artistUser.isArtistVerified" },
										favouriteToken: { $first: "$favouriteToken" },
									},
								},
								{
									$replaceRoot: {
										newRoot: {
											$mergeObjects: ["$$ROOT", "$favouriteToken"],
										},
									},
								},
								{
									$unset: "favouriteToken",
								},
							],
							as: "favouriteTokens",
						},
					},
					{
						$project: {
							_id: 0,
							tokenId: 1,
							favouriteTokens: { $first: "$favouriteTokens" },
						},
					},
					{
						$replaceRoot: {
							newRoot: {
								$mergeObjects: ["$$ROOT", "$favouriteTokens"],
							},
						},
					},
					{
						$unset: "favouriteTokens",
					},
				],
				as: "favourites",
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
		// fetchTracksByUser "Collection"
		{
			lookup: {
				from: "TokenPurchased",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{ $sort: { block_timestamp: -1 } },
					{
						$group: {
							_id: "$tokenId",
							tokenId: { $first: "$tokenId" },
							newOwner: { $first: "$newOwner" },
							price: { $first: "$price" },
							block_timestamp: { $first: "$block_timestamp" },
						},
					},
					{ $match: { $expr: { $and: [{ $eq: ["$newOwner", "$$ethAddress"] }] } } },
					{
						$lookup: {
							from: "TokenCreated",
							let: { tokenId: "$tokenId" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenId"] }] } } },
								{
									$lookup: {
										from: "TrackMinted",
										let: { trackId: "$trackId" },
										pipeline: [
											{ $match: { $expr: { $and: [{ $eq: ["$trackId", "$$trackId"] }] } } },
											{
												$lookup: {
													from: "_User",
													let: { collaborators: "$collaborators" },
													pipeline: [
														{
															$match: {
																$expr: {
																	$in: ["$ethAddress", "$$collaborators.address"],
																},
															},
														},
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
													as: "collaboratorUsers",
												},
											},
											{
												$project: {
													_id: 0,
													trackId: 1,
													artwork: 1,
													artist: 1,
													artistAddress: 1,
													audio: 1,
													collaborators: 1,
													numberOfCopies: 1,
													genre: 1,
													title: 1,
													collaboratorUsers: 1,
												},
											},
										],
										as: "collectedToken",
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
													username: 1,
													ethAddress: 1,
													isArtistVerified: 1,
												},
											},
										],
										as: "artistUser",
									},
								},
								{
									$lookup: {
										from: "TokenPriceUpdated",
										let: { tokenId: "$tokenId" },
										pipeline: [
											{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenId"] }] } } },
											{ $sort: { block_timestamp: -1 } },
											{ $limit: 1 },
											{ $project: { _id: 0, price: "$newPrice" } },
										],
										as: "tokenPriceUpdated",
									},
								},
								{
									$project: {
										_id: 0,
										localTokenId: "$localTokenId",
										price: {
											$ifNull: [
												{
													$first: "$tokenPriceUpdated.price",
												},
												"$price",
											],
										},
										isArtistVerified: { $first: "$artistUser.isArtistVerified" },
										collectedToken: { $first: "$collectedToken" },
									},
								},
								{
									$replaceRoot: {
										newRoot: {
											$mergeObjects: ["$$ROOT", "$collectedToken"],
										},
									},
								},
								{
									$unset: "collectedToken",
								},
							],
							as: "collectedTokens",
						},
					},
					{
						$project: {
							_id: 0,
							tokenId: 1,
							collectedTokens: { $first: "$collectedTokens" },
						},
					},
					{
						$replaceRoot: {
							newRoot: {
								$mergeObjects: ["$$ROOT", "$collectedTokens"],
							},
						},
					},
					{
						$unset: "collectedTokens",
					},
				],
				as: "collection",
			},
		},
		// fetchTracksByUser "New Releases"
		{
			lookup: {
				from: "TrackMinted",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $in: ["$$ethAddress", "$collaborators.address"] },
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							localField: "trackId",
							foreignField: "trackId",
							as: "similarTokens",
						},
					},
					{
						$lookup: {
							from: "TokenPurchased",
							let: { similarTokens: "$similarTokens" },
							pipeline: [
								{ $match: { $expr: { $in: ["$tokenId", "$$similarTokens.tokenId"] } } },
								{ $sort: { price: -1 } },
								{ $sort: { block_timestamp: -1 } },
								{ $group: { _id: "$tokenId", tokenId: { $first: "$tokenId" } } },
							],
							as: "purchasedTokens",
						},
					},
					{
						$lookup: {
							from: "TokenPriceUpdated",
							let: { purchasedTokens: "$purchasedTokens" },
							pipeline: [
								{ $match: { $expr: { $in: ["$tokenId", "$$purchasedTokens.tokenId"] } } },
								{ $sort: { block_timestamp: -1 } },
								{
									$group: {
										_id: "$tokenId",
										tokenId: { $first: "$tokenId" },
										price: { $first: "$newPrice" },
									},
								},
								{ $sort: { price: 1 } },
							],
							as: "tokensPriceUpdated",
						},
					},
					{
						$addFields: {
							similarTokens_size: { $size: "$similarTokens" },
							purchasedTokens_size: { $size: "$purchasedTokens" },
							unsoldTokens: { $setDifference: ["$similarTokens.tokenId", "$purchasedTokens.tokenId"] },
							tokensPriceNotUpdated: {
								$setDifference: ["$similarTokens.tokenId", "$tokensPriceUpdated.tokenId"],
							},
						},
					},
					{
						$addFields: {
							unsoldTokens_size: { $size: "$unsoldTokens" },
						},
					},
					{ $match: { $expr: { $ne: ["$similarTokens_size", "$purchasedTokens_size"] } } },
					{
						$addFields: {
							tokenIdHavingLowestPrice: {
								$ifNull: [
									{
										$first: "$unsoldTokens",
									},
									{
										$ifNull: [
											{
												$first: "$tokensPriceNotUpdated",
											},
											{
												$first: "$tokensPriceUpdated.tokenId",
											},
										],
									},
								],
							},
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							let: { tokenIdHavingLowestPrice: "$tokenIdHavingLowestPrice" },
							pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenIdHavingLowestPrice"] }] } } }],
							as: "tokenHavingLowestPrice",
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
										username: 1,
										ethAddress: 1,
										isArtistVerified: 1,
									},
								},
							],
							as: "artistUser",
						},
					},
					{
						$lookup: {
							from: "_User",
							let: { collaborators: "$collaborators" },
							pipeline: [
								{ $match: { $expr: { $in: ["$ethAddress", "$$collaborators.address"] } } },
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
							as: "collaboratorUsers",
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							let: { trackId: "$trackId" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$trackId", "$$trackId"] }] } } },
								{
									$lookup: {
										from: "TokenPriceUpdated",
										let: { tokenId: "$tokenId" },
										pipeline: [
											{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenId"] }] } } },
											{ $sort: { block_timestamp: -1 } },
											{ $limit: 1 },
											{ $project: { _id: 0, price: "$newPrice" } },
										],
										as: "tokenPriceUpdated",
									},
								},
								{
									$project: {
										_id: 0,
										tokenId: 1,
										localTokenId: 1,
										price: {
											$ifNull: [
												{
													$first: "$tokenPriceUpdated.price",
												},
												"$price",
											],
										},
									},
								},
							],
							as: "otherTokensOfTrack",
						},
					},
					{
						$project: {
							_id: 0,
							block_timestamp: 1,
							trackId: 1,
							tokenId: "$tokenIdHavingLowestPrice",
							localTokenId: { $first: "$tokenHavingLowestPrice.localTokenId" },
							title: 1,
							artist: 1,
							artistAddress: 1,
							isArtistVerified: { $first: "$artistUser.isArtistVerified" },
							artwork: 1,
							audio: 1,
							genre: 1,
							numberOfCopies: 1,
							collaborators: 1,
							collaboratorUsers: 1,
							otherTokensOfTrack: 1,
							price: {
								$ifNull: [
									{
										$cond: [{ $gt: ["$unsoldTokens_size", 0] }, "$price", null],
									},
									{
										$ifNull: [
											{
												$cond: [{ $ne: [{ $size: "$tokensPriceNotUpdated" }, 0] }, "$price", null],
											},
											{
												$first: "$tokensPriceUpdated.price",
											},
										],
									},
								],
							},
						},
					},
					{ $sort: { block_timestamp: -1 } },
				],
				as: "newReleases",
			},
		},
		// fetchTracksByUser "Sold Out"
		{
			lookup: {
				from: "TrackMinted",
				let: { ethAddress: "$ethAddress" },
				pipeline: [
					{
						$match: {
							$expr: { $in: ["$$ethAddress", "$collaborators.address"] },
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							localField: "trackId",
							foreignField: "trackId",
							as: "similarTokens",
						},
					},
					{
						$lookup: {
							from: "TokenPurchased",
							let: { similarTokens: "$similarTokens" },
							pipeline: [
								{ $match: { $expr: { $in: ["$tokenId", "$$similarTokens.tokenId"] } } },
								{ $sort: { price: -1 } },
								{ $sort: { block_timestamp: -1 } },
								{ $group: { _id: "$tokenId", tokenId: { $first: "$tokenId" } } },
							],
							as: "purchasedTokens",
						},
					},
					{
						$lookup: {
							from: "TokenPriceUpdated",
							let: { purchasedTokens: "$purchasedTokens" },
							pipeline: [
								{ $match: { $expr: { $in: ["$tokenId", "$$purchasedTokens.tokenId"] } } },
								{ $sort: { block_timestamp: -1 } },
								{
									$group: {
										_id: "$tokenId",
										tokenId: { $first: "$tokenId" },
										price: { $first: "$newPrice" },
									},
								},
								{ $sort: { price: 1 } },
							],
							as: "tokensPriceUpdated",
						},
					},
					{
						$addFields: {
							similarTokens_size: { $size: "$similarTokens" },
							purchasedTokens_size: { $size: "$purchasedTokens" },
							unsoldTokens: { $setDifference: ["$similarTokens.tokenId", "$purchasedTokens.tokenId"] },
							tokensPriceNotUpdated: {
								$setDifference: ["$similarTokens.tokenId", "$tokensPriceUpdated.tokenId"],
							},
						},
					},
					{
						$addFields: {
							unsoldTokens_size: { $size: "$unsoldTokens" },
						},
					},
					{ $match: { $expr: { $eq: ["$similarTokens_size", "$purchasedTokens_size"] } } },
					{
						$addFields: {
							tokenIdHavingLowestPrice: {
								$ifNull: [
									{
										$first: "$unsoldTokens",
									},
									{
										$ifNull: [
											{
												$first: "$tokensPriceNotUpdated",
											},
											{
												$first: "$tokensPriceUpdated.tokenId",
											},
										],
									},
								],
							},
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							let: { tokenIdHavingLowestPrice: "$tokenIdHavingLowestPrice" },
							pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenIdHavingLowestPrice"] }] } } }],
							as: "tokenHavingLowestPrice",
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
										username: 1,
										ethAddress: 1,
										isArtistVerified: 1,
									},
								},
							],
							as: "artistUser",
						},
					},
					{
						$lookup: {
							from: "_User",
							let: { collaborators: "$collaborators" },
							pipeline: [
								{ $match: { $expr: { $in: ["$ethAddress", "$$collaborators.address"] } } },
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
							as: "collaboratorUsers",
						},
					},
					{
						$lookup: {
							from: "TokenCreated",
							let: { trackId: "$trackId" },
							pipeline: [
								{ $match: { $expr: { $and: [{ $eq: ["$trackId", "$$trackId"] }] } } },
								{
									$lookup: {
										from: "TokenPriceUpdated",
										let: { tokenId: "$tokenId" },
										pipeline: [
											{ $match: { $expr: { $and: [{ $eq: ["$tokenId", "$$tokenId"] }] } } },
											{ $sort: { block_timestamp: -1 } },
											{ $limit: 1 },
											{ $project: { _id: 0, price: "$newPrice" } },
										],
										as: "tokenPriceUpdated",
									},
								},
								{
									$project: {
										_id: 0,
										tokenId: 1,
										localTokenId: 1,
										price: {
											$ifNull: [
												{
													$first: "$tokenPriceUpdated.price",
												},
												"$price",
											],
										},
									},
								},
							],
							as: "otherTokensOfTrack",
						},
					},
					{
						$project: {
							_id: 0,
							block_timestamp: 1,
							trackId: 1,
							tokenId: "$tokenIdHavingLowestPrice",
							localTokenId: { $first: "$tokenHavingLowestPrice.localTokenId" },
							title: 1,
							artist: 1,
							artistAddress: 1,
							isArtistVerified: { $first: "$artistUser.isArtistVerified" },
							artwork: 1,
							audio: 1,
							genre: 1,
							numberOfCopies: 1,
							collaborators: 1,
							collaboratorUsers: 1,
							otherTokensOfTrack: 1,
							price: {
								$ifNull: [
									{
										$cond: [{ $gt: ["$unsoldTokens_size", 0] }, "$price", null],
									},
									{
										$ifNull: [
											{
												$cond: [{ $ne: [{ $size: "$tokensPriceNotUpdated" }, 0] }, "$price", null],
											},
											{
												$first: "$tokensPriceUpdated.price",
											},
										],
									},
								],
							},
						},
					},
					{ $sort: { block_timestamp: -1 } },
				],
				as: "soldOut",
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
				verificationRequested: { $first: "$artistVerification.verificationRequested" },
				numberOfTracksByArtist: { $first: "$tracksMinted.numberOfTracks" },
				numberOfFavouriteTokens: { $first: "$numberOfFavourites.numberOfFavouriteTokens" },
				numberOfFollowing: { $first: "$following.numberOfFollowing" },
				numberOfFollowers: { $first: "$followers.numberOfFollowers" },
				favourites: "$favourites",
				collection: "$collection",
				newReleases: "$newReleases",
				soldOut: "$soldOut",
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

Moralis.Cloud.define("fetchProposals", async (request) => {
	const query = new Moralis.Query("ProposalCreated", { useMasterKey: true });
	const pipeline = [];

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
	];

	const result = await query.aggregate(pipeline);
	return result[0];
});
