import { NavLink, useLocation } from "react-router-dom";
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
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen = true, onClose = () => { } }) {
	const handleNavClick = () => {
		if (window.innerWidth <= 768) {
			onClose();
		}
	};

	const location = useLocation();
	const [archiveOpen, setArchiveOpen] = useState(false);

	useEffect(() => {
		if (location.pathname.startsWith("/archive")) {
			setArchiveOpen(true);
		}
	}, [location.pathname]);




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
			<div className="sidebar-parent">
				<button
					className="sidebar-link-parent"
					onClick={() => setArchiveOpen(!archiveOpen)}
				>
					<FaArchive className="sidebar-icon" />
					Archive
					<span className={`arrow ${archiveOpen ? "open" : ""}`}>▾</span>
				</button>

				{archiveOpen && (
					<div className="sidebar-submenu">
						<NavLink to="/archive/leads" onClick={handleNavClick}>
							Lidlar
						</NavLink>
						<NavLink to="/archive/students" onClick={handleNavClick}>
							Talabalar
						</NavLink>
						<NavLink to="/archive/teachers" onClick={handleNavClick}>
							O‘qituvchilar
						</NavLink>
						<NavLink to="/archive/groups" onClick={handleNavClick}>
							Guruhlar
						</NavLink>
						<NavLink to="/archive/payments" onClick={handleNavClick}>
							Moliya
						</NavLink>
					</div>
				)}
			</div>

		</aside>
	);
}
