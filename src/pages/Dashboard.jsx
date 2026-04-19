import { useDashboard } from "../services/dashboard/useDashboard.js";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import { useLeads } from "@/services/lead/useLeads.js";
import { useAuth } from "../context/authContext";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import PhoneUtils from "@/utils/phoneFormat.js";

// UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import StatsCards from "../components/Statscards";

// Icons
import {
	FaChartLine,
	FaUserGraduate,
	FaBuilding,
} from "react-icons/fa";
import {
	Clock,
	AlertCircle,
	Check,
	Phone,
	Copy,
	Users,
	GraduationCap,
	BookOpen,
	Calendar,
} from "lucide-react";
import Loader from "@/components/Loader.jsx";

export default function Dashboard() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { tenant } = useParams();
	const { students } = useStudent();
	const { groups } = useGroups();
	const { leads } = useLeads();
	const {
		absentStudents,
		monthlyIncome,
		todayLessons,
		groupData,
		studentData,
		debtAnalysis,
		isLoading,
	} = useDashboard();

	const [copiedPhone, setCopiedPhone] = useState(null);
	const [time, setTime] = useState(new Date());
	useEffect(() => {
		const t = setInterval(() => setTime(new Date()), 60000);
		return () => clearInterval(t);
	}, []);

	const copyPhone = async (p) => {
		await navigator.clipboard.writeText(PhoneUtils.formatPhone(p));
		setCopiedPhone(p);
		toast.success("Raqam nusxalandi!");
		setTimeout(() => setCopiedPhone(null), 2000);
	};
	const initials = (n) =>
		n
			? n
				.split(" ")
				.map((p) => p[0])
				.join("")
				.toUpperCase()
			: "?";

	const roleStats = useMemo(() => {
		const base = {
			students: studentData || 0,
			groups: groupData || 0,
			leads: leads?.length || 0,
			absent: absentStudents?.length || 0,
			income: monthlyIncome?.current_month_income || 0,
			debtors: debtAnalysis?.debtorCount || 0,
		};
		const cfg = {
			CEO: [
				{
					data: base.income,
					type: "Oylik Tushum",
					percentage: monthlyIncome?.percentage,
					trend: monthlyIncome?.status,
					color: "amber",
					href: `/${tenant}/payments`,
				},
				{
					data: base.debtors,
					type: "Qarzdorlar",
					percentage: debtAnalysis?.diffPercentage,
					trend: debtAnalysis?.trend,
					color: "red",
					href: `/${tenant}/payments/debtors`,
				},
				{
					data: base.students?.total,
					percentage: studentData?.growth,
					trend: studentData?.status,
					type: "O'quvchilar",
					color: "blue",
					href: `/${tenant}/students`,
				},
				{
					data: base.groups?.total,
					percentage: groupData?.growth,
					trend: groupData?.status,
					type: "Guruhlar",
					color: "purple",
					href: `/${tenant}/groups`,
				},
			],
			ADMIN: [
				{
					data: base.leads,
					type: "Lidlar",
					color: "emerald",
					href: `/${tenant}/leads`,
				},
				{
					data: base.students,
					type: "O'quvchilar",
					color: "blue",
					href: `/${tenant}/students`,
				},
				{ data: base.absent, type: "Bugun kelmaganlar", color: "orange" },
				{
					data: base.groups,
					type: "Guruhlar",
					color: "purple",
					href: `/${tenant}/groups`,
				},
			],
			MANAGER: [
				{
					data: base.leads,
					type: "Lidlar",
					color: "emerald",
					href: `/${tenant}/leads`,
				},
				{
					data:
						students?.filter(s =>
							s.created_at?.startsWith(new Date().toISOString().slice(0, 7)),
						)?.length || 0,
					type: "Yangi o'quvchilar",
					color: "cyan",
				},
				{ data: base.absent, type: "Bugun kelmaganlar", color: "orange" },
				{
					data: base.students?.total,
					type: "Jami O'quvchilar",
					color: "blue",
					href: `/${tenant}/students`,
				},
			],
		};
		return cfg[user?.role] || cfg.ADMIN;
	}, [
		user?.role,
		students,
		studentData,
		groups,
		groupData,
		leads,
		absentStudents,
		monthlyIncome,
		debtAnalysis,
		tenant,
	]);


	const quickActions = useMemo(() => {
		const actions = {
			CEO: [
				{
					icon: <FaChartLine className="w-4 h-4" />,
					label: "To'lovlar",
					href: `/${tenant}/payments`,
					color: "amber",
				},
				{
					icon: <FaUserGraduate className="w-4 h-4" />,
					label: "O'quvchilar",
					href: `/${tenant}/students`,
					color: "blue",
				},
				{
					icon: <FaBuilding className="w-4 h-4" />,
					label: "Guruhlar",
					href: `/${tenant}/groups`,
					color: "purple",
				},
			],
			ADMIN: [
				{
					icon: <Users className="w-4 h-4" />,
					label: "Lidlar",
					href: `/${tenant}/leads`,
					color: "emerald",
				},
				{
					icon: <GraduationCap className="w-4 h-4" />,
					label: "O'quvchilar",
					href: `/${tenant}/students`,
					color: "blue",
				},
				{
					icon: <BookOpen className="w-4 h-4" />,
					label: "Guruhlar",
					href: `/${tenant}/groups`,
					color: "purple",
				},
			],
			MANAGER: [
				{
					icon: <Users className="w-4 h-4" />,
					label: "Yangi lidlar",
					href: `/${tenant}/leads`,
					color: "emerald",
				},
				{
					icon: <GraduationCap className="w-4 h-4" />,
					label: "Ro'yxatdan o'tganlar",
					href: `/${tenant}/students`,
					color: "blue",
				},
				{
					icon: <AlertCircle className="w-4 h-4" />,
					label: "Kelmaganlar",
					href: `/${tenant}/attendance`,
					color: "orange",
				},
			],
		};
		return actions[user?.role] || actions.ADMIN;
	}, [user?.role, tenant]);

	if (isLoading) return <Loader />;

	const colors = {
		amber: "text-amber-400 border-amber-400/30 bg-amber-400/10",
		emerald: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
		blue: "text-sky-400 border-sky-400/30 bg-sky-400/10",
		purple: "text-purple-400 border-purple-400/30 bg-purple-400/10",
		red: "text-red-400 border-red-400/30 bg-red-400/10",
		orange: "text-orange-400 border-orange-400/30 bg-orange-400/10",
	};

	return (
		<div className="relative min-h-99 bg-background p-4">
			<div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{roleStats.map((s, i) => (
						<NavLink to={s.href || "#"} key={i} className="block">
							<StatsCards {...s} />
						</NavLink>
					))}
				</div>

				{/* Tables Grid */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					{/* Today's Lessons */}
					<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
						<CardHeader className="pb-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
										<Clock className="text-amber-400 w-5 h-5" />
									</div>
									<div>
										<CardTitle className="text-white text-lg">
											Bugungi darslar
										</CardTitle>
										<CardDescription className="text-gray-500">
											{time.toLocaleDateString("uz-UZ", {
												weekday: "long",
												day: "numeric",
												month: "long",
											})}
										</CardDescription>
									</div>
								</div>
								<Badge variant="outline" className={colors.amber}>
									{todayLessons?.length || 0} dars
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							{!todayLessons?.length ? (
								<div className="text-center py-12 text-gray-500">
									<Calendar className="w-12 h-12 mx-auto mb-4" />
									<p className="font-semibold text-white">Bugun darslar yo'q</p>
									<p className="text-sm">
										Dam oling yoki rejalashtirish bo'limiga o'ting
									</p>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow className="bg-black/40 border-white/10">
											<TableHead className="text-gray-400">Guruh</TableHead>
											<TableHead className="text-gray-400">
												O'qituvchi
											</TableHead>
											<TableHead className="text-gray-400 text-right">
												Vaqt
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{todayLessons.map((l) => (
											<TableRow
												key={l.id}
												onClick={() => navigate(`/${tenant}/groups/${l.id}`)}
												className="border-white/5 hover:bg-amber-400/5 cursor-pointer group/row"
											>
												<TableCell>
													<p className="font-medium text-white truncate max-w-32">
														{l.group_name}
													</p>
													<p className="text-xs text-gray-500 italic">
														{l.course_type}
													</p>
												</TableCell>
												<TableCell className="text-gray-300 text-sm">
													<div className="flex items-center gap-2">
														<Avatar className="w-6 h-6 border border-white/10">
															<AvatarFallback className="text-xs bg-amber-400/20 text-amber-400">
																{initials(l.teacher_name)}
															</AvatarFallback>
														</Avatar>
														<span className="truncate max-w-24">
															{l.teacher_name}
														</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<Badge
														variant="outline"
														className={`${colors.amber} font-mono text-xs`}
													>
														{l.lesson_time}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>

					{/* Absent Students */}
					<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
						<CardHeader className="pb-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-lg border ${absentStudents?.length ? "bg-red-400/10 border-red-400/20" : "bg-emerald-400/10 border-emerald-400/20"}`}
									>
										{absentStudents?.length ? (
											<AlertCircle className="text-red-400 w-5 h-5" />
										) : (
											<Check className="text-emerald-400 w-5 h-5" />
										)}
									</div>
									<div>
										<CardTitle className="text-white text-lg">
											{absentStudents?.length
												? "Bugun kelmaganlar"
												: "Davomat a'lo!"}
										</CardTitle>
										<CardDescription className="text-gray-500">
											{absentStudents?.length
												? `${absentStudents.length} o'quvchi darsga kelmadi`
												: "Barcha o'quvchilar bugun darsda ✓"}
										</CardDescription>
									</div>
								</div>
								{absentStudents?.length > 0 && (
									<Badge
										variant="outline"
										className="border-red-400/30 text-red-400 bg-red-400/10 animate-pulse"
									>
										{absentStudents.length}
									</Badge>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{!absentStudents?.length ? (
								<div className="text-center py-12 text-gray-500">
									<Check className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
									<p className="font-semibold text-white">Hamma darsda! 🎉</p>
									<p className="text-sm">A'lo natija! Davomat 100%</p>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow className="bg-black/40 border-white/10">
											<TableHead className="text-gray-400">O'quvchi</TableHead>
											<TableHead className="text-gray-400">Guruh</TableHead>
											<TableHead className="text-gray-400 text-right">
												Aloqa
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{absentStudents.map((s) => (
											<TableRow
												key={s.student_id}
												onClick={() =>
													navigate(`/${tenant}/groups/${s.group_id}`)
												}
												className="border-white/5 hover:bg-red-400/5 cursor-pointer group/row"
											>
												<TableCell className="font-medium text-white">
													<div className="flex items-center gap-3">
														<Avatar className="w-8 h-8 border border-white/10 bg-red-400/20">
															<AvatarFallback className="text-red-400 text-xs">
																{initials(s.full_name)}
															</AvatarFallback>
														</Avatar>
														<span className="truncate max-w-28">
															{s.full_name}
														</span>
													</div>
												</TableCell>
												<TableCell className="text-gray-400 text-sm">
													<Badge
														variant="outline"
														className="border-white/20 text-gray-300 text-xs"
													>
														{s.group_name}
													</Badge>
												</TableCell>
												<TableCell>
													<Tooltip>
														<TooltipTrigger asChild>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	copyPhone(s.phone);
																}}
																className="flex items-center justify-end gap-1.5 text-gray-300 hover:text-amber-400"
															>
																<span className="font-mono text-sm">
																	{PhoneUtils.formatPhone(s.phone)}
																</span>
																{copiedPhone === s.phone ? (
																	<Check className="w-4 h-4 text-emerald-400" />
																) : (
																	<Phone className="w-4 h-4" />
																)}
															</button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Nusxa olish</p>
														</TooltipContent>
													</Tooltip>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
