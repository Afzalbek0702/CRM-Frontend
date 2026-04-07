import { useState, useMemo } from "react";
import Loader from "@/components/Loader";
import SalaryModal from "@/components/SalaryModal";
import { useSalary } from "@/services/salary/useSalary";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import toast from "react-hot-toast";

// Icons
import {
	FaEllipsisV,
	FaUserTie,
	FaMoneyBillWave,
	FaPlus,
	FaEdit,
	FaTrash,
	FaSearch,
	FaChartLine,
} from "react-icons/fa";
import {
	CalendarDays,
	UserCheck,
	Wallet,
	Landmark,
	StickyNote,
	MoreHorizontal,
	Copy,
	Check,
	ExternalLink,
	TrendingUp,
	Receipt,
	Sparkles,
	AlertCircle,
	Users,
} from "lucide-react";

// shadcn UI
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
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// 🎨 Animated Background Component
const AnimatedBackground = () => (
	<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
		<div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
		<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl" />
	</div>
);

// 🎨 Stats Card Component
const StatsCard = ({
	icon,
	label,
	value,
	subValue,
	color = "violet",
	trend,
}) => {
	const colors = {
		violet:
			"from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
		emerald:
			"from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
		amber:
			"from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
		blue: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
	};

	return (
		<Card
			className={`bg-gradient-to-br ${colors[color]} border backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300`}
		>
			<CardContent className="p-5 flex items-center gap-4">
				<div
					className={`p-3 rounded-xl bg-white/10 border border-white/20 ${colors[color].split(" ").pop()}`}
				>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs text-gray-400 uppercase tracking-wider">
						{label}
					</p>
					<p className="text-2xl font-bold text-white truncate">{value}</p>
					{subValue && (
						<p className="text-xs text-gray-500 mt-0.5">{subValue}</p>
					)}
					{trend !== undefined && (
						<p
							className={`text-xs flex items-center gap-1 mt-1 ${trend > 0 ? "text-emerald-400" : "text-red-400"}`}
						>
							<TrendingUp
								className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`}
							/>
							{Math.abs(trend)}% o'tgan oyga nisbatan
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default function SalaryTable() {
	const { salary, isLoading, createSalary, updateSalary, deleteSalary } =
		useSalary();

	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedMethod, setSelectedMethod] = useState("all");
	const [copiedId, setCopiedId] = useState(null);

	const formatDate = (d) =>
		d
			? new Date(d).toLocaleDateString("uz-UZ", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				})
			: "—";

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!salary)
			return { total: 0, count: 0, avg: 0, byMethod: {}, byWorker: {} };

		const byMethod = salary?.reduce((acc, s) => {
			acc[s.method] = (acc[s.method] || 0) + (s.amount || 0);
			return acc;
		}, {});

		const byWorker = salary?.reduce((acc, s) => {
			const name = s.worker?.full_name || "Noma'lum";
			acc[name] = (acc[name] || 0) + (s.amount || 0);
			return acc;
		}, {});

		return {
			total: salary?.reduce((sum, s) => sum + (s.amount || 0), 0),
			count: salary?.length,
			avg:
				salary?.length > 0
					? Math.round(
							salary?.reduce((sum, s) => sum + (s.amount || 0), 0) /
								salary.length,
						)
					: 0,
			byMethod,
			byWorker,
		};
	}, [salary]);

	// Filtrlash mantiqi
	const filteredSalary = useMemo(() => {
		return (salary || [])
			.filter(
				(s) =>
					s.worker?.full_name
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					s.description?.toLowerCase().includes(searchTerm.toLowerCase()),
			)
			.filter((s) => selectedMethod === "all" || s.method === selectedMethod)
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Newest first
	}, [salary, searchTerm, selectedMethod]);

	const totalSalaryPaid = filteredSalary.reduce(
		(sum, s) => sum + (s.amount || 0),
		0,
	);

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteSalary(deleteId);
			toast.success("Ish haqi muvaffaqiyatli o'chirildi");
			setDeleteId(null);
		}
	};

	const handleCopyId = async (id) => {
		await navigator.clipboard.writeText(String(id));
		setCopiedId(id);
		toast.success("ID nusxalandi!");
		setTimeout(() => setCopiedId(null), 2000);
	};

	// 🎨 Avatar initials
	const getInitials = (name) => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	// 🎨 Method badge color
	const getMethodColor = (method) => {
		const colors = {
			CASH: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
			CARD: "border-sky-500/30 text-sky-400 bg-sky-500/10",
			TRANSFER: "border-purple-500/30 text-purple-400 bg-purple-500/10",
			CLICK: "border-amber-500/30 text-amber-400 bg-amber-500/10",
			PAYME: "border-pink-500/30 text-pink-400 bg-pink-500/10",
			UZCARD: "border-blue-500/30 text-blue-400 bg-blue-500/10",
		};
		return colors[method] || "border-gray-500/30 text-gray-400 bg-gray-500/10";
	};

	const formatCurrency = (amount) => `${(amount || 0).toLocaleString()} so'm`;
	const formatMethod = (method) => {
		switch (method) {
			case "all":
				return "Barchasi";
			case "CASH":
				return "Naqd";
			case "CARD":
				return "Karta";
			case "TRANSFER":
				return "Transfer";
			case "CLICK":
				return "Click";
			case "PAYME":
				return "Payme";
			case "UZCARD":
				return "Uzcard";
			default:
				return method;
		}
	};
	if (isLoading) return <Loader />;

	return (
		<div className="relative min-h-99 bg-background">
			<AnimatedBackground />

			<div className="container mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* 🧭 Header Section */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
							<FaUserTie className="text-violet-400 w-6 h-6" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
								Ish haqi boshqaruvi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Xodimlarga to'langan maoshlarni kuzatib boring
							</p>
						</div>
					</div>

					<Badge
						variant="outline"
						className="border-violet-400/50 text-violet-400 bg-violet-400/10"
					>
						<Receipt className="mr-1.5 h-3 w-3" /> {stats.count} ta to'lov
					</Badge>
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatsCard
						icon={<Wallet className="w-5 h-5" />}
						label="Jami to'langan"
						value={formatCurrency(stats.total)}
						subValue={`O'rtacha: ${formatCurrency(stats.avg)}`}
						color="violet"
					/>
					<StatsCard
						icon={<FaChartLine className="w-5 h-5" />}
						label="To'lovlar soni"
						value={`${stats.count} ta`}
						color="blue"
					/>
					<StatsCard
						icon={<Users className="w-5 h-5" />}
						label="Xodimlar"
						value={Object.keys(stats.byWorker).length}
						color="emerald"
					/>
					<StatsCard
						icon={<Landmark className="w-5 h-5" />}
						label="Eng katta to'lov"
						value={
							salary?.length
								? formatCurrency(Math.max(...salary.map((s) => s.amount || 0)))
								: "0 so'm"
						}
						color="amber"
					/>
				</div>

				{/* 🔍 Search & Filters */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
					<CardContent className="p-4">
						<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
							{/* Search */}
							<div className="relative w-full lg:w-80">
								<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
								<Input
									placeholder="Xodim yoki izoh bo'yicha qidirish..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all"
								/>
							</div>

							{/* Method Filter */}
							<div className="flex flex-wrap items-center gap-2">
								{[
									"all",
									"CASH",
									"CARD",
									"TRANSFER",
									"CLICK",
									"PAYME",
									"UZCARD",
								].map((method) => (
									<Button
										key={method}
										variant={selectedMethod === method ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedMethod(method)}
										className={
											selectedMethod === method
												? "bg-violet-400 hover:bg-violet-500 text-black"
												: "border-white/20 text-gray-400 hover:bg-white/10 hover:text-white text-xs px-3"
										}
									>
										{formatMethod(method)}
									</Button>
								))}

								<Badge
									variant="outline"
									className="border-white/20 text-gray-400"
								>
									{filteredSalary.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Salary Table */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl overflow-hidden">
					<CardHeader className="pb-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<CardTitle className="text-white flex items-center gap-2">
									<Receipt className="text-violet-400" />
									Ish haqi to'lovlari
								</CardTitle>
								<CardDescription>
									Sana, xodim va to'lov usuli bo'yicha tafsilotlar
								</CardDescription>
							</div>
							<Button
								onClick={() => setModal({ isOpen: true, data: null })}
								className="bg-linear-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500 text-black shadow-lg shadow-violet-500/25 gap-2"
							>
								<FaPlus className="h-4 w-4" /> Yangi ish haqi
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{filteredSalary.length === 0 ? (
							<EmptyState
								hasSearch={!!searchTerm || selectedMethod !== "all"}
							/>
						) : (
							<div className="rounded-lg border border-white/10 overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
											<TableHead className="text-gray-400 w-12"></TableHead>
											<TableHead className="text-gray-400">Sana</TableHead>
											<TableHead className="text-gray-400">Xodim</TableHead>
											<TableHead className="text-gray-400 text-right">
												Miqdor
											</TableHead>
											<TableHead className="text-gray-400">
												To'lov turi
											</TableHead>
											<TableHead className="text-gray-400 max-w-40">
												Izoh
											</TableHead>
											<TableHead className="text-gray-400 text-right w-20">
												Amallar
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredSalary.map((s) => (
											<TableRow
												key={s.id}
												className="border-white/5 hover:bg-violet-400/5 transition-all duration-200 group/row"
											>
												<TableCell className="py-4">
													<Avatar className="w-10 h-10 border border-white/10 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20">
														<AvatarFallback className="text-violet-400 text-sm font-semibold bg-transparent">
															{getInitials(s.worker?.full_name)}
														</AvatarFallback>
													</Avatar>
												</TableCell>
												<TableCell className="text-gray-400 text-sm flex items-center gap-2">
													<CalendarDays className="w-4 h-4 text-violet-400/70" />
													{formatDate(s.created_at)}
												</TableCell>
												<TableCell className="font-medium text-white">
													<div>
														<p className="truncate max-w-32">
															{s.worker?.full_name}
														</p>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleCopyId(s.id);
															}}
															className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-violet-400 transition-colors mt-1"
														>
															{copiedId === s.id ? (
																<Check className="w-3 h-3" />
															) : (
																<span className="font-mono">
																	#{String(s.id).slice(-4)}
																</span>
															)}
														</button>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex flex-col items-end gap-1">
														<span className="text-violet-400 font-bold font-mono">
															{formatCurrency(s.amount)}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={`border gap-1.5 ${getMethodColor(s.method)}`}
													>
														<Landmark className="w-3 h-3" />
														{formatMethod(s.method)}
													</Badge>
												</TableCell>
												<TableCell>
													<p
														className="text-gray-400 text-sm truncate"
														title={s.description}
													>
														{s.description || (
															<span className="text-gray-600 italic">—</span>
														)}
													</p>
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-gray-500 hover:text-violet-400 hover:bg-violet-400/10 transition-colors opacity-0 group-hover/row:opacity-100"
															>
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="bg-[#1f1f1f] border-white/10 text-white w-48"
														>
															<DropdownMenuItem
																onClick={() => setModal({ isOpen: true, s })}
																className="cursor-pointer hover:bg-violet-400/10 focus:bg-violet-400/10"
															>
																<FaEdit className="mr-2 h-4 w-4 text-blue-400" />{" "}
																Tahrirlash
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => {
																	toast.success("Tafsilotlar ochildi");
																}}
																className="cursor-pointer hover:bg-violet-400/10 focus:bg-violet-400/10"
															>
																<ExternalLink className="mr-2 h-4 w-4 text-purple-400" />{" "}
																Batafsil
															</DropdownMenuItem>
															<DropdownMenuSeparator className="bg-white/10" />
															<DropdownMenuItem
																onClick={() => setDeleteId(s.id)}
																className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
															>
																<FaTrash className="mr-2 h-4 w-4" /> O'chirish
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>

				{/* 📄 Footer Actions */}
				{filteredSalary.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
						<p className="text-sm text-gray-500">
							{filteredSalary.length} ta to'lov ko'rsatilmoqda • Jami:{" "}
							<span className="text-violet-400 font-semibold">
								{formatCurrency(totalSalaryPaid)}
							</span>
						</p>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								className="border-white/20 text-gray-300 hover:bg-white/10"
							>
								<CalendarDays className="mr-2 h-4 w-4" /> Hisobot
							</Button>
							<Button className="bg-linear-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500 text-black shadow-lg shadow-violet-500/25">
								<FaChartLine className="mr-2" /> Eksport
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* 🎭 Modals */}
			<SalaryModal
				isOpen={modal.isOpen}
				initialData={modal.data}
				onClose={() => setModal({ isOpen: false })}
				onSubmit={(data) => {
					if (modal.data) {
						updateSalary(modal.data.id, data);
						toast.success("Ish haqi muvaffaqiyatli yangilandi!");
					} else {
						createSalary(data);
						toast.success("Yangi ish haqi qayd etildi!");
					}
					setModal({ isOpen: false, data: null });
				}}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="Ish haqini o'chirish"
				description="Haqiqatdan ham ushbu ish haqi to'lovini o'chirib tashlamoqchimisiz? Bu amal bekor qilinmaydi."
			/>
		</div>
	);
}

// 🧩 Empty State Component
const EmptyState = ({ hasSearch = false }) => (
	<div className="flex flex-col items-center justify-center text-center py-12 px-4">
		<div
			className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${hasSearch ? "bg-white/5 border border-white/10 text-gray-500" : "bg-violet-500/10 border border-violet-500/20 text-violet-400"}`}
		>
			{hasSearch ? (
				<FaSearch className="w-8 h-8" />
			) : (
				<Receipt className="w-8 h-8" />
			)}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "Ish haqi to'lovlari yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday ish haqi to'lovi qayd etilmagan. Birinchi to'lovni qo'shishni boshlang!"}
		</p>
		{!hasSearch && (
			<Button className="bg-linear-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500 text-black gap-2">
				<FaPlus className="w-4 h-4" /> Birinchi to'lovni qayd etish
			</Button>
		)}
	</div>
);
