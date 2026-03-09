import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Layout from "./Layout";

import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupInfo from "./pages/GroupInfo";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Teachers from "./pages/Teachers";
import TeacherDetail from "./pages/TeacherDetail";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import Superadmin from "./pages/Superadmin";
import Leads from "./pages/Leads";
import Archive from "./pages/Archive";
import Settings from "./pages/Settings";
import Workers from "./pages/Workers";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
	const { tenant } = useParams();
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/superadmin" element={<Superadmin />} />
			<Route
				path="/"
				element={
					tenant ? (
						<Navigate to={`/${tenant}/dashboard`} />
					) : (
						<Navigate to={"login"} />
					)
				}
			/>
			<Route path="/:tenant" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="leads" element={<Leads />} />
				<Route path="archive/:category" element={<Archive />} />
				<Route path="groups" element={<Groups />} />
				<Route path="groups/:id" element={<GroupInfo />} />
				<Route path="students" element={<Students />} />
				<Route path="students/:id" element={<StudentDetail />} />
				<Route path="teachers" element={<Teachers />} />
				<Route path="teachers/:id" element={<TeacherDetail />} />
				<Route path="settings" element={<Settings />} />
				<Route path="payments" element={<Payments />} />
				<Route path="payments/:category" element={<Payments />} />
				<Route path="workers" element={<Workers />} />
				<Route path="profile" element={<Profile />} />
			</Route>
		</Routes>
	);
}
