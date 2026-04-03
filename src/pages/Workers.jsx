import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorker } from "../services/worker/useWorker";
import toast from "react-hot-toast";

// Shadcn UI komponentlari
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
	Search,
	Plus,
	MoreVertical,
	Edit2,
	Trash2,
	UserCheck,
	Phone,
	ArrowLeft,
	Shield,
	UserRound,
	PhoneCall,
	BriefcaseBusiness,
	Copy,
	Check,
	ExternalLink,
	Sparkles,
	TrendingUp,
	Filter,
	Users,
	Calendar,
	Mail,
} from "lucide-react";

import Loader from "../components/Loader";
import WorkerModal from "../components/WorkerModal";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import PhoneUtils from "@/utils/phoneFormat";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaUserTie } from "react-icons/fa";

// 🎨 Animated Background Component
const AnimatedBackground = () => (
	<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
		<div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
		<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-br from-amber-500/5 via-transparent to-purple-500/5 rounded-full blur-3xl" />
	</div>
);

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

export default function Workers() {
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { workerData, isLoading, createWorker, updateWorker, removeWorker } =
		useWorker();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingWorker, setEditingWorker] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("all");
	const [deleteId, setDeleteId] = useState(null);
	const [copiedPhone, setCopiedPhone] = useState(null);

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!workerData) return { total: 0, teachers: 0, admins: 0, managers: 0 };
		return {
			total: workerData.length,
			teachers: workerData.filter((w) => w.role === "TEACHER").length,
			admins: workerData.filter((w) => w.role === "ADMIN").length,
			managers: workerData.filter((w) => w.role === "MANAGER").length,
		};
	}, [workerData]);

	// Filtrlash mantiqi
	const filteredWorkers = useMemo(() => {
		return (workerData || []).filter((w) => {
			const matchesSearch =
				w.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				w.phone?.includes(searchTerm) ||
				w.position?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesFilter =
				filter === "all" ||
				(filter === "teachers" && w.role === "TEACHER") ||
				(filter === "admins" && w.role === "ADMIN") ||
				(filter === "managers" && w.role === "MANAGER");
			return matchesSearch && matchesFilter;
		});
	}, [workerData, searchTerm, filter]);

	// O'chirish funksiyasi
	const handleConfirmDelete = async () => {
		if (deleteId) {
			await removeWorker(deleteId);
			setDeleteId(null);
			toast.success("Xodim muvaffaqiyatli o'chirildi");
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

	// 🎨 Role badge config
	const getRoleConfig = (role) => {
		const configs = {
			CEO: {
				label: "Bosh direktor",
				color: "border-red-500/30 text-red-400 bg-red-500/10",
				icon: <FaUserTie className="w-3 h-3" />,
			},
			TEACHER: {
				label: "O'qituvchi",
				color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
				icon: <BriefcaseBusiness className="w-3 h-3" />,
			},
			ADMIN: {
				label: "Admin",
				color: "border-violet-500/30 text-violet-400 bg-violet-500/10",
				icon: <Shield className="w-3 h-3" />,
			},
			MANAGER: {
				label: "Manager",
				color: "border-sky-500/30 text-sky-400 bg-sky-500/10",
				icon: <Users className="w-3 h-3" />,
			},
		};
		return (
			configs[role] || {
				label: role,
				color: "border-gray-500/30 text-gray-400 bg-gray-500/10",
				icon: null,
			}
		);
	};

	if (isLoading) return <Loader />;

	return (
		<div className="relative min-h-screen bg-background">
			<AnimatedBackground />

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
								Xodimlar boshqaruvi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Jamoa a'zolarini boshqaring
							</p>
						</div>
					</div>

					<Button
						onClick={() => {
							setEditingWorker(null);
							setIsModalOpen(true);
						}}
						className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2 font-semibold"
					>
						<Plus className="h-4 w-4" /> Xodim qo'shish
					</Button>
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatsCard
						icon={<UserCheck className="w-5 h-5" />}
						label="Jami xodimlar"
						value={stats.total}
						color="amber"
					/>
					<StatsCard
						icon={<BriefcaseBusiness className="w-5 h-5" />}
						label="O'qituvchilar"
						value={stats.teachers}
						color="emerald"
					/>
					<StatsCard
						icon={<Shield className="w-5 h-5" />}
						label="Adminlar"
						value={stats.admins}
						color="purple"
					/>
					<StatsCard
						icon={<Users className="w-5 h-5" />}
						label="Managerlar"
						value={stats.managers}
						color="blue"
					/>
				</div>

				{/* 🔍 Search & Filters */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
					<CardContent className="p-4">
						<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
							{/* Search */}
							<div className="relative w-full lg:w-80">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
								<InputGroup className="focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400/50 transition-all">
									<InputGroupInput
										placeholder="Ism, telefon yoki lavozim bo'yicha qidirish..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="bg-black/40 border-white/20 text-white placeholder:text-gray-500 border-0 focus:ring-0 pl-10"
									/>
									<InputGroupAddon className="text-gray-500">
										<Search />
									</InputGroupAddon>
								</InputGroup>
							</div>

							{/* Role Filter Tabs */}
							<div className="flex items-center gap-5">
								<Tabs
									value={filter}
									onValueChange={setFilter}
									className="w-full lg:w-auto"
								>
									<TabsList className="bg-card border border-white/10 p-1">
										<TabsTrigger
											value="all"
											className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
										>
											Barchasi
										</TabsTrigger>
										<TabsTrigger
											value="teachers"
											className="data-[state=active]:bg-emerald-400 data-[state=active]:text-black"
										>
											O'qituvchilar
										</TabsTrigger>
										<TabsTrigger
											value="admins"
											className="data-[state=active]:bg-violet-400 data-[state=active]:text-black"
										>
											Adminlar
										</TabsTrigger>
										<TabsTrigger
											value="managers"
											className="data-[state=active]:bg-sky-400 data-[state=active]:text-black"
										>
											Managerlar
										</TabsTrigger>
									</TabsList>
								</Tabs>

								<Badge
									variant="outline"
									className="border-white/20 text-gray-400 hidden lg:flex"
								>
									{filteredWorkers.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Workers Table */}
				<Card className="bg-card/80 backdrop-blur-xl overflow-hidden py-0">
					<Table>
						<TableHeader>
							<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
								<TableHead className="text-gray-400 w-12"></TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<UserRound className="h-4 w-4" /> Xodim ismi
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<PhoneCall className="h-4 w-4" /> Telefon
									</div>
								</TableHead>
								<TableHead className="text-gray-400">
									<div className="flex items-center gap-2">
										<BriefcaseBusiness className="h-4 w-4" /> Lavozimi
									</div>
								</TableHead>
								<TableHead className="text-gray-400 text-right w-20">
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredWorkers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="py-16">
										<EmptyState
											onAddNew={() => {
												setEditingWorker(null);
												setIsModalOpen(true);
											}}
											hasSearch={!!searchTerm}
										/>
									</TableCell>
								</TableRow>
							) : (
								filteredWorkers.map((w) => {
									const roleConfig = getRoleConfig(w.role);

									return (
										<TableRow
											key={w.id}
											className="border-white/5 hover:bg-amber-400/5 transition-all duration-200 group/row cursor-pointer"
											onClick={() => navigate(`/${tenant}/workers/${w.id}`)}
										>
											<TableCell className="py-4">
												<Avatar className="w-10 h-10 border border-white/10 bg-linear-to-br from-amber-400/20 to-orange-400/20">
													<AvatarFallback className="text-amber-400 text-sm font-semibold bg-transparent">
														{getInitials(w.full_name)}
													</AvatarFallback>
												</Avatar>
											</TableCell>
											<TableCell className="font-medium text-white truncate max-w-40">
												{w.full_name}
											</TableCell>
											<TableCell>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleCopyPhone(w.phone);
													}}
													className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition-colors group/btn"
												>
													<span className="font-mono text-sm">
														{PhoneUtils.formatPhone(w.phone)}
													</span>
													{copiedPhone === w.phone ? (
														<Check className="w-4 h-4 text-emerald-400" />
													) : (
														<Copy className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
													)}
												</button>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={`border gap-1.5 ${roleConfig.color}`}
												>
													{roleConfig.icon}
													{roleConfig.label}
												</Badge>
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
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="bg-[#1f1f1f] border-white/10 text-white w-48"
													>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																setEditingWorker(w);
																setIsModalOpen(true);
															}}
															className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
														>
															<Edit2 className="mr-2 h-4 w-4 text-blue-400" />{" "}
															Tahrirlash
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																navigate(`/${tenant}/workers/${w.id}`);
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
																setDeleteId(w.id);
															}}
															className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
														>
															<Trash2 className="mr-2 h-4 w-4" /> O'chirish
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
				{/* {filteredWorkers.length > 0 && (
					<div className="flex items-center justify-between text-sm text-gray-500">
						<p>{filteredWorkers.length} xodim ko'rsatilmoqda</p>
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
				)} */}
			</div>

			{/* 🎭 Modals */}
			<WorkerModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingWorker}
				onSubmit={async (formData) => {
					if (editingWorker) {
						await updateWorker({ id: editingWorker.id, data: formData });
						toast.success("Xodim ma'lumotlari yangilandi!");
					} else {
						await createWorker(formData);
						toast.success("Yangi xodim qo'shildi!");
					}
					setIsModalOpen(false);
					setEditingWorker(null);
				}}
			/>

			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="Xodimni o'chirish"
				description="Haqiqatdan ham ushbu xodimni o'chirib tashlamoqchimisiz? Barcha bog'liq ma'lumotlar ham o'chiriladi."
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
				<UserCheck className="w-8 h-8" />
			)}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "Xodimlar yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday xodim mavjud emas. Birinchi xodimni qo'shishni boshlang!"}
		</p>
		{!hasSearch && (
			<Button
				onClick={onAddNew}
				className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2"
			>
				<Plus className="w-4 h-4" /> Birinchi xodimni qo'shish
			</Button>
		)}
	</div>
);
