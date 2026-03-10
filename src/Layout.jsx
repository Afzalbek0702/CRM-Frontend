import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { setNavigate } from "./utils/navigate";
import { useNavigate } from "react-router-dom";
export default function Layout() {
	const location = useLocation();
	const navigate = useNavigate();
	const hideSidebar = location.pathname.endsWith("/login");

	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		setNavigate(navigate);
	}, [navigate,]);

	return (
		<div className="app-layout">
			{!hideSidebar && (
				<>
					<Header
						isExpanded={sidebarExpanded}
						mobileOpen={mobileOpen}
						onToggle={() => {
							if (window.innerWidth < 640) {
								setMobileOpen(!mobileOpen);
							} else {
								setSidebarExpanded(!sidebarExpanded);
							}
						}}
					/>
					<Sidebar
						isExpanded={mobileOpen ? true : sidebarExpanded}
						mobileOpen={mobileOpen}
						onClose={() => setMobileOpen(false)}
					/>
				</>
			)}

			<main
				className={`content ${
					sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
				} ${hideSidebar ? "login-page" : ""}`}
         >
				<Outlet />
			</main>
		</div>
	);
}
