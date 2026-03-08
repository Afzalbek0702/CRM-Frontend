import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes, FaChevronLeft } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../services/student/useStudent";
import { useGroups } from "../services/group/useGroups";
import { useTeachers } from "../services/teacher/useTeachers";
import { useLeads } from "../services/lead/useLeads";
import { useAuth } from "../context/authContext";

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
	const { tenant } = useParams()
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
		<header className="app-header">
			<div className="header-left">
				<button
					className="header-toggle-button"
					onClick={onToggle}
					aria-label="Toggle sidebar"
					title={isExpanded ? "Yopish" : "Ochish"}
				>
					<FaChevronLeft
						style={{
							transform:
								isExpanded || mobileOpen ? "rotate(0deg)" : "rotate(180deg)",
							transition: "transform 0.28s ease",
						}}
					/>
				</button>
				<h5 className="header-logo">
					<img src="/logo.jpg" alt="Logo" width={21} height={21} />
					Data space CRM
				</h5>
			</div>

			{
				user?.role === "CEO" &&
				<div className="header-search" ref={searchRef}>
					<div className="search-input-wrapper">
						<FaSearch className="search-icon" />
						<input
							type="text"
							placeholder="Qidirish..."
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							className="search-input"
						/>
						{searchTerm && (
							<button
								className="search-clear"
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
							>
								<FaTimes />
							</button>
						)}
					</div>

					{isSearchOpen && totalResults > 0 && (
						<div className="search-results">
							{searchResults.students.length > 0 && (
								<div className="search-results-group">
									<div className="search-results-title">O'quvchilar</div>
									{searchResults.students.map((student) => (
										<button
											key={`student-${student.id}`}
											className="search-result-item"
											onClick={() => handleResultClick("student", student)}
										>
											<span className="result-icon">👤</span>
											<span>{student.full_name}</span>
										</button>
									))}
								</div>
							)}

							{searchResults.groups.length > 0 && (
								<div className="search-results-group">
									<div className="search-results-title">Guruhlar</div>
									{searchResults.groups.map((group) => (
										<button
											key={`group-${group.id}`}
											className="search-result-item"
											onClick={() => handleResultClick("group", group)}
										>
											<span className="result-icon">👥</span>
											<span>{group.name}</span>
										</button>
									))}
								</div>
							)}

							{searchResults.teachers.length > 0 && (
								<div className="search-results-group">
									<div className="search-results-title">O'qituvchilar</div>
									{searchResults.teachers.map((teacher) => (
										<button
											key={`teacher-${teacher.id}`}
											className="search-result-item"
											onClick={() => handleResultClick("teacher", teacher)}
										>
											<span className="result-icon">🎓</span>
											<span>{teacher.full_name}</span>
										</button>
									))}
								</div>
							)}

							{searchResults.leads.length > 0 && (
								<div className="search-results-group">
									<div className="search-results-title">Lidlar</div>
									{searchResults.leads.map((lead) => (
										<button
											key={`lead-${lead.id}`}
											className="search-result-item"
											onClick={() => handleResultClick("lead", lead)}
										>
											<span className="result-icon">📞</span>
											<span>{lead.full_name}</span>
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			}

			<div className="header-right">
				<NavLink to={`/${tenant}/profile`}>
					<img src="/logo.jpg" alt="Profile" width={30} height={30} />
				</NavLink>
			</div>
		</header>
	);
}
