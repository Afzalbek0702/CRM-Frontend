import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Loader from "../components/Loader";
import { useStudent } from "../services/student/useStudent";
import { useGroups } from "../services/group/useGroups";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
} from "@/components/ui/card";
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Ikonkalar
import {
	User, Phone, Calendar, Users, Wallet, Info, ArrowLeft,
	CreditCard, History, MapPin, Mail, GraduationCap, TrendingUp,
	Edit, MoreVertical, ExternalLink, CheckCircle, AlertCircle
} from "lucide-react";
import PhoneUtils from "@/utils/phoneFormat";


export default function StudentDetail() {
   const { id, tenant } = useParams();
	const navigate = useNavigate();
	const { fetchById, loading, error } = useStudent();
	const [student, setStudent] = useState(null);
	const { groups } = useGroups();
	const [fullGroups, setFullGroups] = useState([]);
	const [activeTab, setActiveTab] = useState("info");

	useEffect(() => {
		const loadStudent = async () => {
			const data = await fetchById(id);
			setStudent(data);
			if (data?.group && groups) {
				const mapped = groups.filter((g) => g.id === data.group.id);
				setFullGroups(mapped);
			}
		};
		loadStudent();
	}, [id]);

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!student) return null;
		return {
			balanceStatus: student.balance >= 0 ? "positive" : "negative",
			balanceAbs: Math.abs(student.balance || 0),
			groupsCount: fullGroups.length,
			isActive: student.balance >= 0,
		};
	}, [student, fullGroups]);

	if (loading || !student) return <Loader />;
	if (error) return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="bg-red-500/10 border-red-500/30 p-6 max-w-md w-full backdrop-blur-xl">
				<div className="flex flex-col items-center text-center">
					<div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
						<AlertCircle className="text-red-400 w-8 h-8" />
					</div>
					<h3 className="text-lg font-semibold text-white mb-2">Xatolik yuz berdi</h3>
					<p className="text-red-400/80 text-sm mb-4">{error}</p>
					<Button onClick={() => navigate(-1)} variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
						<ArrowLeft className="mr-2 h-4 w-4" /> Ortga qaytish
					</Button>
				</div>
			</Card>
		</div>
	);

	const formatDate = (d) => d ? String(d).split("T")[0] : "-";
	const formatCurrency = (amount) => `${(amount || 0).toLocaleString()} so'm`;

	// 🎨 Avatar initials
	const getInitials = (name) => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	return (
		<div className="relative min-h-screen bg-background">
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
					</div>
					
					<div className="flex items-center gap-3">
						<Badge 
							variant="outline" 
							className={`border-2 transition-all ${
								stats?.balanceStatus === "positive" 
									? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" 
									: "border-red-500/50 text-red-400 bg-red-500/10"
							}`}
						>
							{stats?.balanceStatus === "positive" ? (
								<CheckCircle className="mr-1.5 h-3 w-3" />
							) : (
								<AlertCircle className="mr-1.5 h-3 w-3" />
							)}
							{stats?.balanceStatus === "positive" ? "Faol" : "Qarzdor"}
						</Badge>
						<Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* 👤 Profile Header Card */}
				<Card className="relative overflow-hidden bg-linear-to-br from-[#1f1f1f] to-[#161616] border-white/10 backdrop-blur-xl group hover:border-amber-400/30 transition-all duration-500">
					<div className="absolute inset-0 bg-linear-to-r from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
					
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row md:items-center gap-6">
							{/* Avatar */}
							<div className="relative group/avatar">
								<Avatar className="w-24 h-24 border-4 border-amber-400/30 ring-4 ring-amber-400/10 transition-all group-hover/avatar:ring-amber-400/30">
									<AvatarImage src={student.avatar} alt={student.full_name} />
									<AvatarFallback className="bg-linear-to-br from-amber-400/20 to-orange-400/20 text-amber-400 text-2xl font-bold">
										{getInitials(student.full_name)}
									</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center border-4 border-[#1f1f1f]">
									<CheckCircle className="text-white w-4 h-4" />
								</div>
							</div>

							{/* Name & Title */}
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl md:text-3xl font-bold text-white truncate">
									{student.full_name}
								</h1>
								<p className="text-gray-400 mt-1 flex items-center gap-2">
									<GraduationCap className="w-4 h-4 text-amber-400" />
									Talaba • ID: <span className="font-mono text-amber-400">#{id.slice(-8)}</span>
								</p>
								
								{/* Quick Stats */}
								<div className="flex flex-wrap gap-4 mt-4">
									<QuickStat 
										icon={<Users className="w-4 h-4" />} 
										label="Guruhlar" 
										value={stats?.groupsCount || 0} 
										color="blue"
									/>
									<QuickStat 
										icon={<Wallet className="w-4 h-4" />} 
										label="Balans" 
										value={formatCurrency(student.balance)} 
										color={stats?.balanceStatus === "positive" ? "emerald" : "red"}
										negative={stats?.balanceStatus === "negative"}
									/>
									<QuickStat 
										icon={<Calendar className="w-4 h-4" />} 
										label="Ro'yxatdan" 
										value={formatDate(student.created_at)} 
										color="purple"
									/>
								</div>
							</div>

							{/* Actions */}
							<div className="flex gap-2">
								<Button className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25">
									<Edit className="mr-2 h-4 w-4" /> Tahrirlash
								</Button>
								<Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
									<ExternalLink className="mr-2 h-4 w-4" /> Hisobot
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Main Content Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="bg-[#1f1f1f]/80 border border-white/10 p-1 backdrop-blur-xl">
						<TabsTrigger value="info" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
							<Info className="mr-2 h-4 w-4" /> Ma'lumotlar
						</TabsTrigger>
						<TabsTrigger value="groups" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
							<Users className="mr-2 h-4 w-4" /> Guruhlar ({fullGroups.length})
						</TabsTrigger>
						<TabsTrigger value="payments" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
							<CreditCard className="mr-2 h-4 w-4" /> To'lovlar
						</TabsTrigger>
						{/* <TabsTrigger value="history" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
							<History className="mr-2 h-4 w-4" /> Tarix
						</TabsTrigger> */}
					</TabsList>

					{/* 📄 Info Tab */}
					<TabsContent value="info" className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							
							{/* Personal Info Card */}
							<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl group hover:border-amber-400/30 transition-all">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-2">
										<div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
											<User className="text-amber-400 w-4 h-4" />
										</div>
										<div>
											<CardTitle className="text-lg text-white">Shaxsiy ma'lumotlar</CardTitle>
											<CardDescription>Kontakt va identifikatsiya ma'lumotlari</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<DetailItem
										icon={<Phone className="w-4 h-4" />}
										label="Telefon raqam"
										value={PhoneUtils.formatPhone(student.phone)}
										copyable
									/>
									<DetailItem
										icon={<Calendar className="w-4 h-4" />}
										label="Tug'ilgan sana"
										value={formatDate(student.birthday)}
									/>
									<DetailItem
										icon={<User className="w-4 h-4" />}
										label="Ota-ona ismi"
										value={student.parents_name || "-"}
									/>
									{student.email && (
										<DetailItem
											icon={<Mail className="w-4 h-4" />}
											label="Email"
											value={student.email}
											copyable
										/>
									)}
									{student.address && (
										<DetailItem
											icon={<MapPin className="w-4 h-4" />}
											label="Manzil"
											value={student.address}
										/>
									)}
								</CardContent>
							</Card>

							{/* Financial Info Card */}
							<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl group hover:border-amber-400/30 transition-all">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-2">
										<div className={`p-2 rounded-lg border ${
											stats?.balanceStatus === "positive" 
												? "bg-emerald-400/10 border-emerald-400/20" 
												: "bg-red-400/10 border-red-400/20"
										}`}>
											<Wallet className={`w-4 h-4 ${
												stats?.balanceStatus === "positive" ? "text-emerald-400" : "text-red-400"
											}`} />
										</div>
										<div>
											<CardTitle className="text-lg text-white">Moliyaviy holat</CardTitle>
											<CardDescription>To'lovlar va balans ma'lumotlari</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									
									{/* Balance Display */}
									<div className={`p-4 rounded-xl border ${
										stats?.balanceStatus === "positive" 
											? "bg-emerald-500/10 border-emerald-500/20" 
											: "bg-red-500/10 border-red-500/20"
									}`}>
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Joriy balans</p>
										<div className="flex items-baseline gap-2">
											<span className={`text-3xl font-bold ${
												stats?.balanceStatus === "positive" ? "text-emerald-400" : "text-red-400"
											}`}>
												{stats?.balanceStatus === "negative" && "-"}
												{formatCurrency(stats?.balanceAbs)}
											</span>
										</div>
										{stats?.balanceStatus === "negative" && (
											<p className="text-xs text-red-400/80 mt-2 flex items-center gap-1">
												<AlertCircle className="w-3 h-3" /> To'lov amalga oshirish tavsiya etiladi
											</p>
										)}
									</div>

									<Separator className="bg-white/10" />

									{/* Quick Actions */}
									<div className="space-y-3">
										<p className="text-xs text-gray-500 uppercase tracking-wider">Tezkor harakatlar</p>
										<div className="grid grid-cols-2 gap-3">
											<Button variant="outline" disabled className="justify-start border-white/20 text-gray-300 hover:bg-white/10 h-auto py-3">
												<CreditCard className="mr-2 h-4 w-4 text-amber-400" />
												<div className="text-left">
													<p className="text-sm font-medium">To'lov qilish</p>
													<p className="text-xs text-gray-500">Onlayn yoki naqd</p>
												</div>
											</Button>
											<Button variant="outline" disabled className="justify-start border-white/20 text-gray-300 hover:bg-white/10 h-auto py-3">
												<History className="mr-2 h-4 w-4 text-blue-400" />
												<div className="text-left">
													<p className="text-sm font-medium">Tarix</p>
													<p className="text-xs text-gray-500">Barcha operatsiyalar</p>
												</div>
											</Button>
										</div>
									</div>

									<Separator className="bg-white/10" />

									{/* Metadata */}
									<div className="space-y-3 text-sm">
										<MetaItem label="Talaba ID" value={`#${id.slice(-8).toUpperCase()}`} />
										<MetaItem label="Ro'yxatdan o'tgan" value={formatDate(student.created_at)} />
										{student.updated_at && (
											<MetaItem label="Oxirgi yangilash" value={formatDate(student.updated_at)} />
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* 👥 Groups Tab */}
					<TabsContent value="groups" className="space-y-4">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<Users className="text-amber-400" />
									Biriktirilgan guruhlar
								</CardTitle>
								<CardDescription>Talaba qatnashayotgan barcha guruhlar</CardDescription>
							</CardHeader>
							<CardContent>
								{fullGroups.length > 0 ? (
									<div className="rounded-lg border border-white/10 overflow-hidden">
										<Table>
											<TableHeader>
												<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
													<TableHead className="text-gray-400">Guruh nomi</TableHead>
													<TableHead className="text-gray-400">Kurs turi</TableHead>
													<TableHead className="text-gray-400 text-right">Narxi</TableHead>
													<TableHead className="text-gray-400">Dars vaqti</TableHead>
													<TableHead className="text-right"></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{fullGroups.map((group, idx) => (
													<TableRow 
														key={group.id} 
														className="border-white/5 hover:bg-amber-400/5 transition-colors cursor-pointer group/row"
														onClick={() => navigate(`/${tenant}/groups/${group.id}`)}
													>
														<TableCell className="font-medium text-white">
															<div className="flex items-center gap-3">
																<div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400/20 to-orange-400/20 flex items-center justify-center text-amber-400 text-xs font-bold">
																	{group.name?.charAt(0).toUpperCase()}
																</div>
																{group.name}
															</div>
														</TableCell>
														<TableCell>
															<Badge variant="outline" className="border-amber-400/30 text-amber-300 bg-amber-400/10">
																{group.course_type}
															</Badge>
														</TableCell>
														<TableCell className="text-right font-semibold text-amber-400">
															{group.price?.toLocaleString()} so'm
														</TableCell>
														<TableCell className="text-gray-400">
															{group.lesson_time}
														</TableCell>
														<TableCell className="text-right">
															<Button variant="ghost" size="icon" className="opacity-0 group-hover/row:opacity-100 transition-opacity text-gray-400 hover:text-amber-400">
																<ExternalLink className="h-4 w-4" />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								) : (
									<EmptyState
										icon={<Users className="w-12 h-12" />}
										title="Guruhlar topilmadi"
										description="Ushbu talaba hozircha hech qanday guruhga biriktirilmagan."
										action={{
											label: "Guruh qo'shish",
											onClick: () => navigate("/groups"),
											icon: <Users className="mr-2 h-4 w-4" />
										}}
									/>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* 💳 Payments Tab (Placeholder) */}
					<TabsContent value="payments">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
							<CardContent className="py-12">
								<EmptyState
									icon={<CreditCard className="w-12 h-12" />}
									title="To'lov tarixi"
									description="Tez orada ushbu bo'limda barcha to'lov operatsiyalari ko'rsatiladi."
								/>
							</CardContent>
						</Card>
					</TabsContent>

					{/* 📜 History Tab (Placeholder) */}
					<TabsContent value="history">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
							<CardContent className="py-12">
								<EmptyState
									icon={<History className="w-12 h-12" />}
									title="Faoliyat tarixi"
									description="Talabaning barcha harakatlari va o'zgarishlari tarixi."
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

// 🧩 Reusable Components

const DetailItem = ({ icon, label, value, valueClass = "", copyable = false }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (copyable && value) {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="group flex items-start justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all duration-300">
			<div className="flex items-start gap-3 min-w-0">
				<span className="text-amber-400/70 mt-0.5">{icon}</span>
				<div className="min-w-0">
					<p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
					<p className={`text-base font-medium text-white truncate ${valueClass}`}>
						{value || "—"}
					</p>
				</div>
			</div>
			{copyable && value && (
				<Button 
					variant="ghost" 
					size="icon" 
					onClick={handleCopy}
					className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-amber-400 h-8 w-8"
					title="Nusxa olish"
				>
					{copied ? (
						<CheckCircle className="h-4 w-4 text-emerald-400" />
					) : (
						<ExternalLink className="h-4 w-4" />
					)}
				</Button>
			)}
		</div>
	);
};

const QuickStat = ({ icon, label, value, color = "gray", negative = false }) => {
	const colors = {
		gray: "text-gray-400",
		blue: "text-sky-400",
		emerald: "text-emerald-400",
		red: "text-red-400",
		purple: "text-violet-400",
		amber: "text-amber-400",
	};

	return (
		<div className="flex items-center gap-2">
			<span className={colors[color]}>{icon}</span>
			<div className="text-left">
				<p className="text-xs text-gray-500">{label}</p>
				<p className={`text-sm font-semibold ${negative ? "text-red-400" : "text-white"}`}>
					{value}
				</p>
			</div>
		</div>
	);
};

const MetaItem = ({ label, value }) => (
	<div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
		<span className="text-gray-500 text-sm">{label}</span>
		<span className="text-white font-mono text-sm">{value}</span>
	</div>
);

const EmptyState = ({ icon, title, description, action }) => (
	<div className="flex flex-col items-center justify-center text-center py-12 px-4">
		<div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
			{icon}
		</div>
		<h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
		<p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>
		{action && (
			<Button onClick={action.onClick} className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black">
				{action.icon}{action.label}
			</Button>
		)}
	</div>
);