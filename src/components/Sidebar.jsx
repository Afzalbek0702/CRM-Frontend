import { NavLink } from "react-router-dom";
import {
	FaTachometerAlt, // Dashboard
	FaUsers, // Groups
	FaUserGraduate, // Students
	FaChalkboardTeacher, // Teachers
	FaMoneyBillWave, // Payments
	FaSignOutAlt, // Sign Out
} from "react-icons/fa";

export default function Sidebar() {
	return (
		<aside className="sidebar">
			<div className="logo">
				<img src="/logo.jpg" alt="" className="logo-img" />
				<h2>Data Space</h2>
			</div>
			<NavLink to="/dashboard">
				<FaTachometerAlt className="sidebar-icon"/> Dashboard
			</NavLink>
			<NavLink to="/groups">
				<FaUsers className="sidebar-icon"/> Guruhlar
			</NavLink>
			<NavLink to="/students">
				<FaUserGraduate className="sidebar-icon"/> O'quvchilar
			</NavLink>
			<NavLink to="/teachers">
				<FaChalkboardTeacher className="sidebar-icon"/> O'qituvchilar
			</NavLink>
			<NavLink to="/payments">
				<FaMoneyBillWave className="sidebar-icon"/> To'lovlar
			</NavLink>
		</aside>
	);
}
