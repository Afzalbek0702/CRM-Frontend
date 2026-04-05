import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
	FaEllipsisV,
	FaThList,
	FaSearch,
	FaEdit,
	FaTrash,
	FaUserTag,
	FaChartLine,
	FaClock,
} from "react-icons/fa";

// UI Components
import Loader from "../components/Loader";
import LeadModal from "../components/LeadModal";
import { Button } from "@/components/ui/button";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Hooks & Utils
import { useLeads } from "../services/lead/useLeads";
import { useCourse } from "../services/course/useCourse";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import {
	ArrowLeft,
	BookOpen,
	Globe,
	MessageSquare,
	Phone,
	Plus,
	User,
	UserPlus,
	Copy,
	Check,
	Sparkles,
	TrendingUp,
	Filter,
} from "lucide-react";
import AddToGroupModal from "@/components/AddToGroupModal";
import PhoneUtils from "@/utils/phoneFormat";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// 🎨 Animated Background Component
const AnimatedBackground = () => (
	<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
		<div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
		<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 rounded-full blur-3xl" />
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
			className={`bg-gradient-to-br ${colors[color]} border backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300`}
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

export default function Leads() {
	const navigate = useNavigate();

	const {
		leads,
		isLoading,
		createLead,
		updateLead,
		deleteLead,
		convertLeadToGroup,
		convertLeadToStudent,
	} = useLeads();
	const { courseData } = useCourse();

	const [searchTerm, setSearchTerm] = useState("");
	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);
	const [convertModal, setConvertModal] = useState({
		isOpen: false,
		leadData: null,
	});
	const [copiedPhone, setCopiedPhone] = useState(null);

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!leads) return { total: 0, new: 0, converted: 0 };
		return {
			total: leads.length,
			new: leads.filter((l) => !l.converted_at).length,
			converted: leads.filter((l) => l.converted_at).length,
		};
	}, [leads]);

	// Qidiruvni optimallashtirish
	const filteredLeads = useMemo(() => {
		return (leads || []).filter(
			(l) =>
				l.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				l.phone?.includes(searchTerm) ||
				l.source?.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [leads, searchTerm]);

	const handleConfirmDelete = () => {
		if (deleteId) {
			deleteLead(deleteId);
			setDeleteId(null);
			toast.success("Lid muvaffaqiyatli o'chirildi");
		}
	};

	const handleCopyPhone = async (phone) => {
		await navigator.clipboard.writeText(phone);
		setCopiedPhone(phone);
		toast.success("Raqam nusxalandi!");
		setTimeout(() => setCopiedPhone(null), 2000);
	};

	const handleConvertToGroup = (groupId) => {
		if (convertModal.leadData && groupId) {
			convertLeadToGroup({
				id: convertModal.leadData.id,
				group_id: groupId,
			});
			setConvertModal({ isOpen: false, leadData: null });
			toast.success("Lid guruhga o'tkazildi!");
		}
	};

	// 🎨 Avatar initials
	const getInitials = (name) => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	// 🎨 Source badge color
	const getSourceColor = (source) => {
		const colors = {
			Instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
			Telegram: "bg-sky-500/20 text-sky-400 border-sky-500/30",
			Website: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
			Phone: "bg-amber-500/20 text-amber-400 border-amber-500/30",
			Referral: "bg-purple-500/20 text-purple-400 border-purple-500/30",
		};
		return colors[source] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
								Lidlar boshqaruvi
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Potensial mijozlarni kuzatib boring
							</p>
						</div>
					</div>

					<Button
						onClick={() => setModal({ isOpen: true, data: null })}
						className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2 font-semibold"
					>
						<Plus className="h-4 w-4" /> Yangi lid qo'shish
					</Button>
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<StatsCard
						icon={<FaUserTag className="w-5 h-5" />}
						label="Jami lidlar"
						value={stats.total}
						color="amber"
					/>
					<StatsCard
						icon={<Sparkles className="w-5 h-5" />}
						label="Yangi lidlar"
						value={stats.new}
						trend={12}
						color="emerald"
					/>
					<StatsCard
						icon={<FaChartLine className="w-5 h-5" />}
						label="Konvertatsiya"
						value={`${stats.total ? Math.round((stats.converted / stats.total) * 100) : 0}%`}
						color="blue"
					/>
				</div>

				{/* 🔍 Search & Filters */}
				<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
					<CardContent className="p-4">
						<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
							<InputGroup className="max-w-md focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400/50 transition-all">
								<InputGroupInput
									placeholder="Ism, telefon yoki manba bo'yicha qidirish..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="bg-transparent text-white placeholder:text-gray-500 border-0 focus:ring-0"
								/>
								<InputGroupAddon className="text-gray-500">
									<FaSearch />
								</InputGroupAddon>
							</InputGroup>

							<div className="flex items-center gap-2 ">
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
									{filteredLeads.length} natija
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Leads Table */}
				<Card className="bg-card/80 backdrop-blur-xl overflow-hidden py-0">
					<Table>
						<TableHeader>
							<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
								<TableHead className="w-12"></TableHead>
								<TableHead>
									<div className="flex items-center gap-2 text-gray-400">
										<User className="h-4 w-4" /> Ism
									</div>
								</TableHead>
								<TableHead>
									<div className="flex items-center gap-2 text-gray-400">
										<Phone className="h-4 w-4" /> Telefon
									</div>
								</TableHead>
								<TableHead>
									<div className="flex items-center gap-2 text-gray-400">
										<Globe className="h-4 w-4" /> Manba
									</div>
								</TableHead>
								<TableHead>
									<div className="flex items-center gap-2 text-gray-400">
										<BookOpen className="h-4 w-4" /> Kurs
									</div>
								</TableHead>
								<TableHead className="max-w-40">
									<div className="flex items-center gap-2 text-gray-400">
										<MessageSquare className="h-4 w-4" /> Izoh
									</div>
								</TableHead>
								<TableHead className="text-right w-20">Amallar</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredLeads.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="py-16">
										<EmptyState
											onAddNew={() => setModal({ isOpen: true, data: null })}
											hasSearch={!!searchTerm}
										/>
									</TableCell>
								</TableRow>
							) : (
								filteredLeads.map((l, idx) => (
									<TableRow
										key={l.id}
										className="bg-card hover:bg-card/50 transition-all duration-200 group/row"
									>
										<TableCell className="py-4">
											<Avatar className="w-10 h-10 border border-white/10 bg-gradient-to-br from-amber-400/20 to-orange-400/20">
												<AvatarFallback className="text-amber-400 text-sm font-semibold bg-transparent">
													{getInitials(l.full_name)}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell className="font-medium text-white">
											<div>
												<p className="truncate max-w-32">{l.full_name}</p>
												{l.converted_at && (
													<Badge
														variant="outline"
														className="mt-1 text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
													>
														<Check className="w-3 h-3 mr-1" /> Konvertatsiya
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleCopyPhone(PhoneUtils.formatPhone(l.phone));
												}}
												className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition-colors group/btn"
											>
												<span className="">
													{PhoneUtils.formatPhone(l.phone)}
												</span>
												{copiedPhone === PhoneUtils.formatPhone(l.phone) ? (
													<Check className="w-4 h-4 text-emerald-400" />
												) : (
													<Copy className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
												)}
											</button>
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={`border ${getSourceColor(l.source)}`}
											>
												{l.source || "—"}
											</Badge>
										</TableCell>
										<TableCell className="text-gray-300">
											{courseData.find((c) => c.name === l.interested_course)
												?.name || <span className="text-gray-500">—</span>}
										</TableCell>
										<TableCell className="max-w-40">
											<p
												className="text-gray-400 text-sm truncate"
												title={l.comment}
											>
												{l.comment || (
													<span className="text-gray-600 italic">
														Izoh yo'q
													</span>
												)}
											</p>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors opacity-0 group-hover/row:opacity-100"
													>
														<FaEllipsisV />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="bg-[#1f1f1f] border-white/10 text-white w-52"
												>
													<DropdownMenuItem
														onClick={() => setModal({ isOpen: true, data: l })}
														className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
													>
														<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
													</DropdownMenuItem>
													<DropdownMenuSeparator className="bg-white/10" />
													<DropdownMenuItem
														onClick={() =>
															setConvertModal({ isOpen: true, leadData: l })
														}
														className="cursor-pointer hover:bg-emerald-400/10 focus:bg-emerald-400/10"
													>
														<UserPlus className="mr-2 h-4 w-4 text-emerald-400" />{" "}
														Guruhga o'tkazish
													</DropdownMenuItem>
													<DropdownMenuSeparator className="bg-white/10" />
													<DropdownMenuItem
														onClick={() => setDeleteId(l.id)}
														className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
													>
														<FaTrash className="mr-2" /> O'chirish
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

				{/* 📄 Pagination (Optional placeholder) */}
				{filteredLeads.length > 0 && (
					<div className="flex items-center justify-between text-sm text-gray-500">
						<p>{filteredLeads.length} lid ko'rsatilmoqda</p>
						<div className="flex items-center gap-2 ">
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
			<LeadModal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false, data: null })}
				initialData={modal.data}
				onSubmit={async (data) => {
					if (modal.data) {
						await updateLead({ id: modal.data.id, data });
						toast.success("Lid yangilandi!");
					} else {
						await createLead(data);
						toast.success("Yangi lid qo'shildi!");
					}
					setModal({ isOpen: false, data: null });
				}}
			/>

			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="Lidni o'chirish"
				description="Haqiqatdan ham ushbu lidni o'chirib tashlamoqchimisiz? Bu amal bekor qilinmaydi."
			/>

			<AddToGroupModal
				isOpen={convertModal.isOpen}
				onClose={() => setConvertModal({ isOpen: false, leadData: null })}
				onConfirm={handleConvertToGroup}
				initialData={convertModal.leadData}
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
				<FaUserTag className="w-8 h-8" />
			)}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">
			{hasSearch ? "Natija topilmadi" : "Lidlar yo'q"}
		</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">
			{hasSearch
				? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
				: "Hozircha hech qanday lid mavjud emas. Yangi lid qo'shishni boshlang!"}
		</p>
		{!hasSearch && (
			<Button
				onClick={onAddNew}
				className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2"
			>
				<Plus className="w-4 h-4" /> Birinchi lidni qo'shish
			</Button>
		)}
	</div>
);
