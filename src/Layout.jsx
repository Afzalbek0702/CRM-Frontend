import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
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

export default function Layout() {
	const location = useLocation();
	const hideSidebar = location.pathname === "/login";
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);

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
					className={`content ${
						sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
					} ${location.pathname === "/login" ? "login-page" : ""}`}
				>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Navigate to="/dashboard" />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/leads" element={<Leads />} />
						<Route path="/archive/:category" element={<Archive />} />
						<Route path="/groups" element={<Groups />} />
						<Route path="/groups/:id" element={<GroupInfo />} />
						<Route path="/students" element={<Students />} />
						<Route path="/students/:id" element={<StudentDetail />} />
						<Route path="/teachers" element={<Teachers />} />
						<Route path="/teachers/:id" element={<TeacherDetail />} />
						<Route path="/settings" element={<Settings />}></Route>

						{/* o'zgartirvormelar yoki ochirvormelar!! */}
						<Route path="/payments" element={<Payments />} />
						<Route path="/payments/:category" element={<Payments />} />
						{/*  */}
					</Routes>
				</main>
			</div>
		</>
	);
}
