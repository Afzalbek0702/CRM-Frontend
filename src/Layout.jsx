import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import Header from "./components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Layout() {
	const location = useLocation();
	const isLoginPage = location.pathname.endsWith("/login");

	if (isLoginPage) {
		return <Outlet />;
	}

	return (
		<TooltipProvider>
			<SidebarProvider>
				<div className="flex min-h-screen w-full bg-background text-foreground dark:bg-background dark:text-foreground">
					<AppSidebar />
					<SidebarInset className="flex flex-col p-6">
						<Header />
						<div className="flex-1 overflow-x-hidden">
							<Outlet />
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</TooltipProvider>
	);
}