import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/icon.png"></link>
					<link rel="icon" href="/favicon.ico" />
					<meta name="theme-color" content="#fff" />
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-elements/dist/css/index.min.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
