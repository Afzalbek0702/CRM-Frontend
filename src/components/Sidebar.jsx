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
import { useAuth } from "../context/authContext";
import { filterSidebarByRole } from "../helpers/filterSidebarByRole";
import { sidebarConfig } from "../helpers/sidebarConfig";

export default function Sidebar({ isExpanded = true, onToggle = () => { }, mobileOpen = false, onClose = () => { } }) {
	const location = useLocation();
	const [archiveOpen, setArchiveOpen] = useState(false);
	const [paymentsOpen, setPaymentsOpen] = useState(false);
	const [hoveredMenu, setHoveredMenu] = useState(null);
	const [openMenus, setOpenMenus] = useState({
		payments: false,
		archive: false,
	});
	const hoverTimeoutRef = useRef(null);
	const { user } = useAuth();


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
	
	const toggleParent = (menuKey) => {
		setOpenMenus((prev) => ({
			...prev,
			[menuKey]: !prev[menuKey],
		}));
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setHoveredMenu(null);
		}, 100);
	};
	const { tenant } = useParams()
	const filteredSidebar = filterSidebarByRole(sidebarConfig, user?.role);
	return (
		<aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${mobileOpen ? "mobile-open open" : ""}`}>
			<nav className="sidebar-nav">
				{filteredSidebar.map((item) => {
					const Icon = item.icon;
					if (!item.children) {

						return (
							<NavLink
								key={item.path}
								to={`/${tenant}/${item.path}`}
								className={({ isActive }) => (isActive ? "active" : "")}
								onClick={() => { if (mobileOpen) onClose(); }}
							>
								<Icon className="sidebar-icon" />
								{isExpanded && <span>{item.label}</span>}
							</NavLink>
						);
					}

					const isOpen = openMenus[item.label] || false;
					const isHovered = hoveredMenu === item.label;

					return (
						<div
							key={item.label}
							className="sidebar-parent"
							onMouseEnter={() => !isExpanded && handleMouseEnter(item.label)}
							onMouseLeave={() => !isExpanded && handleMouseLeave()}
						>
							<button
								className={`sidebar-link-parent ${isOpen ? "open" : ""}`}
								onClick={() => {
									if (isExpanded) toggleParent(item.label);
									setHoveredMenu(null);
								}}
								title={isExpanded ? "" : item.label}
							>
								<Icon className="sidebar-icon" />
								{isExpanded && (
									<>
										<span>{item.label}</span>
										<span className={`arrow ${isOpen ? "open" : ""}`}>▾</span>
									</>
								)}
							</button>

							{((isExpanded && isOpen) || (!isExpanded && isHovered)) && (
								<div className={`sidebar-submenu ${!isExpanded ? "collapsed-hover-submenu" : ""}`}>
									{item.children.map((child) => (
										<NavLink
											key={child.path}
											to={`/${tenant}/${child.path}`}
											className={({ isActive }) => (isActive ? "active" : "")}
											onClick={() => { if (mobileOpen) onClose(); }}
										>
											{child.label}
										</NavLink>
									))}
								</div>
							)}
						</div>
					);
				})}
			</nav>
		</aside>
	);
}
