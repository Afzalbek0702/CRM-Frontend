import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./helpers/themeProvider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
		},
		mutations: {
			retry: 0,
		},
	},
});
ReactDOM.createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<ThemeProvider>
				<BrowserRouter>
					<App />
					<Toaster />
				</BrowserRouter>
			</ThemeProvider>
		</AuthProvider>
	</QueryClientProvider>,
);
