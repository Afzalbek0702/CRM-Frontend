import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Modal from "../components/GroupModal";
import { useGroups } from "../services/group/useGroups.js";
import { useStudent } from "../services/student/useStudent.js";
import { useAuth } from "@/context/authContext";
// shadcn UI
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Icons
import {
	FaUsers,
	FaSearch,
	FaEdit,
	FaTrash,
	FaMoneyBillWave,
} from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import {
	ArrowLeft,
	Plus,
	BookOpen,
	Banknote,
	Clock,
	GraduationCap,
	Presentation,
	CalendarRange,
	MoreHorizontal,
	Check,
	TrendingUp,
	Filter,
	ExternalLink,
} from "lucide-react";
import { getUzDays } from "@/utils/weekday";


// 🎨 Stats Card Component
const StatsCard = ({ icon, label, value, trend, color }) => {
	const colors = {
		amber:
			"from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
		blue: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
		emerald:
			"from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
		purple:
			"from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
	};

	return (
		<Card
			className={`bg-linear-to-br ${colors[color]} border backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300`}
		>
			<CardContent className="p-4 flex items-center gap-4">
				<div
					className={`p-3 rounded-xl bg-white/10 border border-white/20 ${colors[color].split(" ").pop()}`}
				>
					{icon}
				</div>
				<div>
					<p className="text-xs text-gray-400 uppercase tracking-wider">
						{label}
					</p>
					<p className="text-2xl font-bold text-white">{value}</p>
					{trend && (
						<p
							className={`text-xs flex items-center gap-1 ${trend > 0 ? "text-emerald-400" : "text-red-400"}`}
						>
							<TrendingUp
								className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`}
							/>
							{Math.abs(trend)}%
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

const DayPill = ({ day, isToday = false }) => (
	<span
		className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200
			${
				isToday
					? "bg-linear-to-r from-amber-400 to-orange-400 text-black shadow-lg shadow-amber-500/25"
					: "bg-white/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20"
			}`}
	>
		{day}
	</span>
);

export default function Groups() {
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { groups, loading, createGroup, deleteGroup, updateGroup,isCreating,isUpdating } =
		useGroups();
	const { students } = useStudent();
	const { user } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteId, setDeleteId] = useState(null);
	const [modal, setModal] = useState({ open: false, edit: false, data: null });
	const [copiedId, setCopiedId] = useState(null);

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!groups) return { total: 0, totalStudents: 0, avgPrice: 0 };
		const totalStudents =students.filter((s) => s.groups || s.group_id).length
			
		const avgPrice = groups.length
			? Math.round(
					groups.reduce((acc, g) => acc + (g.price || 0), 0) / groups.length,
				)
			: 0;
		return {
			total: groups.length,
			totalStudents,
			avgPrice,
		};
	}, [groups]);

	// Studentlar sonini hisoblashni optimallashtirish
	const groupsWithCount = useMemo(() => {
		const countMap = students.reduce((acc, s) => {
			const gIds = Array.isArray(s.groups) ? s.groups : [s.groups];
			gIds.forEach((g) => {
				const id = g?.id ?? g;
				if (id != null) acc[id] = (acc[id] || 0) + 1;
			});
			return acc;
		}, {});

		return groups.map((g) => ({ ...g, studentCount: countMap[g.id] || 0 }));
	}, [groups, students]);

	// Qidiruvni optimallashtirish
	const filteredGroups = useMemo(() => {
		return groupsWithCount.filter(
			(g) =>
				g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				g.course_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				g.teachers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [groupsWithCount, searchTerm]);

	const handleSubmit = async (formData) => {
		try {
			if (modal.edit) {
				await updateGroup({ id: modal.data.id, data: formData });
			} else {
				await createGroup(formData);
			}
			setModal({ open: false, edit: false, data: null });
		} catch (error) {
			console.error("Mutation error:", error);
		}
	};

	const handleConfirmDelete = () => {
		if (deleteId) {
			deleteGroup(deleteId);
			setDeleteId(null);
		}
	};

	const handleCopyId = async (id) => {
		await navigator.clipboard.writeText(String(id));
		setCopiedId(id);
		toast.success("ID nusxalandi!");
		setTimeout(() => setCopiedId(null), 2000);
	};

	const getTeacherInitials = (name) => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	const getCourseColor = (type) => {
		const colors = {
			Frontend: "bg-sky-500/20 text-sky-400 border-sky-500/30",
			Backend: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
			IT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
			"Computer Science": "bg-amber-500/20 text-amber-400 border-amber-500/30",
		};
		return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
	};

	if (loading) return <Loader />;

	return (
		<div className="relative min-h-99 bg-background">
			<div className="container mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* 🧭 Header Section */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<Button
							onClick={() => navigate(-1)}
							variant="ghost"
							className="group text-gray-400 hover:text-white hover:bg-white/10 transition-all"
						>
							<ArrowLeft className="group-hover:-translate-x-1 transition-transform h-4 w-4" />
							<span className="ml-2 hidden sm:inline">Ortga</span>
						</Button>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
								Guruhlar boshqaruvi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Barcha o'quv guruhlarini kuzatib boring
							</p>
						</div>
					</div>

					{user.role === "CEO" || "MANAGER" ? (
						<Button
							onClick={() => setModal({ open: true, edit: false, data: null })}
							className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2 font-semibold"
						>
							<Plus className="h-4 w-4" /> Yangi guruh qo'shish
						</Button>
					) : null}
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<StatsCard
						icon={<FaUsers className="w-5 h-5" />}
						label="Jami guruhlar"
						value={stats.total}
						color="amber"
					/>
					<StatsCard
						icon={<GraduationCap className="w-5 h-5" />}
						label="Jami o'quvchilar"
						value={stats.totalStudents}
						// trend={8}
						color="emerald"
					/>
					<StatsCard
						icon={<FaMoneyBillWave className="w-5 h-5" />}
						label="O'rtacha narx"
						value={`${(stats.avgPrice / 1000).toLocaleString()}k so'm`}
						color="blue"
					/>
				</div>

				{/* 🔍 Search & Filters */}
				<Card className="bg-card/80 border-white/10 backdrop-blur-xl">
					<CardContent className="p-4">
						<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
							<InputGroup className="max-w-md focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400/50 transition-all">
								<InputGroupInput
									placeholder="Guruh, kurs yoki o'qituvchi bo'yicha qidirish..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="bg-transparent text-white placeholder:text-gray-500 border-0 focus:ring-0"
								/>
								<InputGroupAddon className="text-gray-500">
									<FaSearch />
								</InputGroupAddon>
							</InputGroup>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									className="border-white/20 text-gray-400 hover:bg-white/10"
								>
									<Filter className="mr-2 h-4 w-4" /> Filtrlar
								</Button>
								<Badge
									variant="outline"
									className="border-white/20 text-gray-400"
								>
									{filteredGroups.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Groups Table */}
				<Card className="bg-card/80 backdrop-blur-xl overflow-hidden py-0">
					<Table>
						<TableHeader>
							<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<BookOpen className="h-4 w-4" /> Guruh nomi
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<Banknote className="h-4 w-4" /> Narx
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4" /> Dars vaqti
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<GraduationCap className="h-4 w-4" /> Kurs turi
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<Presentation className="h-4 w-4" /> O'qituvchi
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<CalendarRange className="h-4 w-4" /> Kunlar
									</div>
								</TableHead>
								<TableHead className="text-gray-400 text-right w-20">
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredGroups.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="py-16">
										<EmptyState
											onAddNew={() =>
												setModal({ open: true, edit: false, data: null })
											}
											hasSearch={!!searchTerm}
										/>
									</TableCell>
								</TableRow>
							) : (
								filteredGroups.map((g) => {
									const today = new Date().toLocaleDateString("uz-UZ", {
										weekday: "short",
									});
									const uzToday = getUzDays(today);

									return (
										<TableRow
											key={g.id}
											className="border-white/5 hover:bg-amber-400/5 transition-all duration-200 group/row cursor-pointer"
											onClick={() => navigate(`/${tenant}/groups/${g.id}`)}
										>
											<TableCell className="font-medium text-white">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-400/20 to-orange-400/20 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
														{g.name?.charAt(0).toUpperCase()}
													</div>
													<div className="min-w-0">
														<p className="truncate max-w-32">{g.name}</p>
														<div className="flex items-center gap-2 mt-1">
															<Badge
																variant="outline"
																className="text-[10px] border-amber-400/30 text-amber-400 bg-amber-400/10"
															>
																<FaUsers className="w-3 h-3 mr-1" />{" "}
																{g.studentCount}
															</Badge>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleCopyId(g.id);
																}}
																className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-amber-400 transition-colors"
															>
																{copiedId === g.id ? (
																	<Check className="w-3 h-3" />
																) : (
																	<span className="font-mono">
																		#{String(g.id).slice(-4)}
																	</span>
																)}
															</button>
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="font-semibold text-amber-400">
												{g.price
													? `${(Number(g.price) / 1000).toLocaleString()}k`
													: "0"}{" "}
												so'm
											</TableCell>
											<TableCell className="text-gray-300">
												<div className="flex items-center gap-1.5">
													<Clock className="w-4 h-4 text-gray-500" />
													{g.lesson_time}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={`border ${getCourseColor(g.course_type)}`}
												>
													{g.course_type}
												</Badge>
											</TableCell>
											<TableCell>
												{g.teachers?.full_name ? (
													<div className="flex items-center gap-2">
														<Avatar className="w-7 h-7 border border-white/10">
															<AvatarFallback className="text-xs bg-linear-to-br from-amber-400/20 to-orange-400/20 text-amber-400">
																{getTeacherInitials(g.teachers.full_name)}
															</AvatarFallback>
														</Avatar>
														<span className="text-gray-300 text-sm truncate max-w-24">
															{g.teachers.full_name}
														</span>
													</div>
												) : (
													<span className="text-gray-500 text-sm">—</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{getUzDays(g.lesson_days).map((day, idx) => (
														<DayPill
															key={idx}
															day={day}
															isToday={day === uzToday}
														/>
													))}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors opacity-0 group-hover/row:opacity-100"
															onClick={(e) => e.stopPropagation()}
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="bg-[#1f1f1f] border-white/10 text-white w-48"
													>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																setModal({ open: true, edit: true, data: g });
															}}
															className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
														>
															<FaEdit className="mr-2 text-blue-400" />{" "}
															Tahrirlash
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																navigate(`/${tenant}/groups/${g.id}`);
															}}
															className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
														>
															<ExternalLink className="mr-2 h-4 w-4 text-purple-400" />{" "}
															Batafsil
														</DropdownMenuItem>
														<DropdownMenuSeparator className="bg-white/10" />
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																setDeleteId(g.id);
															}}
															className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
														>
															<FaTrash className="mr-2" /> O'chirish
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</Card>

				{/* 📄 Footer Info */}
				{filteredGroups.length > 0 && (
					<div className="flex items-center justify-between text-sm text-gray-500">
						<p>
							{filteredGroups.length} guruh ko'rsatilmoqda • Jami{" "}
							{stats.totalStudents} o'quvchi
						</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled
								className="border-white/10 text-gray-600"
							>
								Oldingi
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled
								className="border-white/10 text-gray-600"
							>
								Keyingi
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* 🎭 Modals */}
			<Modal
				isOpen={modal.open}
				onClose={() => setModal({ open: false, edit: false, data: null })}
				onSubmit={handleSubmit}
				title={modal.edit ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
            initialData={modal.data}
            isLoading={isCreating || isUpdating}
			/>

			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="Guruhni o'chirish"
				description="Haqiqatdan ham ushbu guruhni o'chirib tashlamoqchimisiz? Barcha bog'liq ma'lumotlar ham o'chiriladi."
			/>
		</div>
	);
}

// 🧩 Empty State Component
const EmptyState = ({ onAddNew, hasSearch }) => (
	<div className="flex flex-col items-center justify-center text-center py-8 px-4">
		<div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
			{hasSearch ? (
				<FaSearch className="w-8 h-8" />
			) : (
				<FaUsers className="w-8 h-8" />
			)}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "Guruhlar yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday guruh mavjud emas. Birinchi guruhni yaratishni boshlang!"}
		</p>
		{!hasSearch && (
			<Button
				onClick={onAddNew}
				className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2"
			>
				<Plus className="w-4 h-4" /> Birinchi guruhni yaratish
			</Button>
		)}
	</div>
);
