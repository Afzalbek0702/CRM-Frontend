import {
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupInfo from "./pages/GroupInfo";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Teachers from "./pages/Teachers";
import TeacherDetail from "./pages/TeacherDetail";
import Payments from "./pages/Payments";
import Login from "./pages/Login";

export default function Layout() {
	const location = useLocation();
	const token = localStorage.getItem("token");
	const hideSidebar = location.pathname === "/login";
	return (
		<>
			<div className="app-layout">
				{!hideSidebar && <Sidebar />}
				<main className="content">
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
