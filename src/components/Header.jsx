import { useState, useRef, useEffect, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../services/student/useStudent";
import { useGroups } from "../services/group/useGroups";
import { useWorker } from "@/services/worker/useWorker";
import { useLeads } from "../services/lead/useLeads";
import { useAuth } from "../context/authContext";
import { SidebarTrigger } from "./ui/sidebar";
import { cn } from "@/lib/utils";

export default function Header() {
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const searchRef = useRef(null);
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { user } = useAuth();

	// Ma'lumotlarni olish
	const { students = [] } = useStudent();
	const { groups = [] } = useGroups();
	const { workerData = [] } = useWorker();
	const { leads = [] } = useLeads();

	// Click outside - qidiruv oynasini yopish
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (searchRef.current && !searchRef.current.contains(e.target)) {
				setIsSearchOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Qidiruv mantiqi (Optimallashgan)
	const searchResults = useMemo(() => {
		const query = searchTerm.toLowerCase().trim();
		if (!query) return { students: [], groups: [], workerData: [], leads: [] };

		return {
			students: students
				.filter((s) => s.full_name?.toLowerCase().includes(query))
				.slice(0, 5),
			groups: groups
				.filter((g) => g.name?.toLowerCase().includes(query))
				.slice(0, 5),
			workerData: workerData
				.filter((t) => t.full_name?.toLowerCase().includes(query))
				.slice(0, 5),
			leads: leads
				.filter((l) => l.full_name?.toLowerCase().includes(query))
				.slice(0, 5),
		};
	}, [searchTerm, students, groups, workerData, leads]);

	const totalResults = Object.values(searchResults).flat().length;

	const handleNavigate = (path) => {
		navigate(`/${tenant}${path}`);
		setSearchTerm("");
		setIsSearchOpen(false);
	};

	console.log(students);
	

	return (
		<header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between px-5 bg-background border-b border-border shadow-sm">
			<div className="flex items-center gap-4">
				<SidebarTrigger className="hover:bg-accent p-2 rounded-md transition-colors" />
				<div className="flex items-center gap-2">
					<img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-md" />
					<span className="hidden md:block font-bold text-lg tracking-tight capitalize">
						{tenant} CRM
					</span>
				</div>
			</div>

			{/* Search Section - Faqat CEO uchun */}
			{user?.role === "CEO" && (
				<div className="relative flex-1 max-w-lg mx-6" ref={searchRef}>
					<div
						className={cn(
							"flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all duration-200 bg-muted/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20",
							isSearchOpen ? "border-primary/50" : "border-transparent",
						)}
					>
						<FaSearch className="text-muted-foreground w-4 h-4" />
						<input
							type="text"
							placeholder="Tizim bo'ylab qidirish..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								if (e.target.value.trim()) setIsSearchOpen(true);
							}}
							className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
						/>
						{searchTerm && (
							<button
								onClick={() => {
									setSearchTerm("");
									setIsSearchOpen(false);
								}}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<FaTimes className="w-3.5 h-3.5" />
							</button>
						)}
					</div>

					{/* Result Dropdown */}
					{isSearchOpen && searchTerm.trim() && totalResults > 0 && (
						<div className="absolute top-12 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-popover shadow-xl animate-in fade-in zoom-in-95 duration-200">
							<ResultSection
								title="Lidlar"
								items={searchResults.leads}
								icon="🎯"
								onClick={(item) => handleNavigate(`/leads`)}
							/>
							<ResultSection
								title="O'quvchilar"
								items={searchResults.students}
								icon="👤"
								onClick={(item) => handleNavigate(`/students/${item.id}`)}
							/>
							<ResultSection
								title="Guruhlar"
								items={searchResults.groups}
								icon="👥"
								onClick={(item) => handleNavigate(`/groups/${item.id}`)}
							/>
							<ResultSection
								title="Xodimlar"
								items={searchResults.workerData}
								icon="👨‍🏫"
								onClick={(item) => handleNavigate(`/workers/${item.id}`)}
							/>
						</div>
					)}
				</div>
			)}

			{/* Right Actions */}
			<div className="flex items-center gap-4">
				<NavLink to={`/${tenant}/profile`} className="group">
					<div className="p-0.5 rounded-full border border-border group-hover:border-primary transition-colors">
						<img
							src="/logo.jpg"
							alt="Profile"
							className="w-8 h-8 rounded-full object-cover"
						/>
					</div>
				</NavLink>
			</div>
		</header>
	);
}

// Yordamchi komponent - Natijalar bo'limi uchun
function ResultSection({ title, items, icon, onClick }) {
	if (items.length === 0) return null;
	return (
		<div className="p-2 border-b border-border last:border-none">
			<div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
				{title}
			</div>
			{items.map((item) => (
				<button
					key={item.id}
					onClick={() => onClick(item)}
					className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left"
				>
					<span className="text-lg">{icon}</span>
					<div className="max-w-full w-full flex gap-2 justify-between ">
						<span className="truncate font-medium capitalize">
							{item.full_name || item.name}
						</span>

						<span className="truncate font-bold text-primary">
							{item.position ||
								item.course_type || (
									<span className="text-green-700">{item.groups.name}</span>
								) ||
								null}
						</span>
					</div>
				</button>
			))}
		</div>
	);
}
