import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes, FaChevronLeft } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../services/student/useStudent";
import { useGroups } from "../services/group/useGroups";
import { useTeachers } from "../services/teacher/useTeachers";
import { useLeads } from "../services/lead/useLeads";
import { useAuth } from "../context/authContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header({ isExpanded, onToggle, mobileOpen }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState({
		students: [],
		groups: [],
		teachers: [],
		leads: [],
	});
	const { user } = useAuth();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const searchRef = useRef(null);
	const navigate = useNavigate();
	const { students = [] } = useStudent();
	const { groups = [] } = useGroups();
	const { teachers = [] } = useTeachers();
	const { leads = [] } = useLeads();
	const { tenant } = useParams();
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsSearchOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = (value) => {
		setSearchTerm(value);

		if (value.trim() === "") {
			setSearchResults({
				students: [],
				groups: [],
				teachers: [],
				leads: [],
			});
			return;
		}

		const lowerValue = value.toLowerCase();

		const results = {
			students: (students || []).filter((s) =>
				s.full_name?.toLowerCase().includes(lowerValue),
			),
			groups: (groups || []).filter((g) =>
				g.name?.toLowerCase().includes(lowerValue),
			),
			teachers: (teachers || []).filter((t) =>
				t.full_name?.toLowerCase().includes(lowerValue),
			),
			leads: (leads || []).filter((l) =>
				l.full_name?.toLowerCase().includes(lowerValue),
			),
		};

		setSearchResults(results);
		setIsSearchOpen(true);
	};

	const handleResultClick = (type, item) => {
		switch (type) {
			case "student":
				navigate(`/${tenant}/students/${item.id}`);
				break;
			case "group":
				navigate(`/${tenant}/groups/${item.id}`);
				break;
			case "teacher":
				navigate(`/${tenant}/teachers/${item.id}`);
				break;
			case "lead":
				navigate(`/${tenant}/leads`);
				break;
			default:
				break;
		}
		setSearchTerm("");
		setSearchResults({
			students: [],
			groups: [],
			teachers: [],
			leads: [],
		});
		setIsSearchOpen(false);
	};

	const totalResults = Object.values(searchResults).reduce(
		(sum, arr) => sum + arr.length,
		0,
	);

	return (
		<header className="fixed top-0 left-0 z-50 flex h-17.5 w-full items-center justify-between bg-BgColor px-5">
			{/* LEFT */}
			<div className="flex items-center gap-3">
				{/* <Button
					onClick={onToggle}
					aria-label="Toggle sidebar"
					title={isExpanded ? "Yopish" : "Ochish"}
					className="flex h-9 w-9 items-center justify-center rounded-md"
				>
					<FaChevronLeft
						className={`transition-transform duration-300 ${
							isExpanded || mobileOpen ? "rotate-0" : "rotate-180"
						}`}
					/>
				</Button> */}
				<SidebarTrigger className="-ml-1" />
				<h5 className="flex items-center gap-2 font-semibold">
					<img src="/logo.jpg" alt="Logo" width={21} height={21} />
					Data space CRM
				</h5>
			</div>

			{/* SEARCH */}
			{user?.role === "CEO" && (
				<div className="relative flex-1 max-w-125 w-full my-5" ref={searchRef}>
					<div className="relative flex items-center gap-2.5 px-2 py-0.5 rounded-md border border-[#ffd00c33] bg-[#ffffff0d]">
						<FaSearch className="text-md text-gray-400 ml-4" />
						<input
							type="text"
							placeholder="Qidirish..."
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							className="h-9 w-full text-sm bg-none border-none outline-none"
						/>

						{searchTerm && (
							<button
								onClick={() => {
									setSearchTerm("");
									setSearchResults({
										students: [],
										groups: [],
										teachers: [],
										leads: [],
									});
									setIsSearchOpen(false);
								}}
								className="absolute right-3"
							>
								<FaTimes />
							</button>
						)}
					</div>

					{isSearchOpen && totalResults > 0 && (
						<div className="absolute max-h-105 top-12 left-0 right-0 overflow-y-auto rounded-lg border border-[#2c230e] bg-BgColor">
							{searchResults.students.length > 0 && (
								<div className="py-2 w-full">
									<div className="px-3 py-1 text-xs font-semibold text-(--primary-color)">
										O'quvchilar
									</div>

									{searchResults.students.map((student) => (
										<button
											key={`student-${student.id}`}
											onClick={() => handleResultClick("student", student)}
											className="flex w-full items-center gap-2 px-2.5 py-4 bg-[rgba(255, 208, 12, 0.1)]"
										>
											<span>👤</span>
											{student.full_name}
										</button>
									))}
								</div>
							)}

							{searchResults.groups.length > 0 && (
								<div className="py-2 w-full">
									<div className="px-3 py-1 text-xs font-semibold text-(--primary-color)">
										Guruhlar
									</div>

									{searchResults.groups.map((group) => (
										<button
											key={`group-${group.id}`}
											onClick={() => handleResultClick("group", group)}
											className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-(--hover-color) hover:text-(--primary-color)"
										>
											👥 {group.name}
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* RIGHT */}
			<div className="flex items-center">
				<NavLink to={`/${tenant}/profile`}>
					<img
						src="/logo.jpg"
						alt="Profile"
						width={30}
						height={30}
						className="rounded-full"
					/>
				</NavLink>
			</div>
		</header>
	);
}
