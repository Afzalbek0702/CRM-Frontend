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
import { useState, useEffect, useRef } from "react";

export default function Sidebar({ isExpanded = true, onToggle = () => { }, mobileOpen = false, onClose = () => {} }) {
	const location = useLocation();
	const [archiveOpen, setArchiveOpen] = useState(false);
	const [paymentsOpen, setPaymentsOpen] = useState(false);
	const [hoveredMenu, setHoveredMenu] = useState(null);
	const hoverTimeoutRef = useRef(null);

	useEffect(() => {
		if (location.pathname.startsWith("/archive")) {
			setArchiveOpen(true);
		}
	}, [location.pathname]);

	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	const handleMouseEnter = (menuName) => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		setHoveredMenu(menuName);
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setHoveredMenu(null);
		}, 100); 
	};

	return (
		<aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${mobileOpen ? 'mobile-open open' : ''}`}>
			<div className="sidebar-header">
				<h5><img src="../public/logo.jpg" alt="" width={21} height={21} /> Data space CRM</h5>
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

			<div 
				className="sidebar-parent"
				onMouseEnter={() => !isExpanded && handleMouseEnter('payments')}
				onMouseLeave={() => !isExpanded && handleMouseLeave()}
			>
				<button
					className={`sidebar-link-parent ${paymentsOpen ? 'open' : ''}`}
					onClick={() => {
						if (isExpanded) {
							setPaymentsOpen(!paymentsOpen);
							setHoveredMenu(null);
						}
					}}
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

				{((isExpanded && paymentsOpen) || (!isExpanded && hoveredMenu === 'payments')) && (
					<div className={`sidebar-submenu ${!isExpanded ? 'collapsed-hover-submenu' : ''}`}>
						<NavLink to="/payments/income" className={({ isActive }) => isActive ? 'active' : ''}>
							To'lovlar
						</NavLink>
						<NavLink to="/payments/salary" className={({ isActive }) => isActive ? 'active' : ''}>
							Ish haqi
						</NavLink>
						<NavLink to="/payments/debtors" className={({ isActive }) => isActive ? 'active' : ''}>
							Qarzdorlar
						</NavLink>
						<NavLink to="/payments/expenses" className={({ isActive }) => isActive ? 'active' : ''}>
							Xarajatlar
						</NavLink>
					</div>
				)}
			</div>

			<div 
				className="sidebar-parent"
				onMouseEnter={() => !isExpanded && handleMouseEnter('archive')}
				onMouseLeave={() => !isExpanded && handleMouseLeave()}
			>
				<button
					className={`sidebar-link-parent ${archiveOpen ? 'open' : ''}`}
					onClick={() => {
						if (isExpanded) {
							setArchiveOpen(!archiveOpen);
							setHoveredMenu(null);
						}
					}}
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

				{((isExpanded && archiveOpen) || (!isExpanded && hoveredMenu === 'archive')) && (
					<div className={`sidebar-submenu ${!isExpanded ? 'collapsed-hover-submenu' : ''}`}>
						<NavLink to="/archive/leads" className={({ isActive }) => isActive ? 'active' : ''}>
							Lidlar
						</NavLink>
						<NavLink to="/archive/students" className={({ isActive }) => isActive ? 'active' : ''}>
							Talabalar
						</NavLink>
						<NavLink to="/archive/teachers" className={({ isActive }) => isActive ? 'active' : ''}>
							O'qituvchilar
						</NavLink>
						<NavLink to="/archive/groups" className={({ isActive }) => isActive ? 'active' : ''}>
							Guruhlar
						</NavLink>
						<NavLink to="/archive/payments" className={({ isActive }) => isActive ? 'active' : ''}>
							Moliya
						</NavLink>
					</div>
				)}
			</div>
			</nav>
		</aside>
	);
}
