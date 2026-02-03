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
		<aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
			<div className="sidebar-header">
				<div className="logo">
					<img src="/logo.jpg" alt="" className="logo-img" />
					<h2>Data Space</h2>
				</div>
				<button
					className="sidebar-close-button"
					onClick={onClose}
					aria-label="Close sidebar"
				>
					<FaTimes />
				</button>
			</div>
			<nav className="sidebar-nav">
				<NavLink to="/dashboard" onClick={handleNavClick}>
					<FaTachometerAlt className="sidebar-icon" /> Dashboard
				</NavLink>
				<NavLink to="/groups" onClick={handleNavClick}>
					<FaUsers className="sidebar-icon" /> Groups
				</NavLink>
				<NavLink to="/students" onClick={handleNavClick}>
					<FaUserGraduate className="sidebar-icon" /> Students
				</NavLink>
				<NavLink to="/teachers" onClick={handleNavClick}>
					<FaChalkboardTeacher className="sidebar-icon" /> Teachers
				</NavLink>
				<NavLink to="/payments" onClick={handleNavClick}>
					<FaMoneyBillWave className="sidebar-icon" /> Payments
				</NavLink>
			</nav>
		</aside>
	);
}
