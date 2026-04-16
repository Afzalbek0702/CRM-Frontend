import { useState, useMemo } from "react";
import { usePayments } from "@/services/payment/usePayments";
import Loader from "@/components/Loader";
import PaymentModal from "@/components/PaymentModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import toast from "react-hot-toast";

// Icons
import {
	FaMoneyBillWave,
	FaEdit,
	FaTrash,
	FaSearch,
	FaChartLine,

} from "react-icons/fa";

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
import { Input } from "@/components/ui/input";

import {
	Calendar,
	Banknote,
	CreditCard,
	MoreHorizontal,
	Check,
	ExternalLink,
	TrendingUp,
	Receipt,
	Wallet,
	ArrowUpRight,
	ArrowLeft,
} from "lucide-react";

// 🎨 Stats Card Component
const StatsCard = ({
	icon,
	label,
	value,
	subValue,
	color = "emerald",
	trend,
}) => {
	const colors = {
		emerald:
			"from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
		amber:
			"from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
		blue: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
		purple:
			"from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
	};

	return (
		<Card
			className={`bg-linear-to-br ${colors[color]} border backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300`}
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

export default function IncomeTable() {
	const { payments, isLoading, createPayment, updatePayment, deletePayment } =
		usePayments();

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
		if (!payments)
			return { total: 0, count: 0, avg: 0, byMethod: {}, today: 0 };

		const byMethod = payments?.reduce((acc, p) => {
			acc[p.method] = (acc[p.method] || 0) + (p.amount || 0);
			return acc;
		}, {});

		const today = new Date().toISOString().split("T")[0];
		const todayTotal = payments
			?.filter((p) => p.paid_at?.startsWith(today))
			.reduce((sum, p) => sum + (p.amount || 0), 0);

		return {
			total: payments?.reduce((sum, p) => sum + (p.amount || 0), 0),
			count: payments?.length,
			avg:
				payments?.length > 0
					? Math.round(
							payments?.reduce((sum, p) => sum + (p.amount || 0), 0) /
								payments?.length,
						)
					: 0,
			byMethod,
			today: todayTotal,
		};
	}, [payments]);

	// Filtrlash mantiqi
	const filteredPayments = useMemo(() => {
		return (payments || [])
			.filter(
				(p) =>
					p.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					p.group_name?.toLowerCase().includes(searchTerm.toLowerCase()),
			)
			.filter((p) => selectedMethod === "all" || p.method === selectedMethod)
			.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at)); // Newest first
	}, [payments, searchTerm, selectedMethod]);

	const totalIncome = filteredPayments.reduce(
		(sum, p) => sum + (p.amount || 0),
		0,
	);

	const handleFormSubmit = (formData) => {
		if (modal.data) {
			updatePayment(modal.data.id, formData);
		} else {
			createPayment(formData);
		}
		setModal({ isOpen: false, data: null });
	};

	const handleConfirmDelete = () => {
		if (deleteId) {
			deletePayment(deleteId);
			setDeleteId(null);
		}
	};

	const handleCopyId = (id) => {
		navigator.clipboard.writeText(String(id));
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

	const formatCurrency = (amount) => {
		const val = Number(amount) || 0;
		return val >= 1000 && val < 1000000
			? `${(val / 1000).toLocaleString()} ming so'm`
			: `${val.toLocaleString()} so'm`;
	};
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
						<div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
							<FaMoneyBillWave className="text-emerald-400 w-6 h-6" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
								To'lovlar tarixi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Barcha moliyaviy tushumlarni kuzatib boring
							</p>
						</div>
					</div>

					<Badge
						variant="outline"
						className="border-emerald-400/50 text-emerald-400 bg-emerald-400/10"
					>
						<Receipt className="mr-1.5 h-3 w-3" /> {stats.count} ta to'lov
					</Badge>
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatsCard
						icon={<Wallet className="w-5 h-5" />}
						label="Jami tushum"
						value={formatCurrency(stats.total)}
						subValue={`Bugun: ${formatCurrency(stats.today)}`}
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
						value={formatCurrency(stats.avg)}
						color="amber"
					/>
					<StatsCard
						icon={<ArrowUpRight className="w-5 h-5" />}
						label="Eng katta to'lov"
						value={
							payments?.length
								? formatCurrency(
										Math.max(...payments.map((p) => p.amount || 0)),
									)
								: "0 so'm"
						}
						color="purple"
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
									placeholder="O'quvchi yoki guruh bo'yicha qidirish..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
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
												? "bg-emerald-400 hover:bg-emerald-500 text-black"
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
									{filteredPayments.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Payments Table */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl overflow-hidden">
					<CardHeader className="pb-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<CardTitle className="text-white flex items-center gap-2">
									<Receipt className="text-emerald-400" />
									To'lovlar ro'yxati
								</CardTitle>
								<CardDescription>
									Sana, o'quvchi va to'lov usuli bo'yicha tafsilotlar
								</CardDescription>
							</div>
							
						</div>
					</CardHeader>
					<CardContent>
						{filteredPayments.length === 0 ? (
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
											<TableHead className="text-gray-400">O'quvchi</TableHead>
											<TableHead className="text-gray-400">Guruh</TableHead>
											<TableHead className="text-gray-400 text-right">
												Miqdor
											</TableHead>
											<TableHead className="text-gray-400">
												To'lov turi
											</TableHead>
											<TableHead className="text-gray-400 text-right w-20">
												Amallar
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredPayments.map((p) => (
											<TableRow
												key={p.id}
												className="border-white/5 hover:bg-emerald-400/5 transition-all duration-200 group/row"
											>
												<TableCell className="py-4">
													<Avatar className="w-10 h-10 border border-white/10 bg-linear-to-br from-emerald-400/20 to-teal-400/20">
														<AvatarFallback className="text-emerald-400 text-sm font-semibold bg-transparent">
															{getInitials(p.student_name)}
														</AvatarFallback>
													</Avatar>
												</TableCell>
												<TableCell className="text-gray-400 text-sm flex items-center gap-2">
													<Calendar className="w-4 h-4 text-emerald-400/70" />
													{formatDate(p.paid_at)}
												</TableCell>
												<TableCell className="font-medium text-white">
													<div>
														<p className="truncate max-w-32">
															{p.student_name}
														</p>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleCopyId(p.id);
															}}
															className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-emerald-400 transition-colors mt-1"
														>
															{copiedId === p.id ? (
																<Check className="w-3 h-3" />
															) : (
																<span className="font-mono">
																	#{String(p.id).slice(-4)}
																</span>
															)}
														</button>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="border-amber-400/30 text-amber-400 bg-amber-400/10"
													>
														{p.group_name || "—"}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex flex-col items-end gap-1">
														<span className="text-emerald-400 font-bold font-mono">
															{formatCurrency(p.amount)}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={`border gap-1.5 ${getMethodColor(p.method)}`}
													>
														<CreditCard className="w-3 h-3" />
														{formatMethod(p.method)}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors opacity-0 group-hover/row:opacity-100"
															>
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="bg-[#1f1f1f] border-white/10 text-white w-48"
														>
															<DropdownMenuItem
																onClick={() =>
																	setModal({ isOpen: true, data: p })
																}
																className="cursor-pointer hover:bg-emerald-400/10 focus:bg-emerald-400/10"
															>
																<FaEdit className="mr-2 h-4 w-4 text-blue-400" />{" "}
																Tahrirlash
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => {
																	toast.success("Tafsilotlar ochildi");
																}}
																className="cursor-pointer hover:bg-emerald-400/10 focus:bg-emerald-400/10"
															>
																<ExternalLink className="mr-2 h-4 w-4 text-purple-400" />{" "}
																Batafsil
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

				{/* 📄 Footer Actions */}
				{filteredPayments.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
						<p className="text-sm text-gray-500">
							{filteredPayments.length} ta to'lov ko'rsatilmoqda • Jami:{" "}
							<span className="text-emerald-400 font-semibold">
								{formatCurrency(totalIncome)}
							</span>
						</p>
						<div className="flex items-center gap-3">
                     <Button
                        disabled
								variant="outline"
								className="border-white/20 text-gray-300 hover:bg-white/10"
							>
								<Calendar className="mr-2 h-4 w-4" /> Hisobot
							</Button>
							<Button disabled className="bg-linear-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-black shadow-lg shadow-emerald-500/25">
								<FaChartLine className="mr-2" /> Eksport
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* 🎭 Modals */}
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

// 🧩 Empty State Component
const EmptyState = ({ hasSearch = false }) => (
	<div className="flex flex-col items-center justify-center text-center py-12 px-4">
		<div
			className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${hasSearch ? "bg-white/5 border border-white/10 text-gray-500" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}
		>
			{hasSearch ? (
				<FaSearch className="w-8 h-8" />
			) : (
				<Receipt className="w-8 h-8" />
			)}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "To'lovlar yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday to'lov qayd etilmagan. Birinchi to'lovni qo'shishni boshlang!"}
		</p>
		{!hasSearch && (
			<Button className="bg-linear-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-black gap-2">
				<FaMoneyBillWave className="w-4 h-4" /> Birinchi to'lovni qayd etish
			</Button>
		)}
	</div>
);
