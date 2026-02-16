import { NavLink, useLocation } from "react-router-dom";
import {
	FaTachometerAlt,
	FaUsers,
	FaUserGraduate,
	FaChalkboardTeacher,
	FaMoneyBillWave,
	FaThList,
	FaArchive,
	FaWallet,
	FaChevronRight,
	FaChevronLeft,
} from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Sidebar({ isExpanded = true, onToggle = () => { } }) {
	const location = useLocation();
	const [archiveOpen, setArchiveOpen] = useState(false);
	const [paymentsOpen, setPaymentsOpen] = useState(false);

	useEffect(() => {
		if (location.pathname.startsWith("/archive")) {
			setArchiveOpen(true);
		}
	}, [location.pathname]);

	return (
		<aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
			<div className="sidebar-header">
				<button
					className="sidebar-toggle-button"
					onClick={onToggle}
					aria-label="Toggle sidebar"
					title={isExpanded ? "Yopish" : "Ochish"}>
					<FaChevronLeft
						style={{
							transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
							transition: "transform 0.3s ease"
						}} />
					{isExpanded && <span>Yopish</span>}
				</button>
			</div>

			<nav className="sidebar-nav">
				<NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
					<FaTachometerAlt className="sidebar-icon" />
					{isExpanded && <span>Dashboard</span>}
				</NavLink>
				<NavLink to="/leads" className={({ isActive }) => isActive ? 'active' : ''}>
					<FaThList className="sidebar-icon" />
					{isExpanded && <span>Lidlar</span>}
				</NavLink>
				<NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}>
					<FaUsers className="sidebar-icon" />
					{isExpanded && <span>Groups</span>}
				</NavLink>
				<NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
					<FaUserGraduate className="sidebar-icon" />
					{isExpanded && <span>Students</span>}
				</NavLink>
				<NavLink to="/teachers" className={({ isActive }) => isActive ? 'active' : ''}>
					<FaChalkboardTeacher className="sidebar-icon" />
					{isExpanded && <span>Teachers</span>}
				</NavLink>

				<div className="sidebar-parent">
					<button
						className={`sidebar-link-parent ${paymentsOpen ? 'open' : ''}`}
						onClick={() => setPaymentsOpen(!paymentsOpen)}
						title={isExpanded ? "" : "Moliya"}
					>
						<FaWallet className="sidebar-icon" />
						{isExpanded && (
							<>
								<span>Moliya</span>
								<span className={`arrow ${paymentsOpen ? "open" : ""}`}>▾</span>
							</>
						)}
					</button>

					{paymentsOpen && (
						<div className="sidebar-submenu">
							<NavLink to="/payments/income">
								To'lovlar
							</NavLink>
							<NavLink to="/payments/salary">
								Ish haqi
							</NavLink>
							<NavLink to="/payments/debtors">
								Qarzdorlar
							</NavLink>
							<NavLink to="/payments/expenses">
								Xarajatlar
							</NavLink>
						</div>
					)}
				</div>

				<div className="sidebar-parent">
					<button
						className={`sidebar-link-parent ${archiveOpen ? 'open' : ''}`}
						onClick={() => setArchiveOpen(!archiveOpen)}
						title={isExpanded ? "" : "Archive"}
					>
						<FaArchive className="sidebar-icon" />
						{isExpanded && (
							<>
								<span>Archive</span>
								<span className={`arrow ${archiveOpen ? "open" : ""}`}>▾</span>
							</>
						)}
					</button>

					{archiveOpen && (
						<div className="sidebar-submenu">
							<NavLink to="/archive/leads">
								Lidlar
							</NavLink>
							<NavLink to="/archive/students">
								Talabalar
							</NavLink>
							<NavLink to="/archive/teachers">
								O'qituvchilar
							</NavLink>
							<NavLink to="/archive/groups">
								Guruhlar
							</NavLink>
							<NavLink to="/archive/payments">
								Moliya
							</NavLink>
						</div>
					)}
				</div>
			</nav>
		</aside>
	);
}
