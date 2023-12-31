import "../styles/globals.css";
import { SWRConfig } from "swr";
import fetch from "../lib/fetchJson";

function MyApp({ Component, pageProps }) {
	return (
		<SWRConfig
			value={{
				fetcher: fetch,
				onError: (err) => {
          			console.log("erroraso")
					console.error(err);
				},
			}}
		>
			<Component {...pageProps} />
		</SWRConfig>
	);
}

export default MyApp;