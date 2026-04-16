import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";
// Shadcn UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Ikonkalar
import {
	Search,
	Plus,
	ArrowLeft,
	Phone,
	Calendar,
	Check,
	ChevronsUpDown,
	GraduationCap,
	Users,
	Settings,
	Copy,
	ExternalLink,
	Sparkles,
	TrendingUp,
	UserPlus,
	Trash2,
	Edit,
	MoreHorizontal,
} from "lucide-react";

import Loader from "../components/Loader.jsx";
import StudentModal from "../components/StudentModal.jsx";
import AddToGroupModal from "../components/AddToGroupModal.jsx";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.jsx";
import PhoneUtils from "@/utils/phoneFormat.js";

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

export default function Students() {
	const navigate = useNavigate();
	const { tenant } = useParams();
	const {
		students = [],
		loading,
		error,
		createStudent,
		updateStudent,
		deleteStudent,
		addToGroup,
	} = useStudent();

	const { groups = [] } = useGroups();
	// const { teachers = [] } = useTeachers();/
	const { user } = useAuth();

	// State-lar
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);
	const [addToGroupStudent, setAddToGroupStudent] = useState(null);
	const [openGroup, setOpenGroup] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [copiedPhone, setCopiedPhone] = useState(null);

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!students) return { total: 0, withGroup: 0, newThisMonth: 0 };
		const now = new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		return {
			total: students.length,
			withGroup: students.filter((s) => s.groups || s.group_id).length,
			newThisMonth: students.filter((s) => new Date(s.created_at) >= monthStart)
				.length,
		};
	}, [students]);

	// Filtrlash mantiqi
	const filteredStudents = useMemo(() => {
		return students
			.filter((s) =>
				s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
			)
			.filter((s) => {
				if (!selectedTeacher) return true;
				const groupObj = groups.find(
					(g) => g.id === (s.groups?.id || s.group_id),
				);
				return groupObj?.teacher_id === selectedTeacher;
			})
			.filter((s) => {
				if (!selectedGroup) return true;
				return (s.groups?.id || s.group_id) === selectedGroup;
			});
	}, [students, searchTerm, selectedTeacher, selectedGroup, groups]);

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteStudent(deleteId);
			setDeleteId(null);
		}
	};

	const handleCopyPhone = async (phone) => {
		await navigator.clipboard.writeText(PhoneUtils.formatPhone(phone));
		setCopiedPhone(phone);
		toast.success("Raqam nusxalandi!");
		setTimeout(() => setCopiedPhone(null), 2000);
	};

	// 🎨 Avatar initials
	const getInitials = (name) => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	// 🎨 Group badge color
	const getGroupColor = (groupName) => {
		const colors = ["amber", "blue", "emerald", "purple", "pink", "cyan"];
		const index = groupName?.charCodeAt(0) % colors.length || 0;
		const map = {
			amber: "border-amber-400/30 text-amber-400 bg-amber-400/10",
			blue: "border-sky-400/30 text-sky-400 bg-sky-400/10",
			emerald: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
			purple: "border-violet-400/30 text-violet-400 bg-violet-400/10",
			pink: "border-pink-400/30 text-pink-400 bg-pink-400/10",
			cyan: "border-cyan-400/30 text-cyan-400 bg-cyan-400/10",
		};
		return map[colors[index]];
	};

	if (loading) return <Loader />;
	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="bg-red-500/10 border-red-500/30 p-6 max-w-md w-full backdrop-blur-xl">
					<div className="flex flex-col items-center text-center">
						<div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
							<Settings className="text-red-400 w-8 h-8" />
						</div>
						<h3 className="text-lg font-semibold text-white mb-2">
							Xatolik yuz berdi
						</h3>
						<p className="text-red-400/80 text-sm mb-4">
							Ma'lumotlarni yuklashda muammo
						</p>
						<Button
							onClick={() => navigate(-1)}
							variant="outline"
							className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
						>
							<ArrowLeft className="mr-2 h-4 w-4" /> Ortga qaytish
						</Button>
					</div>
				</Card>
			</div>
		);

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
								O'quvchilar boshqaruvi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Barcha talabalarni kuzatib boring
							</p>
						</div>
					</div>

					{user.role === "CEO" || "MANAGER" ? (
						<Button
							onClick={() => {
								setEditingStudent(null);
								setIsModalOpen(true);
							}}
							className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2 font-semibold"
						>
							<Plus className="h-4 w-4" /> O'quvchi qo'shish
						</Button>
					) : null}
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<StatsCard
						icon={<GraduationCap className="w-5 h-5" />}
						label="Jami o'quvchilar"
						value={stats.total}
						color="amber"
					/>
					<StatsCard
						icon={<Users className="w-5 h-5" />}
						label="Guruhdagi"
						value={stats.withGroup}
						// trend={}
						color="emerald"
					/>
					<StatsCard
						icon={<Sparkles className="w-5 h-5" />}
						label="Yangi (oy)"
						value={stats.newThisMonth}
						color="blue"
					/>
				</div>

				{/* 🔍 Search & Filters */}
				<Card className="bg-card border-white/10 backdrop-blur-xl">
					<CardContent className="p-4">
						<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
							{/* Search */}
							<div className="relative w-full lg:w-80">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
								<Input
									placeholder="Ism bo'yicha qidirish..."
									className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>

							{/* Filters */}
							<div className="flex flex-wrap items-center gap-3">
								{/* Group Filter */}
								<Popover open={openGroup} onOpenChange={setOpenGroup}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="justify-between border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
										>
											{selectedGroup
												? groups.find((g) => g.id === selectedGroup)?.name
												: "Barcha guruhlar"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-50 p-0 bg-[#1f1f1f] border-white/10 text-white"
										align="end"
									>
										<Command>
											<CommandInput
												placeholder="Guruhni qidirish..."
												className="text-white placeholder:text-gray-500"
											/>
											<CommandEmpty className="text-gray-500 py-4">
												Topilmadi.
											</CommandEmpty>
											<CommandGroup>
												<CommandItem
													onSelect={() => {
														setSelectedGroup("");
														setOpenGroup(false);
													}}
													className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
												>
													<Check
														className={`mr-2 h-4 w-4 ${!selectedGroup ? "opacity-100 text-amber-400" : "opacity-0"}`}
													/>
													Barcha guruhlar
												</CommandItem>
												{groups.map((g) => (
													<CommandItem
														key={g.id}
														onSelect={() => {
															setSelectedGroup(g.id);
															setOpenGroup(false);
														}}
														className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
													>
														<Check
															className={`mr-2 h-4 w-4 ${selectedGroup === g.id ? "opacity-100 text-amber-400" : "opacity-0"}`}
														/>
														{g.name}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>

								<Badge
									variant="outline"
									className="border-white/20 text-gray-400"
								>
									{filteredStudents.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Students Table */}
				<Card className="bg-card/80 backdrop-blur-xl overflow-hidden py-0">
					<Table>
						<TableHeader>
							<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
								<TableHead className="text-gray-400 w-12"></TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<GraduationCap className="h-4 w-4" /> Ism
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4" /> Guruh
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4" /> Telefon
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4" /> Tug'ilgan kun
									</div>
								</TableHead>
								<TableHead className="text-gray-400 text-right w-20">
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredStudents.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="py-16">
										<EmptyState
											onAddNew={() => {
												setEditingStudent(null);
												setIsModalOpen(true);
											}}
											hasSearch={!!searchTerm}
										/>
									</TableCell>
								</TableRow>
							) : (
								filteredStudents.map((s) => (
									<TableRow
										key={s.id}
										className="border-white/5 hover:bg-amber-400/5 transition-all duration-200 group/row cursor-pointer"
										onClick={() => navigate(`/${tenant}/students/${s.id}`)}
									>
										<TableCell className="py-4">
											<Avatar className="w-10 h-10 border border-white/10 bg-linear-to-br from-amber-400/20 to-orange-400/20">
												<AvatarFallback className="text-amber-400 text-sm font-semibold bg-transparent">
													{getInitials(s.full_name)}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell className="font-medium text-white">
											<div>
												<p className="truncate max-w-40">{s.full_name}</p>
												{s.balance < 0 && (
													<Badge
														variant="outline"
														className="mt-1 text-[10px] border-red-500/30 text-red-400 bg-red-500/10"
													>
														Qarzdor
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											{s.groups?.name ||
											(Array.isArray(s.groups)
												? s.groups[0]?.name
												: s.group?.name) ? (
												<Badge
													variant="outline"
													className={`border ${getGroupColor(s.groups?.name || s.group?.name)}`}
												>
													{s.groups?.name ||
														(Array.isArray(s.groups)
															? s.groups[0]?.name
															: s.group?.name)}
												</Badge>
											) : (
												<span className="text-gray-500 text-sm">Guruhsiz</span>
											)}
										</TableCell>
										<TableCell>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleCopyPhone(s.phone);
												}}
												className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition-colors group/btn"
											>
												<span className=" font-mono text-sm">
													{PhoneUtils.formatPhone(s.phone)}
												</span>
												{copiedPhone === s.phone ? (
													<Check className="w-4 h-4 text-emerald-400" />
												) : (
													<Copy className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
												)}
											</button>
										</TableCell>
										<TableCell className="text-gray-400 text-sm">
											{s.birthday ? s.birthday.split("T")[0] : "—"}
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
													className="bg-[#1f1f1f] border-white/10 text-white w-52"
												>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															setEditingStudent(s);
															setIsModalOpen(true);
														}}
														className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
													>
														<Edit className="mr-2 h-4 w-4 text-blue-400" />{" "}
														Tahrirlash
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															navigate(`/${tenant}/students/${s.id}`);
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
															setAddToGroupStudent(s);
															setAddToGroupOpen(true);
														}}
														className="cursor-pointer hover:bg-emerald-400/10 focus:bg-emerald-400/10"
													>
														<UserPlus className="mr-2 h-4 w-4 text-emerald-400" />{" "}
														{s.groups ? "Guruhni almashtirish" : "Guruhga qo'shish"}
													</DropdownMenuItem>
													<DropdownMenuSeparator className="bg-white/10" />
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															setDeleteId(s.id);
														}}
														className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
													>
														<Trash2 className="mr-2 h-4 w-4" /> O'chirish
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Card>

				{/* 📄 Footer Info */}
				{filteredStudents.length > 0 && (
					<div className="flex items-center justify-between text-sm text-gray-500">
						<p>{filteredStudents.length} o'quvchi ko'rsatilmoqda</p>
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
			<StudentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingStudent}
				onSubmit={async (formData) => {
					if (editingStudent) {
						await updateStudent(editingStudent.id, formData);
					} else {
						await createStudent(formData);
					}
					setIsModalOpen(false);
				}}
			/>

			<AddToGroupModal
				isOpen={addToGroupOpen}
				onClose={() => setAddToGroupOpen(false)}
				initialGroupId={addToGroupStudent?.group_id}
				onConfirm={async (groupId) => {
					await addToGroup(addToGroupStudent.id, Number(groupId));
					setAddToGroupOpen(false);
				}}
			/>

			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="O'quvchini o'chirish"
				description="Haqiqatdan ham ushbu o'quvchini o'chirib tashlamoqchimisiz? Barcha bog'liq ma'lumotlar ham o'chiriladi."
			/>
		</div>
	);
}

// 🧩 Empty State Component
const EmptyState = ({ onAddNew, hasSearch }) => (
	<div className="flex flex-col items-center justify-center text-center py-8 px-4">
		<div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
			{hasSearch ? (
				<Search className="w-8 h-8" />
			) : (
				<GraduationCap className="w-8 h-8" />
			)}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "O'quvchilar yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday o'quvchi mavjud emas. Birinchi o'quvchini qo'shishni boshlang!"}
		</p>
		{!hasSearch && (
			<Button
				onClick={onAddNew}
				className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2"
			>
				<Plus className="w-4 h-4" /> Birinchi o'quvchini qo'shish
			</Button>
		)}
	</div>
);
