import { Outlet, useLocation, Navigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import Header from "./components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routeRoles } from "./utils/authConfig";
import { useAuth } from "./context/authContext";

export default function Layout() {
	const location = useLocation();
	const isLoginPage = location.pathname.endsWith("/login");
	const { user } = useAuth();
	const { tenant } = useParams();

	const pathSegment = location.pathname.split("/").slice(2).join("/");
	const matchedKey = Object.keys(routeRoles).find(key =>
		pathSegment === key || pathSegment.startsWith(key + "/")
	);
	const allowedRoles = matchedKey ? routeRoles[matchedKey] : null;

	if (allowedRoles && (allowedRoles.includes("") || !allowedRoles.includes(user?.role))) {
		return <Navigate to={`/${tenant}/notauthorized`} replace />;
	}

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
