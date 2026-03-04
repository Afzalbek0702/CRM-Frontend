import {
	Routes,
	Route,
	Navigate,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { useState } from "react";
import RequireAuth from "./components/RequireAuth";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupInfo from "./pages/GroupInfo";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Teachers from "./pages/Teachers";
import TeacherDetail from "./pages/TeacherDetail";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import Leads from "./pages/Leads";
import Archive from "./pages/Archive";
import Settings from "./pages/Settings";
import { setNavigate } from "./utils/navigate";
import { useEffect } from "react";
export default function Layout() {
	const location = useLocation();
	const hideSidebar = location.pathname === "/login";
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		setNavigate(navigate);
	}, [navigate]);

	return (
		<>
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
							onToggle={() => setSidebarExpanded(!sidebarExpanded)}
							mobileOpen={mobileOpen}
							onClose={() => setMobileOpen(false)}
						/>
						{mobileOpen && (
							<div
								className="sidebar-backdrop"
								onClick={() => setMobileOpen(false)}
							/>
						)}
					</>
				)}
				<main
					className={`content ${sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
						} ${location.pathname === "/login" ? "login-page" : ""}`}
				>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Navigate to="/dashboard" />} />
						<Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
						<Route path="/leads" element={<RequireAuth><Leads /></RequireAuth>} />
						<Route path="/archive/:category" element={<RequireAuth><Archive /></RequireAuth>} />
						<Route path="/groups" element={<RequireAuth><Groups /></RequireAuth>} />
						<Route path="/groups/:id" element={<RequireAuth><GroupInfo /></RequireAuth>} />
						<Route path="/students" element={<RequireAuth><Students /></RequireAuth>} />
						<Route path="/students/:id" element={<RequireAuth><StudentDetail /></RequireAuth>} />
						<Route path="/teachers" element={<RequireAuth><Teachers /></RequireAuth>} />
						<Route path="/teachers/:id" element={<RequireAuth><TeacherDetail /></RequireAuth>} />
						<Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>}></Route>

						{/* o'zgartirvormelar yoki ochirvormelar!! */}
						<Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
						<Route path="/payments/:category" element={<RequireAuth><Payments /></RequireAuth>} />
						{/*  */}
					</Routes>
				</main>
			</div>
		</>
	);
}
