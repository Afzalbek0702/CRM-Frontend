import { NavLink, useLocation, useParams } from "react-router-dom";
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
	FaCog
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function Sidebar({ isExpanded = true, onToggle = () => { }, mobileOpen = false, onClose = () => { } }) {
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
   const {tenant} = useParams()
	return (
		<aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${mobileOpen ? 'mobile-open open' : ''}`}>
			<nav className="sidebar-nav">
            <NavLink to={`/${tenant}/dashboard`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
					<FaTachometerAlt className="sidebar-icon" />
					{isExpanded && <span>Asosiy panel</span>}
				</NavLink>
				<NavLink to={`/${tenant}/leads`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
					<FaThList className="sidebar-icon" />
					{isExpanded && <span>Lidlar</span>}
				</NavLink>
				<NavLink to={`/${tenant}/groups`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
					<FaUsers className="sidebar-icon" />
					{isExpanded && <span>Guruhlar</span>}
				</NavLink>
				<NavLink to={`/${tenant}/students`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
					<FaUserGraduate className="sidebar-icon" />
					{isExpanded && <span>O'quvchilar</span>}
				</NavLink>
				<NavLink to={`/${tenant}/teachers`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
					<FaChalkboardTeacher className="sidebar-icon" />
					{isExpanded && <span>O'qituvchilar</span>}
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
							<NavLink to={`/${tenant}/payments/income`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								To'lovlar
							</NavLink>
							<NavLink to={`/${tenant}/payments/salary`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								Ish haqi
							</NavLink>
							<NavLink to={`/${tenant}/payments/debtors`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								Qarzdorlar
							</NavLink>
							<NavLink to={`/${tenant}/payments/expenses`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
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
								<span>Arxiv</span>
								<span className={`arrow ${archiveOpen ? "open" : ""}`}>▾</span>
							</>
						)}
					</button>

					{((isExpanded && archiveOpen) || (!isExpanded && hoveredMenu === 'archive')) && (
						<div className={`sidebar-submenu ${!isExpanded ? 'collapsed-hover-submenu' : ''}`}>
							<NavLink to={`/${tenant}/archive/leads`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								Lidlar
							</NavLink>
							<NavLink to={`/${tenant}/archive/students`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								Talabalar
							</NavLink>
							<NavLink to={`/${tenant}/archive/teachers`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								O'qituvchilar
							</NavLink>
							<NavLink to={`/${tenant}/archive/groups`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								Guruhlar
							</NavLink>
							<NavLink to={`/${tenant}/archive/payments`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
								Moliya
							</NavLink>
						</div>
					)}
				</div>

				<NavLink to={`/${tenant}/settings`} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => { if (mobileOpen) onClose(); }}>
					<FaCog className="sidebar-icon" />
					{isExpanded && <span>Sozlamalar</span>}
				</NavLink>
			</nav>
		</aside>
	);
}
