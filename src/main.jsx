import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
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
					<Toaster
						position="top-center"
						toastOptions={{
							duration: 4000,
							style: {
								// O'ta qora rang (Rich Black)
								background: "#0a0a0a",
								color: "#ffffff",

								// Yupqa va nafis chegara
								border: "1px solid #1a1a1a",

								padding: "16px 24px",
								borderRadius: "10px",
								fontSize: "15px",
								fontWeight: "500",

								// Kuchliroq soya (chuqurlik berish uchun)
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)",
							},
							success: {
								style: {
									// Muvaffaqiyat bo'lganda yashil neon chiziq (pastki qismida)
									borderBottom: "2px solid #10b981",
								},
								iconTheme: {
									primary: "#10b981",
									secondary: "#000",
								},
							},
							error: {
								style: {
									// Xato bo'lganda qizil neon chiziq
									borderBottom: "2px solid #ef4444",
								},
								iconTheme: {
									primary: "#ef4444",
									secondary: "#000",
								},
							},
						}}
					/>
					<Analytics />
				</BrowserRouter>
			</ThemeProvider>
		</AuthProvider>
	</QueryClientProvider>,
);
