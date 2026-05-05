import { useState, useMemo } from "react";
import { useExpenses } from "@/services/expense/useExpense";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import ExpenseModal from "@/components/ExpenseModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
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
	FaMoneyBillWave,
	FaPlus,
	FaEdit,
	FaTrash,
	FaSearch,
	FaChartLine,
} from "react-icons/fa";
import {
	Calendar,
	CreditCard,
	MoreHorizontal,
	Check,
	Wallet,
	Receipt,
} from "lucide-react";

export default function ExpensesTable() {
	const { expenses, isLoading, createExpense, updateExpense, deleteExpense } =
		useExpenses();
	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [copiedId, setCopiedId] = useState(null);
	const [method, setMethod] = useState("all");

	const fmtDate = d =>
		d
			? new Date(d).toLocaleDateString("uz-UZ", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				})
			: "—";
	const fmt = a => `${(a || 0).toLocaleString()} so'm`;
	const initials = n =>
		n
			? n
					.split(" ")
					.map(p => p[0])
					.join("")
					.toUpperCase()
			: "?";
	const copyId = async id => {
		await navigator.clipboard.writeText(String(id));
		setCopiedId(id);
		toast.success("ID nusxalandi!");
		setTimeout(() => setCopiedId(null), 2000);
	};
	const methodColor = m =>
		({
			CASH: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
			CARD: "text-sky-400 border-sky-500/30 bg-sky-500/10",
			TRANSFER: "text-purple-400 border-purple-500/30 bg-purple-500/10",
			CLICK: "text-amber-400 border-amber-500/30 bg-amber-500/10",
			PAYME: "text-pink-400 border-pink-500/30 bg-pink-500/10",
		})[m] || "text-gray-400 border-gray-500/30 bg-gray-500/10";

	const stats = useMemo(() => {
		if (!expenses) return { total: 0, count: 0, avg: 0, byMethod: {} };
		const byMethod = expenses.reduce((acc, e) => {
			acc[e.method] = (acc[e.method] || 0) + (e.amount || 0);
			return acc;
		}, {});
		const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
		return {
			total,
			count: expenses.length,
			avg: expenses.length ? Math.round(total / expenses.length) : 0,
			byMethod,
		};
	}, [expenses]);

	const filtered = useMemo(
		() =>
			(expenses || [])
				.filter(
					e =>
						e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
						e.created_by?.toLowerCase().includes(searchTerm.toLowerCase()),
				)
				.filter(e => method === "all" || e.method === method),
		[expenses, searchTerm, method],
	);

	const total = filtered.reduce((s, e) => s + (e.amount || 0), 0);
	const maxExpense = expenses?.length
		? Math.max(...expenses.map(e => e.amount || 0))
		: 0;

	if (isLoading) return <Loader />;
	const formatMethod = method => {
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
	return (
		<div className="relative min-h-99 bg-background">
			<div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
							<FaMoneyBillWave className="text-amber-400 w-6 h-6" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
								Xarajatlar boshqaruvi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Barcha moliyaviy xarajatlarni kuzatib boring
							</p>
						</div>
					</div>
					<Badge
						variant="outline"
						className="border-amber-400/50 text-amber-400 bg-amber-400/10"
					>
						<Receipt className="mr-1.5 h-3 w-3" /> {stats.count} ta xarajat
					</Badge>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{[
						{
							i: <Wallet className="w-5 h-5" />,
							l: "Jami xarajat",
							v: fmt(stats.total),
							s: `O'rtacha: ${fmt(stats.avg)}`,
							c: "amber",
						},
						{
							i: <FaChartLine className="w-5 h-5" />,
							l: "Xarajatlar soni",
							v: `${stats.count} ta`,
							c: "blue",
						},
						{
							i: <CreditCard className="w-5 h-5" />,
							l: "Eng katta xarajat",
							v: fmt(maxExpense),
							c: "emerald",
						},
					].map((st, i) => (
						<Card
							key={i}
							className={`bg-linear-to-br from-${st.c}-500/20 to-${st.c}-500/10 border-${st.c}-500/30 border backdrop-blur-xl`}
						>
							<CardContent className="p-5 flex items-center gap-4">
								<div
									className={`p-3 rounded-xl bg-white/10 border border-white/20 text-${st.c}-400`}
								>
									{st.i}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-gray-400 uppercase">{st.l}</p>
									<p className="text-2xl font-bold text-white truncate">
										{st.v}
									</p>
									{st.s && (
										<p className="text-xs text-gray-500 mt-0.5">{st.s}</p>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Search & Filters */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
					<CardContent className="p-4">
						<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
							<div className="relative w-full lg:w-80">
								<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
								<Input
									placeholder="Tavsif yoki foydalanuvchi bo'yicha qidirish..."
									value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
									className="pl-10 bg-black/40 border-white/20 text-white"
								/>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								{[
									"all",
									"CASH",
									"CARD",
									"TRANSFER",
									"CLICK",
									"PAYME",
									"UZCARD",
								].map(m => (
									<Button
										key={m}
										variant={method === m ? "default" : "outline"}
										size="sm"
										onClick={() => setMethod(m)}
										className={
											method === m
												? "bg-amber-400 hover:bg-amber-500 text-black"
												: "border-white/20 text-gray-400 hover:bg-white/10"
										}
									>
										{formatMethod(m)}
									</Button>
								))}
								<Badge
									variant="outline"
									className="border-white/20 text-gray-400"
								>
									{filtered.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Table */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl overflow-hidden">
					<CardHeader className="pb-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<CardTitle className="text-white flex items-center gap-2">
									<Receipt className="text-amber-400" />
									Xarajatlar ro'yxati
								</CardTitle>
								<CardDescription>
									Sana, miqdor va to'lov usuli bo'yicha tafsilotlar
								</CardDescription>
							</div>
							<Button
								onClick={() => setModal({ isOpen: true, data: null })}
								className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2"
							>
								<FaPlus className="h-4 w-4" />
								Xarajat qo'shish
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{filtered.length === 0 ? (
							<div className="text-center py-12 text-gray-500">
								<div
									className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${searchTerm || method !== "all" ? "bg-white/5 border border-white/10" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}
								>
									{searchTerm || method !== "all" ? (
										<FaSearch className="w-8 h-8" />
									) : (
										<Receipt className="w-8 h-8" />
									)}
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{searchTerm || method !== "all"
										? "Natija topilmadi"
										: "Xarajatlar yo'q"}
								</h3>
								<p className="text-sm max-w-sm mx-auto">
									{searchTerm || method !== "all"
										? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
										: "Hozircha hech qanday xarajat qayd etilmagan. Birinchi xarajatni qo'shishni boshlang!"}
								</p>
								{!(searchTerm || method !== "all") && (
									<Button className="mt-4 bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2">
										<FaPlus className="w-4 h-4" />
										Birinchi xarajatni qo'shish
									</Button>
								)}
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400 w-12" />
										<TableHead className="text-gray-400">Sana</TableHead>
										<TableHead className="text-gray-400">Tavsif</TableHead>
										<TableHead className="text-gray-400 text-right">
											Miqdor
										</TableHead>
										<TableHead className="text-gray-400">To'lov turi</TableHead>
										<TableHead className="text-gray-400">Kiritgan</TableHead>
										<TableHead className="text-gray-400 text-right w-20">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map(e => (
										<TableRow
											key={e.id}
											className="border-white/5 hover:bg-amber-400/5 group/row"
										>
											<TableCell className="py-4">
												<Avatar className="w-10 h-10 border border-white/10 bg-amber-400/20">
													<AvatarFallback className="text-amber-400 text-sm">
														{initials(e.description)}
													</AvatarFallback>
												</Avatar>
											</TableCell>
											<TableCell className="text-gray-400 text-sm flex items-center gap-2">
												<Calendar className="w-4 h-4 text-amber-400/70" />
												{fmtDate(e.created_at)}
											</TableCell>
											<TableCell className="font-medium text-white">
												<p className="truncate max-w-48">{e.description}</p>
												<button
													onClick={ev => {
														ev.stopPropagation();
														copyId(e.id);
													}}
													className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-amber-400 mt-1"
												>
													{copiedId === e.id ? (
														<Check className="w-3 h-3" />
													) : (
														<span className="font-mono">
															#{String(e.id).slice(-4)}
														</span>
													)}
												</button>
											</TableCell>
											<TableCell className="text-right">
												<span className="text-amber-400 font-bold font-mono">
													{fmt(e.amount)}
												</span>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={`border gap-1.5 ${methodColor(e.method)}`}
												>
													<CreditCard className="w-3 h-3" />
													{formatMethod(e.method)}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Avatar className="w-6 h-6 border border-white/10">
														<AvatarFallback className="text-xs bg-amber-400/20 text-amber-400">
															{initials(e.created_by)}
														</AvatarFallback>
													</Avatar>
													<span className="text-gray-300 text-sm truncate max-w-24">
														{e.created_by}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-gray-500 hover:text-amber-400 opacity-0 group-hover/row:opacity-100"
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
																setModal({ isOpen: true, data: e })
															}
															className="cursor-pointer hover:bg-amber-400/10"
														>
															<FaEdit className="mr-2 h-4 w-4 text-blue-400" />
															Tahrirlash
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																toast.success("Tafsilotlar ochildi")
															}
															className="cursor-pointer hover:bg-amber-400/10"
														>
															<ExternalLink className="mr-2 h-4 w-4 text-purple-400" />
															Batafsil
														</DropdownMenuItem>
														<DropdownMenuSeparator className="bg-white/10" />
														<DropdownMenuItem
															onClick={() => setDeleteId(e.id)}
															className="cursor-pointer text-red-400 hover:bg-red-400/10"
														>
															<FaTrash className="mr-2 h-4 w-4" />
															O'chirish
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Footer */}
				{filtered.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
						<p className="text-sm text-gray-500">
							{filtered.length} ta xarajat • Jami:{" "}
							<span className="text-amber-400 font-semibold">{fmt(total)}</span>
						</p>
						<div className="flex items-center gap-3">
							<Button
								disabled
								variant="outline"
								className="border-white/20 text-gray-300"
							>
								<Calendar className="mr-2 h-4 w-4" />
								Hisobot
							</Button>
							<Button
								disabled
								className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black"
							>
								<FaChartLine className="mr-2" />
								Eksport
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			<ExpenseModal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false, data: null })}
				initialData={modal.data}
				onSubmit={async fd => {
					modal.data
						? await toast.promise(updateExpense(modal.data.id, fd), {
								loading: "Saqlanmoqda...",
								success: "Xarajat yangilandi.",
								error: err => {
									return err.response?.data?.message || "Xatolik yuz berdi.";
								},
							})
						: await toast.promise(createExpense(fd), {
								loading: "Saqlanmoqda...",
								success: "xarajat qo'shildi.",
								error: err => {
									return err.response?.data?.message || "Xatolik yuz berdi.";
								},
							});
					setModal({ isOpen: false, data: null });
				}}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={async () => {
					await toast.promise(deleteExpense(deleteId), {
						loading: "O'chirilmoqda...",
						success: "Xarajat o'chirildi.",
						error: err => {
							return err.response?.data?.message || "Xatolik yuz berdi.";
						},
					});
					setDeleteId(null);
				}}
				title="Xarajatni o'chirish"
				description="Haqiqatdan ham ushbu xarajatni o'chirib tashlamoqchimisiz? Bu amal bekor qilinmaydi."
			/>
		</div>
	);
}
