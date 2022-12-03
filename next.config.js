const withPWA = require("next-pwa");

module.exports = withPWA({
	reactStrictMode: true,
	swcMinify: true,
	webpack5: true,
	webpack: (config) => {
		config.resolve.fallback = { fs: false };
		return config;
	},
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === "development",
	},
	images: {
		domains: ["pbs.twimg.com", "ipfs.moralis.io", "gateway.musixverse.com"],
	},
	// for running with docker
	output: "standalone",
});
