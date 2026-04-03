import { useMemo, useState } from "react";
import { usePayments } from "@/services/payment/usePayments";
import { useStudent } from "@/services/student/useStudent";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	FaExclamationTriangle,
	FaSearch,
	FaMoneyCheckAlt,
} from "react-icons/fa";
import {
	Wallet,
	Users,
	CreditCard,
	AlertCircle,
	Calendar,
	ExternalLink,
	Copy,
	Check,
	TrendingUp,
} from "lucide-react";

export default function DebtorsTable({ searchTerm = "" }) {
	const { payments, isLoading: paymentsLoading } = usePayments();
	const { students, isLoading: studentsLoading } = useStudent();
	const [copiedId, setCopiedId] = useState(null);
	const isLoading = paymentsLoading || studentsLoading;

	const debtorsData = useMemo(
		() =>
			(students || [])
				.map((s) => {
					const sp = (payments || []).filter((p) => p.student_id === s.id);
					const paid = sp.reduce((sum, p) => sum + (p.amount || 0), 0);
					return {
						id: s.id,
						student_name: s.full_name,
						group_name: s.group_name,
						course_price: s.course_price || 0,
						total_paid: paid,
						remaining: (s.course_price || 0) - paid,
						last_payment: sp[sp.length - 1]?.paid_at,
						payment_count: sp.length,
					};
				})
				.filter((d) => d.remaining > 0)
				.sort((a, b) => b.remaining - a.remaining),
		[students, payments],
	);

	const filtered = useMemo(
		() =>
			debtorsData.filter(
				(d) =>
					d.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					d.group_name?.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		[debtorsData, searchTerm],
	);

	const stats = useMemo(() => {
		const total = filtered.reduce((s, d) => s + d.remaining, 0);
		return {
			total,
			count: filtered.length,
			avg: filtered.length ? Math.round(total / filtered.length) : 0,
			max: filtered[0]?.remaining || 0,
		};
	}, [filtered]);

	const copyId = async (id) => {
		await navigator.clipboard.writeText(String(id));
		setCopiedId(id);
		toast.success("ID nusxalandi!");
		setTimeout(() => setCopiedId(null), 2000);
	};
	const initials = (n) =>
		n
			? n
					.split(" ")
					.map((p) => p[0])
					.join("")
					.toUpperCase()
			: "?";
	const fmt = (a) => `${a.toLocaleString()} so'm`;
	const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("uz-UZ") : "—");
	const debtBadge = (r, t) => {
		const p = (r / t) * 100;
		return p >= 75
			? { l: "Jiddiy", c: "text-red-400 border-red-500/30 bg-red-500/10" }
			: p >= 50
				? {
						l: "O'rtacha",
						c: "text-amber-400 border-amber-500/30 bg-amber-500/10",
					}
				: { l: "Yengil", c: "text-sky-400 border-sky-500/30 bg-sky-500/10" };
	};

	if (isLoading) return <Loader />;

	return (
		<div className="relative min-h-screen bg-background p-4">
			{/* Simplified background */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>

			<div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
							<FaExclamationTriangle className="text-red-400 w-6 h-6" />
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
								Qarzdorlar ro'yxati
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								To'lovi kechikayotgan o'quvchilar
							</p>
						</div>
					</div>
					<Badge
						variant="outline"
						className="border-red-400/50 text-red-400 bg-red-400/10"
					>
						<AlertCircle className="mr-1.5 h-3 w-3" /> {stats.count} ta qarzdor
					</Badge>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{[
						{
							i: <Wallet className="w-5 h-5" />,
							l: "Jami qarz",
							v: fmt(stats.total),
							s: `O'rtacha: ${fmt(stats.avg)}`,
							c: "red",
						},
						{
							i: <Users className="w-5 h-5" />,
							l: "Qarzdor o'quvchilar",
							v: `${stats.count} ta`,
							c: "blue",
						},
						{
							i: <CreditCard className="w-5 h-5" />,
							l: "Eng katta qarz",
							v: fmt(stats.max),
							c: "amber",
						},
					].map((st, i) => (
						<Card
							key={i}
							className={`bg-gradient-to-br from-${st.c}-500/20 to-${st.c}-500/10 border-${st.c}-500/30 border backdrop-blur-xl`}
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

				{/* Table */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl overflow-hidden">
					<CardHeader className="pb-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<CardTitle className="text-white flex items-center gap-2">
									<AlertCircle className="text-red-400" />
									Qarzdorlar tafsilotlari
								</CardTitle>
								<CardDescription>
									Har bir o'quvchining to'lov holati va qolgan qarzi
								</CardDescription>
							</div>
							{filtered.length > 0 && (
								<Badge
									variant="outline"
									className="border-white/20 text-gray-400"
								>
									{filtered.length} natija
								</Badge>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{filtered.length === 0 ? (
							<div className="text-center py-12 text-gray-500">
								<div
									className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${searchTerm ? "bg-white/5 border border-white/10" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}
								>
									{searchTerm ? (
										<FaSearch className="w-8 h-8" />
									) : (
										<Check className="w-8 h-8" />
									)}
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{searchTerm ? "Natija topilmadi" : "Qarzdorlar yo'q! 🎉"}
								</h3>
								<p className="text-sm max-w-sm mx-auto">
									{searchTerm
										? "Qidiruv so'zingizni o'zgartirib ko'ring."
										: "Barcha o'quvchilar to'lovlarini vaqtida amalga oshirgan. A'lo!"}
								</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400 w-12" />
										<TableHead className="text-gray-400">O'quvchi</TableHead>
										<TableHead className="text-gray-400">Guruh</TableHead>
										<TableHead className="text-gray-400 text-right">
											Kurs narxi
										</TableHead>
										<TableHead className="text-gray-400 text-right">
											To'langan
										</TableHead>
										<TableHead className="text-gray-400 text-right">
											Qolgan qarz
										</TableHead>
										<TableHead className="text-gray-400">Holat</TableHead>
										<TableHead className="text-gray-400">
											Oxirgi to'lov
										</TableHead>
										<TableHead className="text-gray-400 text-right w-20">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map((d) => {
										const b = debtBadge(d.remaining, d.course_price);
										const pct =
											d.course_price > 0
												? Math.round((d.total_paid / d.course_price) * 100)
												: 0;
										return (
											<TableRow
												key={d.id}
												className="border-white/5 hover:bg-red-400/5 group/row"
											>
												<TableCell className="py-4">
													<Avatar className="w-10 h-10 border border-white/10 bg-red-400/20">
														<AvatarFallback className="text-red-400 text-sm">
															{initials(d.student_name)}
														</AvatarFallback>
													</Avatar>
												</TableCell>
												<TableCell className="font-medium text-white">
													<p className="truncate max-w-32">{d.student_name}</p>
													<button
														onClick={(e) => {
															e.stopPropagation();
															copyId(d.id);
														}}
														className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 mt-1"
													>
														{copiedId === d.id ? (
															<Check className="w-3 h-3" />
														) : (
															<span className="font-mono">
																#{String(d.id).slice(-4)}
															</span>
														)}
													</button>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="border-amber-400/30 text-amber-400 bg-amber-400/10"
													>
														{d.group_name || "—"}
													</Badge>
												</TableCell>
												<TableCell className="text-right text-gray-300 font-mono text-sm">
													{fmt(d.course_price)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex flex-col items-end gap-1">
														<span className="text-emerald-400 font-mono text-sm">
															{fmt(d.total_paid)}
														</span>
														<span className="text-xs text-gray-500">
															{d.payment_count} to'lov
														</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex flex-col items-end gap-1">
														<span className="text-red-400 font-bold font-mono text-sm">
															{fmt(d.remaining)}
														</span>
														<div className="space-y-1">
															<div className="flex items-center justify-between text-xs">
																<span className="text-gray-400">To'lov</span>
																<span
																	className={`font-semibold ${pct >= 100 ? "text-emerald-400" : "text-amber-400"}`}
																>
																	{pct}%
																</span>
															</div>
															<div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
																<div
																	className="h-full bg-emerald-400 transition-all"
																	style={{ width: `${Math.min(pct, 100)}%` }}
																/>
																<div
																	className="h-full bg-red-400/50"
																	style={{
																		width: `${100 - Math.min(pct, 100)}%`,
																	}}
																/>
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={`border gap-1.5 ${b.c}`}
													>
														<AlertCircle className="w-3 h-3" />
														{b.l}
													</Badge>
												</TableCell>
												<TableCell className="text-gray-400 text-sm flex items-center gap-1.5">
													<Calendar className="w-4 h-4 text-gray-500" />
													{fmtDate(d.last_payment)}
												</TableCell>
												<TableCell className="text-right">
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-gray-500 hover:text-red-400 opacity-0 group-hover/row:opacity-100"
																onClick={(e) => {
																	e.stopPropagation();
																	toast.success("Eslatma yuborildi!");
																}}
															>
																<ExternalLink className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent className="bg-[#1f1f1f] border-white/10 text-white">
															<p>Eslatma yuborish</p>
														</TooltipContent>
													</Tooltip>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Footer */}
				{filtered.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
						<p className="text-sm text-gray-500">
							{filtered.length} ta qarzdor • Jami qarz:{" "}
							<span className="text-red-400 font-semibold">
								{fmt(stats.total)}
							</span>
						</p>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								className="border-white/20 text-gray-300"
							>
								<Calendar className="mr-2 h-4 w-4" />
								Hisobot
							</Button>
							<Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
								<FaMoneyCheckAlt className="mr-2" />
								Jamaviy eslatma
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
