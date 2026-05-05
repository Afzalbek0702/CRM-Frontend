import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Layout from "./Layout";

import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupInfo from "./pages/GroupInfo";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import TeacherDetail from "./pages/WorkerDetail";
import Payments from "./pages/Payment/Payments";
import Login from "./pages/Login";
import Superadmin from "./pages/Superadmin";
import Leads from "./pages/Leads";
import Archive from "./pages/Archive/Archive";
import Settings from "./pages/Settings";
import Workers from "./pages/Workers";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";
import SuperadminLayout from "./pages/SuperadminLayout";
import TenantList from "./pages/TenantList";

export default function App() {
	const { tenant } = useParams();

	return (
		<Routes>
			{/* 1. Login har doim ochiq */}
			<Route path="/login" element={<Login />} />

			{/* 2. Superadmin paneli - Barcha qat'iy route-lar tepada bo'lishi kerak */}
			<Route path="/superadmin" element={<TenantList />}>
				{/* <Route index element={<DashboardHome />} /> */}
				{/* <Route path="tenants" element={<TenantList />} /> */}
				{/* <Route path="tenants/create" element={<Superadmin />} /> */}
				{/* MANA BU YERDA SETTINGS ROUTE-NI QO'SHISH KERAK */}
				{/* <Route path="settings" element={<SuperadminSettings />} />
				<Route path="users" element={<SuperadminUsers />} /> */}
			</Route>

			{/* 3. Asosiy sahifa logikasi */}
			<Route
				path="/"
				element={
					tenant ? (
						<Navigate to={`/${tenant}/dashboard`} replace />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>

			{/* 4. Dinamik Tenant Route - BU ENG OXIRIDA BO'LISHI SHART */}
			<Route
				path="/:tenant"
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}
			>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="leads" element={<Leads />} />
				<Route path="archive/:category" element={<Archive />} />
				<Route path="groups" element={<Groups />} />
				<Route path="groups/:id" element={<GroupInfo />} />
				<Route path="students" element={<Students />} />
				<Route path="students/:id" element={<StudentDetail />} />
				<Route path="workers/:id" element={<TeacherDetail />} />
				<Route path="settings" element={<Settings />} />
				<Route path="payments" element={<Payments />} />
				<Route path="payments/:category" element={<Payments />} />
				<Route path="workers" element={<Workers />} />
				<Route path="profile" element={<Profile />} />
				<Route path="notauthorized" element={<NotAuthorized />} />
			</Route>

			{/* 5. 404 sahifasi (ixtiyoriy) */}
			{/* <Route path="*" element={<NotFound />} /> */}
		</Routes>
	);
}
