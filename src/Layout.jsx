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
				<div className="relative flex min-h-screen w-full bg-background text-foreground overflow-hidden">
					<Header />
					<div className="flex flex-1 pt-17.5 h-screen w-full">
						<AppSidebar className="mt-17.5" />

						<SidebarInset className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6">
							<Outlet />
						</SidebarInset>
					</div>
				</div>
			</SidebarProvider>
		</TooltipProvider>
	);
}
