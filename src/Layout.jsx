import {
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { FaBars } from "react-icons/fa";

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

export default function Layout() {
	const location = useLocation();
	const token = localStorage.getItem("token");
	const hideSidebar = location.pathname === "/login";
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<div className="app-layout">
				{!hideSidebar && (
					<>
						<button
							className={`hamburger-button ${sidebarOpen ? 'hidden' : ''}`}
							onClick={() => setSidebarOpen(!sidebarOpen)}
							aria-label="Toggle sidebar">
							<FaBars />
						</button>
						<Sidebar
							isOpen={sidebarOpen}
							onClose={() => setSidebarOpen(false)}
						/>
						{sidebarOpen && (
							<div
								className="sidebar-backdrop"
								onClick={() => setSidebarOpen(false)}
							/>
						)}
					</>
				)}
				<main className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route
							path="/"
							element={
								token ? (
									<Navigate to="/dashboard" />
								) : (
									<Navigate to={"/login"}></Navigate>
								)
							}
						/>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/leads" element={<Leads />} />
						<Route path="/archive" element={<Archive />} />
						<Route path="/groups" element={<Groups />} />
						<Route path="/groups/:id" element={<GroupInfo />} />
						<Route path="/students" element={<Students />} />
						<Route path="/students/:id" element={<StudentDetail />} />
						<Route path="/teachers" element={<Teachers />} />
						<Route path="/teachers/:id" element={<TeacherDetail />} />
						<Route path="/payments" element={<Payments />} />
					</Routes>
				</main>
			</div>
		</>
	);
}
