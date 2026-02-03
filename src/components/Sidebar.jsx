import { NavLink } from "react-router-dom";
import {
	FaTachometerAlt,
	FaUsers, 
	FaUserGraduate, 
	FaChalkboardTeacher, 
	FaMoneyBillWave, 
	FaTimes,
} from "react-icons/fa";

export default function Sidebar({ isOpen = true, onClose = () => {} }) {
	const handleNavClick = () => {
		if (window.innerWidth <= 768) {
			onClose();
		}
	};

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
				<FaUsers className="sidebar-icon"/> Groups
			</NavLink>
			<NavLink to="/students">
				<FaUserGraduate className="sidebar-icon"/> Students
			</NavLink>
			<NavLink to="/teachers">
				<FaChalkboardTeacher className="sidebar-icon"/> Teachers
			</NavLink>
			<NavLink to="/payments">
				<FaMoneyBillWave className="sidebar-icon"/> Payments
			</NavLink>
		</aside>
	);
}
