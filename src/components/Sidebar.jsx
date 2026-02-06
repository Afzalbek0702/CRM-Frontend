import { NavLink } from "react-router-dom";
import {
	FaTachometerAlt,
	FaUsers,
	FaUserGraduate,
	FaChalkboardTeacher,
	FaMoneyBillWave,
	FaTimes,
	FaThList,
   FaArchive,
} from "react-icons/fa";
export default function Sidebar({ isOpen = true, onClose = () => { } }) {
	const handleNavClick = () => {
		if (window.innerWidth <= 768) {
			onClose();
		}
	};




	return (
		<aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
			<div className="sidebar-header">
				<NavLink to="/dashboard" id="logo_a_href">
					<div className="logo">
						<img src="/logo.jpg" alt="" className="logo-img" />
						<h2>Data Space</h2>
					</div>
				</NavLink>
				<button
					className="sidebar-close-button"
					onClick={onClose}
					aria-label="Close sidebar"
				>
					<FaTimes />
				</button>
			</div>
			<NavLink to="/dashboard">
				<FaTachometerAlt className="sidebar-icon" /> Dashboard
			</NavLink>
			<NavLink to="/leads">
				<FaThList className="sidebar-icon" /> Lidlar
			</NavLink>
			<NavLink to="/groups">
				<FaUsers className="sidebar-icon" /> Groups
			</NavLink>
			<NavLink to="/students">
				<FaUserGraduate className="sidebar-icon" /> Students
			</NavLink>
			<NavLink to="/teachers">
				<FaChalkboardTeacher className="sidebar-icon" /> Teachers
			</NavLink>
			<NavLink to="/payments">
				<FaMoneyBillWave className="sidebar-icon" /> Payments
			</NavLink>
			<NavLink to="/archive">
				<FaArchive className="sidebar-icon" /> Archive
			</NavLink>
		</aside>
	);
}
