import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Loader from "../components/Loader";
import { useWorker } from "../services/worker/useWorker";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
	ArrowLeft,
	Briefcase,
	Phone,
	Banknote,
	Users,
	Calendar,
	Layers,
	Mail,
	MapPin,
	Clock,
	Edit,
	MoreVertical,
	ExternalLink,
	CheckCircle,
	AlertCircle,
	Wallet,
	Star,
} from "lucide-react";
import PhoneUtils from "@/utils/phoneFormat";

export default function WorkerDetail() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { workerData, isLoading, error } = useWorker();
	const [activeTab, setActiveTab] = useState("info");

	const worker = useMemo(() => {
		if (!id || !Array.isArray(workerData)) return null;
		return workerData.find(w => String(w.id) === String(id));
	}, [id, workerData]);

	// 📊 Stats calculations
	const stats = useMemo(() => {
		if (!worker) return null;
		return {
			groupsCount: worker.groups?.length || 0,
			salaryFormatted: Number(worker.salary).toLocaleString(),
			isActive: worker.status !== "inactive",
		};
	}, [worker]);

	if (isLoading) return <Loader />;
	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="bg-red-500/10 border-red-500/30 p-6 max-w-md w-full backdrop-blur-xl">
					<div className="flex flex-col items-center text-center">
						<div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
							<AlertCircle className="text-red-400 w-8 h-8" />
						</div>
						<h3 className="text-lg font-semibold text-white mb-2">
							Xatolik yuz berdi
						</h3>
						<p className="text-red-400/80 text-sm mb-4">{String(error)}</p>
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
	if (!worker)
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="bg-[#1f1f1f] border-white/10 p-8 max-w-md w-full text-center">
					<Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
					<h3 className="text-lg font-semibold text-white mb-2">
						Ishchi topilmadi
					</h3>
					<p className="text-gray-500 text-sm mb-4">
						So'ralgan ID ga mos xodim mavjud emas.
					</p>
					<Button onClick={() => navigate(-1)} variant="outline">
						Ortga qaytish
					</Button>
				</Card>
			</div>
		);

	// 🎨 Avatar initials
	const getInitials = name => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

	return (
		<div className="relative min-h-screen bg-background">
			{/* <AnimatedBackground /> */}

			<div className="container mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
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
							className="border-amber-400/50 text-amber-400 bg-amber-400/10 font-mono"
						>
							ID: #{worker.id}
						</Badge>
						<Badge
							variant="outline"
							className={`border-2 ${worker.status === "active" ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" : "border-gray-500/50 text-gray-400 bg-gray-500/10"}`}
						>
							{worker.status === "active" ? (
								<CheckCircle className="mr-1.5 h-3 w-3" />
							) : (
								<AlertCircle className="mr-1.5 h-3 w-3" />
							)}
							{worker.status === "active" ? "Faol" : "Nofaol"}
						</Badge>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* 👤 Profile Header Card */}
				<Card className="relative overflow-hidden bg-linear-to-br from-[#1f1f1f] to-[#161616] border-white/10 backdrop-blur-xl group hover:border-amber-400/30 transition-all duration-200">
					<div className="absolute inset-0 bg-linear-to-r from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row md:items-center gap-6">
							{/* Avatar */}
							<div className="relative group/avatar">
								<Avatar className="w-24 h-24 border-4 border-amber-400/30 ring-4 ring-amber-400/10 transition-all group-hover/avatar:ring-amber-400/30">
									<AvatarImage src={worker.avatar} alt={worker.full_name} />
									<AvatarFallback className="bg-linear-to-br from-amber-400/20 to-orange-400/20 text-amber-400 text-2xl font-bold">
										{getInitials(worker.full_name)}
									</AvatarFallback>
								</Avatar>
								{worker.status === "active" && (
									<div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center border-4 border-[#1f1f1f]">
										<CheckCircle className="text-white w-4 h-4" />
									</div>
								)}
							</div>

							{/* Name & Title */}
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl md:text-3xl font-bold text-white capitalize">
									{worker.full_name}
								</h1>
								<p className="text-amber-400 font-medium mt-1 flex items-center gap-2">
									<Briefcase className="w-4 h-4" />
									{worker.position}
								</p>
								<p className="text-gray-400 mt-2 flex flex-wrap gap-4 text-sm">
									<span className="flex items-center gap-1.5">
										<Phone className="w-4 h-4 text-amber-400/70" />
										{PhoneUtils.formatPhone(worker.phone)}
									</span>
									{worker.email && (
										<span className="flex items-center gap-1.5">
											<Mail className="w-4 h-4 text-amber-400/70" />
											{worker.email}
										</span>
									)}
								</p>

								{/* Quick Stats */}
								<div className="flex flex-wrap gap-4 mt-4">
									<QuickStat
										icon={<Users className="w-4 h-4" />}
										label="Guruhlar"
										value={`${stats?.groupsCount} ta`}
										color="blue"
									/>
									<QuickStat
										icon={<Banknote className="w-4 h-4" />}
										label="Maosh"
										value={`${stats?.salaryFormatted} ${worker.salary_type}`}
										color="emerald"
									/>
									<QuickStat
										icon={<Calendar className="w-4 h-4" />}
										label="Ish boshladi"
										value={worker.start_date?.split("T")[0] || "—"}
										color="purple"
									/>
								</div>
							</div>

							{/* Actions */}
							<div className="flex gap-2">
								<Button className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25">
									<Edit className="mr-2 h-4 w-4" /> Tahrirlash
								</Button>
								<Button
									variant="outline"
									className="border-white/20 text-gray-300 hover:bg-white/10"
								>
									<ExternalLink className="mr-2 h-4 w-4" /> Hisobot
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 📋 Main Content Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="bg-[#1f1f1f]/80 border border-white/10 p-1 backdrop-blur-xl">
						<TabsTrigger
							value="info"
							className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
						>
							<Briefcase className="mr-2 h-4 w-4" /> Ma'lumotlar
						</TabsTrigger>
						<TabsTrigger
							value="groups"
							className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
						>
							<Layers className="mr-2 h-4 w-4" /> Guruhlar ({stats?.groupsCount}
							)
						</TabsTrigger>
						<TabsTrigger
							value="schedule"
							className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
						>
							<Clock className="mr-2 h-4 w-4" /> Jadval
						</TabsTrigger>
					</TabsList>

					{/* 📄 Info Tab */}
					<TabsContent value="info" className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							{/* Personal Info Card */}
							<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl group hover:border-amber-400/30 transition-all">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-2">
										<div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
											<UserIcon className="text-amber-400 w-4 h-4" />
										</div>
										<div>
											<CardTitle className="text-lg text-white">
												Shaxsiy ma'lumotlar
											</CardTitle>
											<CardDescription>
												Kontakt va ish ma'lumotlari
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<DetailItem
										icon={<Phone className="w-4 h-4" />}
										label="Telefon"
										value={PhoneUtils.formatPhone(worker.phone)}
										copyable
									/>
									{worker.email && (
										<DetailItem
											icon={<Mail className="w-4 h-4" />}
											label="Email"
											value={worker.email}
											copyable
										/>
									)}
									{worker.address && (
										<DetailItem
											icon={<MapPin className="w-4 h-4" />}
											label="Manzil"
											value={worker.address}
										/>
									)}
									<DetailItem
										icon={<Calendar className="w-4 h-4" />}
										label="Ishga qabul"
										value={worker.start_date?.split("T")[0] || "—"}
									/>
									<DetailItem
										icon={<Briefcase className="w-4 h-4" />}
										label="Lavozim"
										value={worker.position}
									/>
								</CardContent>
							</Card>

							{/* Financial Info Card */}
							<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl group hover:border-amber-400/30 transition-all">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-2">
										<div className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
											<Wallet className="text-emerald-400 w-4 h-4" />
										</div>
										<div>
											<CardTitle className="text-lg text-white">
												Moliyaviy ma'lumot
											</CardTitle>
											<CardDescription>
												Maosh va to'lov shartlari
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Salary Display */}
									<div className="p-4 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
										<p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
											Oylik maosh
										</p>
										<div className="flex items-baseline gap-2">
											<span className="text-3xl font-bold text-emerald-400">
												{stats?.salaryFormatted}
											</span>
											<span className="text-emerald-400/70">
												{worker.salary_type}
											</span>
										</div>
										{worker.bonus && (
											<p className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1">
												<Star className="w-3 h-3" /> Bonus:{" "}
												{worker.bonus.toLocaleString()} so'm
											</p>
										)}
									</div>

									<Separator className="bg-white/10" />

									{/* Work Schedule */}
									<div className="space-y-3">
										<p className="text-xs text-gray-500 uppercase tracking-wider">
											Ish rejasi
										</p>
										<div className="grid grid-cols-2 gap-3">
											<ScheduleItem
												label="Rejim"
												value="Full-time"
												icon={<Clock className="w-4 h-4 text-blue-400" />}
											/>
											<ScheduleItem
												label="Kunlar"
												value={worker.work_days || "Dush-Juma"}
												icon={<Calendar className="w-4 h-4 text-purple-400" />}
											/>
											<ScheduleItem
												label="Vaqt"
												value={worker.work_hours || "09:00 - 18:00"}
												icon={<Clock className="w-4 h-4 text-amber-400" />}
											/>
											<ScheduleItem
												label="Tugash"
												value={
													worker.end_date ? worker.end_date.split("T")[0] : "—"
												}
												icon={<Calendar className="w-4 h-4 text-gray-400" />}
											/>
										</div>
									</div>

									<Separator className="bg-white/10" />

									{/* Metadata */}
									<div className="space-y-3 text-sm">
										<MetaItem
											label="Xodim ID"
											value={`#${String(worker.id).slice(-8).toUpperCase()}`}
										/>
										{worker.created_at && (
											<MetaItem
												label="Ro'yxatdan"
												value={worker.created_at.split("T")[0]}
											/>
										)}
										{worker.updated_at && (
											<MetaItem
												label="Oxirgi yangilash"
												value={worker.updated_at.split("T")[0]}
											/>
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
									<Layers className="text-amber-400" />
									Biriktirilgan guruhlar
								</CardTitle>
								<CardDescription>
									{worker.full_name} mas'ul bo'lgan barcha guruhlar
								</CardDescription>
							</CardHeader>
							<CardContent>
								{worker.groups && worker.groups.length > 0 ? (
									<div className="rounded-lg border border-white/10 overflow-hidden">
										<Table>
											<TableHeader>
												<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
													<TableHead className="text-gray-400">
														Guruh nomi
													</TableHead>
													<TableHead className="text-gray-400">
														Kurs turi
													</TableHead>
													<TableHead className="text-gray-400 text-right">
														Narxi
													</TableHead>
													<TableHead className="text-gray-400">
														Dars vaqti
													</TableHead>
													<TableHead className="text-right"></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{worker.groups.map(group => (
													<TableRow
														key={group.id}
														className="border-white/5 hover:bg-amber-400/5 transition-colors cursor-pointer group/row"
														onClick={() => navigate(`/groups/${group.id}`)}
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
															<Badge
																variant="outline"
																className="border-amber-400/30 text-amber-300 bg-amber-400/10"
															>
																{group.course_type}
															</Badge>
														</TableCell>
														<TableCell className="text-right font-semibold text-amber-400">
															{Number(group.price).toLocaleString()} so'm
														</TableCell>
														<TableCell className="text-gray-400">
															{group.lesson_time}
														</TableCell>
														<TableCell className="text-right">
															<Button
																variant="ghost"
																size="icon"
																className="opacity-0 group-hover/row:opacity-100 transition-opacity text-gray-400 hover:text-amber-400"
															>
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
										icon={<Layers className="w-12 h-12" />}
										title="Guruhlar topilmadi"
										description="Ushbu xodimga hozircha hech qanday guruh biriktirilmagan."
										action={{
											label: "Guruh biriktirish",
											onClick: () => navigate("/groups"),
											icon: <Layers className="mr-2 h-4 w-4" />,
										}}
									/>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* 📅 Schedule Tab (Placeholder) */}
					<TabsContent value="schedule">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
							<CardContent className="py-12">
								<EmptyState
									icon={<Clock className="w-12 h-12" />}
									title="Ish jadvali"
									description="Tez orada ushbu bo'limda xodimning haftalik ish jadvali ko'rsatiladi."
									action={{
										label: "Jadval tuzish",
										onClick: () => {},
										icon: <Calendar className="mr-2 h-4 w-4" />,
									}}
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

const UserIcon = ({ className }) => (
	<svg
		className={className}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
);

const DetailItem = ({
	icon,
	label,
	value,
	valueClass = "",
	copyable = false,
}) => {
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
					<p className="text-xs text-gray-500 uppercase tracking-wider">
						{label}
					</p>
					<p
						className={`text-base font-medium text-white truncate ${valueClass}`}
					>
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

const QuickStat = ({ icon, label, value, color = "gray" }) => {
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
				<p className="text-sm font-semibold text-white">{value}</p>
			</div>
		</div>
	);
};

const ScheduleItem = ({ label, value, icon }) => (
	<div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
		{icon}
		<div>
			<p className="text-xs text-gray-500">{label}</p>
			<p className="text-sm font-medium text-white">{value}</p>
		</div>
	</div>
);

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
			<Button
				onClick={action.onClick}
				className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black"
			>
				{action.icon}
				{action.label}
			</Button>
		)}
	</div>
);
