import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import Header from "./components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./helpers/themeProvider";

export default function Layout() {
	const location = useLocation();
	const isLoginPage = location.pathname.endsWith("/login");

	if (isLoginPage) {
		return <Outlet />;
	}

	return (
		<ThemeProvider>
			<TooltipProvider>
				<SidebarProvider>
					<div className="flex min-h-screen w-full bg-background text-foreground ">
						<AppSidebar />
						<SidebarInset className="flex flex-col p-6">
							<Header />
							<div className="overflow-x-hidden mt-17.5">
								<Outlet />
							</div>
						</SidebarInset>
					</div>
				</SidebarProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}
