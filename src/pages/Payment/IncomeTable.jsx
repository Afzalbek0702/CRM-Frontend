import { useState, useMemo } from "react";
import { usePayments } from "@/services/payment/usePayments";
import Loader from "@/components/Loader";
import PaymentModal from "@/components/PaymentModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import toast from "react-hot-toast";
import { FaMoneyBillWave, FaEdit, FaTrash, FaSearch, FaChartLine } from "react-icons/fa";
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem,
	DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	Calendar, Banknote, CreditCard, MoreHorizontal, Check,
	ExternalLink, TrendingUp, Receipt, Wallet, ArrowUpRight, ArrowLeft,
} from "lucide-react";

// ─── Stats Card ───────────────────────────────────────────────────────────────
const StatsCard = ({ icon, label, value, subValue, color = "emerald" }) => {
	const colors = {
		emerald: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
		amber: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
		blue: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
		purple: "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
	};

	const valueClass =
	String(value).length > 16
		? "12px"
		: String(value).length > 10
			? "16px"
			: "text-xl";

	return (
		<Card className={`bg-linear-to-br ${colors[color]} border backdrop-blur-xl hover:scale-[1.02] transition-all duration-300`}>
			<CardContent className="p-5 flex items-center gap-4">
				<div className={`p-3 rounded-xl bg-white/10 border border-white/20 ${colors[color].split(" ").pop()}`}>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
					<p className={`${valueClass} font-bold text-white truncate`}>{value}</p>
					{subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
				</div>
			</CardContent>
		</Card>
	);
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ hasSearch = false }) => (
	<div className="flex flex-col items-center justify-center text-center py-12 px-4">
		<div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${hasSearch ? "bg-white/5 border border-white/10 text-gray-500" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
			{hasSearch ? <FaSearch className="w-8 h-8" /> : <Receipt className="w-8 h-8" />}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "To'lovlar yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday to'lov qayd etilmagan."}
		</p>
	</div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function IncomeTable() {
	const { payments, isLoading, createPayment, updatePayment, deletePayment } = usePayments();

	// ── State ──
	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedMethod, setSelectedMethod] = useState("all");
	const [selectedMonth, setSelectedMonth] = useState("all");
	const [sortOrder, setSortOrder] = useState("none"); // "none" | "asc" | "desc"
	const [copiedId, setCopiedId] = useState(null);

	// ── Formatters ──
	const formatDate = (d) =>
		d ? new Date(d).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" }) : "—";

	const formatCurrency = (amount) => {
		const val = Number(amount) || 0;
		return val >= 1000 && val < 1_000_000
			? `${(val / 1000).toLocaleString()} ming so'm`
			: `${val.toLocaleString()} so'm`;
	};

	const formatMethod = (method) => ({
		all: "Barchasi", CASH: "Naqd", CARD: "Karta",
		TRANSFER: "Transfer", CLICK: "Click", PAYME: "Payme", UZCARD: "Uzcard",
	}[method] ?? method);

	const formatMonthLabel = (monthStr) => {
		if (!monthStr) return "";
		const [year, month] = monthStr.split("-");
		const names = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
		return `${names[parseInt(month, 10) - 1]} ${year}`;
	};

	const formatRoundedCurrency = (amount) =>
		`${Math.round(amount / 1000).toLocaleString()} 000 so'm`;


	const capitalize = (str) => str?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

	const getInitials = (name) => {
		if (!name) return "?";
		const parts = name.trim().split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	const getMethodColor = (method) => ({
		CASH: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
		CARD: "border-sky-500/30 text-sky-400 bg-sky-500/10",
		TRANSFER: "border-purple-500/30 text-purple-400 bg-purple-500/10",
		CLICK: "border-amber-500/30 text-amber-400 bg-amber-500/10",
		PAYME: "border-pink-500/30 text-pink-400 bg-pink-500/10",
		UZCARD: "border-blue-500/30 text-blue-400 bg-blue-500/10",
	}[method] ?? "border-gray-500/30 text-gray-400 bg-gray-500/10");

	// ── Derived data ──
	const availableMonths = useMemo(() => {
		if (!payments) return [];
		const months = new Set(payments.map((p) => p.paid_month?.slice(0, 7)));
		return [...months].filter(Boolean).sort().reverse();
	}, [payments]);

	const stats = useMemo(() => {
		if (!payments) return { total: 0, count: 0, avg: 0, today: 0, max: 0 };
		const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
		const today = new Date().toISOString().split("T")[0];
		const todayTotal = payments
			.filter((p) => p.paid_at?.startsWith(today))
			.reduce((sum, p) => sum + (p.amount || 0), 0);
		return {
			total,
			count: payments.length,
			avg: payments.length > 0 ? Math.round(total / payments.length) : 0,
			today: todayTotal,
			max: payments.length > 0 ? Math.max(...payments.map((p) => p.amount || 0)) : 0,
		};
	}, [payments]);

	const filteredPayments = useMemo(() => {
		let result = (payments || [])
			.filter((p) =>
				p.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.group_name?.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.filter((p) => selectedMethod === "all" || p.method === selectedMethod)
			.filter((p) => selectedMonth === "all" || p.paid_month?.startsWith(selectedMonth));

		if (sortOrder === "asc") return result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
		if (sortOrder === "desc") return result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
		return result.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at));
	}, [payments, searchTerm, selectedMethod, selectedMonth, sortOrder]);

	const totalIncome = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

	// ── Handlers ──
	const handleFormSubmit = async (formData) => {
		if (modal.data) {
			await toast.promise(updatePayment(modal.data.id, formData), {
				loading: "Saqlanmoqda...", success: "To'lov yangilandi.",
				error: (err) => err.response?.data?.message || "Xatolik yuz berdi.",
			});
		} else {
			await toast.promise(createPayment(formData), {
				loading: "Saqlanmoqda...", success: "To'lov qo'shildi.",
				error: (err) => err.response?.data?.message || "Xatolik yuz berdi.",
			});
		}
		setModal({ isOpen: false, data: null });
	};

	const handleConfirmDelete = async () => {
		if (!deleteId) return;
		await toast.promise(deletePayment(deleteId), {
			loading: "O'chirilmoqda...", success: "To'lov o'chirildi.",
			error: (err) => err.response?.data?.message || "Xatolik yuz berdi.",
		});
		setDeleteId(null);
	};

	const handleCopyId = (id) => {
		navigator.clipboard.writeText(String(id));
		setCopiedId(id);
		toast.success("ID nusxalandi!");
		setTimeout(() => setCopiedId(null), 2000);
	};

	// ── Render ──
	if (isLoading) return <Loader />;

	return (
		<div className="relative min-h-screen bg-background">
			<div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">

				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
							<FaMoneyBillWave className="text-emerald-400 w-6 h-6" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
								To'lovlar tarixi
							</h1>
							<p className="text-sm text-gray-500 mt-1">Barcha moliyaviy tushumlarni kuzatib boring</p>
						</div>
					</div>
					<Badge variant="outline" className="border-emerald-400/50 text-emerald-400 bg-emerald-400/10">
						<Receipt className="mr-1.5 h-3 w-3" /> {stats.count} ta to'lov
					</Badge>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatsCard
						className="font-bold text-xl lg:text-2xl leading-tight"
						icon={<Wallet className="w-5 h-5" />}
						label="Jami tushum"
						value={formatRoundedCurrency(stats.total)}
						subValue={`Bugun: ${formatRoundedCurrency(stats.today)}`}
						color="emerald"
					/>

					<StatsCard
						icon={<FaChartLine className="w-5 h-5" />}
						label="To'lovlar soni"
						value={`${stats.count} ta`}
						color="blue"
					/>

					<StatsCard
						icon={<Banknote className="w-5 h-5" />}
						label="O'rtacha to'lov"
						value={formatRoundedCurrency(stats.avg)}
						color="amber"
					/>

					<StatsCard
						icon={<ArrowUpRight className="w-5 h-5" />}
						label="Eng katta to'lov"
						value={formatRoundedCurrency(stats.max)}
						color="purple"
					/>
				</div>

				{/* Search & Filters */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
					<CardContent className="p-4 space-y-3">

						{/* Search */}
						<div className="relative">
							<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
							<Input
								placeholder="O'quvchi yoki guruh bo'yicha qidirish..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
							/>
						</div>

						{/* Filters row */}
						<div className="flex flex-wrap items-center gap-2">

							{/* Method */}
							{["all", "CASH", "CARD", "TRANSFER", "CLICK", "PAYME", "UZCARD"].map((m) => (
								<Button
									key={m}
									size="sm"
									variant={selectedMethod === m ? "default" : "outline"}
									onClick={() => setSelectedMethod(m)}
									className={selectedMethod === m
										? "bg-emerald-400 hover:bg-emerald-500 text-black text-xs px-3 h-7"
										: "border-white/20 text-gray-400 hover:bg-white/10 hover:text-white text-xs px-3 h-7"}
								>
									{formatMethod(m)}
								</Button>
							))}

							<div className="w-px h-6 bg-white/10 mx-1" />

							{/* Month */}
							<div className="flex items-center gap-1.5">
								<Calendar className="w-3.5 h-3.5 text-gray-500" />
								<select
									value={selectedMonth}
									onChange={(e) => setSelectedMonth(e.target.value)}
									className="bg-black/40 border border-white/20 text-gray-300 text-xs rounded-md px-2 h-7 focus:outline-none focus:border-emerald-400/50 cursor-pointer"
								>
									<option value="all">Barcha oylar</option>
									{availableMonths.map((mo) => (
										<option key={mo} value={mo}>{formatMonthLabel(mo)}</option>
									))}
								</select>
							</div>

							<div className="w-px h-6 bg-white/10 mx-1" />

							{/* Sort */}
							<div className="flex items-center gap-1.5">
								<Banknote className="w-3.5 h-3.5 text-gray-500" />
								{[
									{ value: "none", label: "Standart" },
									{ value: "asc", label: "↑ Kam→Ko'p" },
									{ value: "desc", label: "↓ Ko'p→Kam" },
								].map((opt) => (
									<Button
										key={opt.value}
										size="sm"
										variant={sortOrder === opt.value ? "default" : "outline"}
										onClick={() => setSortOrder(opt.value)}
										className={sortOrder === opt.value
											? "bg-emerald-400 hover:bg-emerald-500 text-black text-xs px-3 h-7"
											: "border-white/20 text-gray-400 hover:bg-white/10 hover:text-white text-xs px-3 h-7"}
									>
										{opt.label}
									</Button>
								))}
							</div>

							<Badge variant="outline" className="border-white/20 text-gray-400 ml-auto">
								{filteredPayments.length} natija
							</Badge>
						</div>

					</CardContent>
				</Card>

				{/* Table */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl overflow-hidden">
					<CardHeader className="pb-4">
						<CardTitle className="text-white flex items-center gap-2">
							<Receipt className="text-emerald-400" /> To'lovlar ro'yxati
						</CardTitle>
						<CardDescription>Sana, o'quvchi va to'lov usuli bo'yicha tafsilotlar</CardDescription>
					</CardHeader>
					<CardContent>
						{filteredPayments.length === 0 ? (
							<EmptyState hasSearch={!!searchTerm || selectedMethod !== "all" || selectedMonth !== "all"} />
						) : (
							<div className="rounded-lg border border-white/10 overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
											<TableHead className="w-12" />
											<TableHead className="text-gray-400">O'quvchi</TableHead>
											<TableHead className="text-gray-400">Guruh</TableHead>
											<TableHead className="text-gray-400">Miqdor</TableHead>
											<TableHead className="text-gray-400">To'lov turi</TableHead>
											<TableHead className="text-gray-400">Sana</TableHead>
											<TableHead className="text-gray-400 text-right w-20">Amallar</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredPayments.map((p) => (
											<TableRow key={p.id} className="border-white/5 hover:bg-emerald-400/5 align-middle group/row">

												{/* Avatar */}
												<TableCell className="py-3 pl-4">
													<Avatar className="w-10 h-10 border border-white/10 bg-linear-to-br from-emerald-400/20 to-teal-400/20">
														<AvatarFallback className="text-emerald-400 text-sm font-semibold bg-transparent">
															{getInitials(p.student_name)}
														</AvatarFallback>
													</Avatar>
												</TableCell>

												{/* Student */}
												<TableCell className="font-medium text-white align-middle">
													<p className="truncate max-w-32">{capitalize(p.student_name)}</p>
													<button
														onClick={(e) => { e.stopPropagation(); handleCopyId(p.id); }}
														className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-emerald-400 transition-colors mt-1"
													>
														{copiedId === p.id
															? <Check className="w-3 h-3" />
															: <span className="font-mono">#{String(p.id).slice(-4)}</span>}
													</button>
												</TableCell>

												{/* Group */}
												<TableCell className="align-middle">
													<Badge variant="outline" className="border-amber-400/30 text-amber-400 bg-amber-400/10">
														{p.group_name || "—"}
													</Badge>
												</TableCell>

												{/* Amount */}
												<TableCell className="align-middle">
													<span className="text-emerald-400 font-bold font-mono">
														{formatCurrency(p.amount)}
													</span>
												</TableCell>

												{/* Method */}
												<TableCell className="align-middle">
													<Badge variant="outline" className={`border gap-1.5 ${getMethodColor(p.method)}`}>
														<CreditCard className="w-3 h-3" />
														{formatMethod(p.method)}
													</Badge>
												</TableCell>

												{/* Date */}
												<TableCell className="align-middle">
													<div className="text-gray-400 text-sm flex items-center gap-2">
														<Calendar className="w-4 h-4 text-emerald-400/70" />
														{formatDate(p.paid_at)}
													</div>
												</TableCell>

												{/* Actions */}
												<TableCell className="text-right align-middle">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 opacity-0 group-hover/row:opacity-100 transition-all"
															>
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="bg-[#1f1f1f] border-white/10 text-white w-48">
															<DropdownMenuItem
																onClick={() => setModal({ isOpen: true, data: p })}
																className="cursor-pointer hover:bg-emerald-400/10 focus:bg-emerald-400/10"
															>
																<FaEdit className="mr-2 h-4 w-4 text-blue-400" /> Tahrirlash
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => toast.success("Tafsilotlar ochildi")}
																className="cursor-pointer hover:bg-emerald-400/10 focus:bg-emerald-400/10"
															>
																<ExternalLink className="mr-2 h-4 w-4 text-purple-400" /> Batafsil
															</DropdownMenuItem>
															<DropdownMenuSeparator className="bg-white/10" />
															<DropdownMenuItem
																onClick={() => setDeleteId(p.id)}
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

				{/* Footer */}
				{filteredPayments.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
						<p className="text-sm text-gray-500">
							{filteredPayments.length} ta to'lov ko'rsatilmoqda • Jami:{" "}
							<span className="text-emerald-400 font-semibold">{formatCurrency(totalIncome)}</span>
						</p>
						<div className="flex items-center gap-3">
							<Button disabled variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
								<Calendar className="mr-2 h-4 w-4" /> Hisobot
							</Button>
							<Button disabled className="bg-linear-to-r from-emerald-400 to-teal-400 text-black shadow-lg shadow-emerald-500/25">
								<FaChartLine className="mr-2" /> Eksport
							</Button>
						</div>
					</div>
				)}

			</div>

			{/* Modals */}
			<PaymentModal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false, data: null })}
				initialData={modal.data}
				onSubmit={handleFormSubmit}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="To'lovni o'chirish"
				description="Haqiqatdan ham ushbu to'lovni o'chirib tashlamoqchimisiz? Bu amal bekor qilinmaydi."
			/>
		</div>
	);
}