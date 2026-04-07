import { useState, useMemo } from "react";
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Shadcn UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Ikonkalar
import {
	Plus,
	Edit2,
	Trash2,
	ArrowLeft,
	BookOpen,
	DoorOpen,
	Users,
	Wallet,
	Layers,
	Settings as SettingsIcon,
	Clock,
	CalendarRange,
	UsersRound,
	Check,
	ExternalLink,
	TrendingUp,
	MoreHorizontal,
	Save,
	X,
} from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { getUzDays } from "@/utils/weekday";

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

// 🎨 Day Pill Component
const DayPill = ({ day, isToday = false }) => (
	<span
		className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200
			${
				isToday
					? "bg-linear-to-r from-amber-400 to-orange-400 text-black shadow-lg shadow-amber-500/25"
					: "bg-white/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20"
			}`}
	>
		{day}
	</span>
);

export default function Settings() {
	const { courseData, isLoading, createCourse, updateCourse, removeCourse } =
		useCourse();
	const {
		roomData,
		isLoading: roomLoading,
		createRoom,
		updateRoom,
		removeRoom,
	} = useRoom();
	const navigate = useNavigate();

	// Modallar uchun holat
	const [courseModal, setCourseModal] = useState({ open: false, data: null });
	const [roomModal, setRoomModal] = useState({ open: false, data: null });
	const [deleteId, setDeleteId] = useState({ id: null, type: null });
	const [copiedId, setCopiedId] = useState(null);
	const [activeTab, setActiveTab] = useState("courses");

	// 📊 Stats calculations
	const stats = useMemo(() => {
		return {
			courses: courseData?.length || 0,
			rooms: roomData?.length || 0,
			occupiedRooms: roomData?.filter((r) => r.group_name).length || 0,
			totalCapacity:
				roomData?.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0) || 0,
		};
	}, [courseData, roomData]);

	if (isLoading || roomLoading) return <Loader />;

	const handleConfirmDelete = () => {
		if (deleteId.type === "course") {
			removeCourse(deleteId.id);
		} else if (deleteId.type === "room") {
			removeRoom(deleteId.id);
		}
		setDeleteId({ id: null, type: null });
	};

	const handleCourseSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);

		if (courseModal.data) {
			updateCourse({ id: courseModal.data.id, data });
		} else {
			createCourse(data);
		}
		setCourseModal({ open: false, data: null });
	};

	const handleRoomSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = {
			name: formData.get("name"),
			capacity: formData.get("capacity"),
		};

		if (roomModal.data) {
			updateRoom({ id: roomModal.data.room_id, data });
		} else {
			createRoom(data);
		}
		setRoomModal({ open: false, data: null });
	};

	const handleCopyId = async (id, type) => {
		await navigator.clipboard.writeText(String(id));
		setCopiedId(`${type}-${id}`);
		toast.success("ID nusxalandi!");
		setTimeout(() => setCopiedId(null), 2000);
	};

	// 🎨 Avatar initials
	const getInitials = (name) => {
		if (!name) return "?";
		const parts = name.split(" ");
		return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
	};

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
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
								Sozlamalar
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Kurslar va xonalarni boshqaring
							</p>
						</div>
					</div>
				</div>

				{/* 📊 Stats Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
					<StatsCard
						icon={<BookOpen className="w-5 h-5" />}
						label="Jami kurslar"
						value={stats.courses}
						color="amber"
					/>
					<StatsCard
						icon={<DoorOpen className="w-5 h-5" />}
						label="Jami xonalar"
						value={stats.rooms}
						color="blue"
					/>
					{/* <StatsCard
						icon={<UsersRound className="w-5 h-5" />}
						label="Band xonalar"
						value={stats.occupiedRooms}
						color="emerald"
					/> */}
					<StatsCard
						icon={<Users className="w-5 h-5" />}
						label="Jami sig'im"
						value={stats.totalCapacity}
						color="purple"
					/>
				</div>

				{/* 📋 Main Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="bg-[#1f1f1f]/80 border border-white/10 p-1 backdrop-blur-xl w-full max-w-md mx-auto lg:mx-0">
						<TabsTrigger
							value="courses"
							className="data-[state=active]:bg-amber-400 data-[state=active]:text-black gap-2"
						>
							<BookOpen className="h-4 w-4" /> Kurslar
						</TabsTrigger>
						<TabsTrigger
							value="rooms"
							className="data-[state=active]:bg-amber-400 data-[state=active]:text-black gap-2"
						>
							<DoorOpen className="h-4 w-4" /> Xonalar
						</TabsTrigger>
					</TabsList>

					{/* --- KURSLAR PANEL --- */}
					<TabsContent value="courses" className="space-y-4">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
							<CardHeader className="pb-4">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div>
										<CardTitle className="text-white flex items-center gap-2">
											<BookOpen className="text-amber-400" />
											Barcha kurslar
										</CardTitle>
										<CardDescription>
											O'quv kurslari ro'yxati va narxlari
										</CardDescription>
									</div>
									<Button
										onClick={() => setCourseModal({ open: true, data: null })}
										className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2"
									>
										<Plus className="h-4 w-4" /> Kurs qo'shish
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{courseData.length === 0 ? (
									<EmptyState
										type="course"
										onAddNew={() => setCourseModal({ open: true, data: null })}
									/>
								) : (
									<div className="rounded-lg border border-white/10 overflow-hidden">
										<Table>
											<TableHeader>
												<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
													<TableHead className="text-gray-400 w-12"></TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<BookOpen className="h-4 w-4" /> Kurs nomi
														</div>
													</TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<Wallet className="h-4 w-4" /> Narxi
														</div>
													</TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<Layers className="h-4 w-4" /> Darslar
														</div>
													</TableHead>
													<TableHead className="text-gray-400 text-right w-20">
														Amallar
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{courseData.map((course) => (
													<TableRow
														key={course.id}
														className="border-white/5 hover:bg-amber-400/5 transition-all duration-200 group/row"
													>
														<TableCell className="py-4">
															<Avatar className="w-10 h-10 border border-white/10 bg-linear-to-br from-amber-400/20 to-orange-400/20">
																<AvatarFallback className="text-amber-400 text-sm font-semibold bg-transparent">
																	{getInitials(course.name)}
																</AvatarFallback>
															</Avatar>
														</TableCell>
														<TableCell className="font-medium text-white">
															<div>
																<p className="truncate max-w-40">
																	{course.name}
																</p>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleCopyId(course.id, "course");
																	}}
																	className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-amber-400 transition-colors mt-1"
																>
																	{copiedId === `course-${course.id}` ? (
																		<Check className="w-3 h-3" />
																	) : (
																		<span className="font-mono">
																			#{String(course.id).slice(-4)}
																		</span>
																	)}
																</button>
															</div>
														</TableCell>
														<TableCell className="font-semibold text-amber-400">
															{Number(course.price).toLocaleString()} so'm
														</TableCell>
														<TableCell className="text-gray-300">
															<Badge
																variant="outline"
																className="border-amber-400/30 text-amber-400 bg-amber-400/10"
															>
																{course.lesson_count} ta
															</Badge>
														</TableCell>
														<TableCell className="text-right">
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8 text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors opacity-0 group-hover/row:opacity-100"
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
																			setCourseModal({
																				open: true,
																				data: course,
																			})
																		}
																		className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
																	>
																		<Edit2 className="mr-2 h-4 w-4 text-blue-400" />{" "}
																		Tahrirlash
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			navigate(`/courses/${course.id}`)
																		}
																		className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
																	>
																		<ExternalLink className="mr-2 h-4 w-4 text-purple-400" />{" "}
																		Batafsil
																	</DropdownMenuItem>
																	<DropdownMenuSeparator className="bg-white/10" />
																	<DropdownMenuItem
																		onClick={() =>
																			setDeleteId({
																				id: course.id,
																				type: "course",
																			})
																		}
																		className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
																	>
																		<Trash2 className="mr-2 h-4 w-4" />{" "}
																		O'chirish
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
					</TabsContent>

					{/* --- XONALAR PANEL --- */}
					<TabsContent value="rooms" className="space-y-4">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl">
							<CardHeader className="pb-4">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div>
										<CardTitle className="text-white flex items-center gap-2">
											<DoorOpen className="text-amber-400" />
											O'quv xonalari
										</CardTitle>
										<CardDescription>
											Xonalar va ularning bandlik holati
										</CardDescription>
									</div>
									<Button
										onClick={() => setRoomModal({ open: true, data: null })}
										className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2"
									>
										<Plus className="h-4 w-4" /> Xona qo'shish
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{roomData.length === 0 ? (
									<EmptyState
										type="room"
										onAddNew={() => setRoomModal({ open: true, data: null })}
									/>
								) : (
									<div className="rounded-lg border border-white/10 overflow-hidden">
										<Table>
											<TableHeader>
												<TableRow className="bg-black/40 border-white/10 hover:bg-transparent">
													<TableHead className="text-gray-400 w-12"></TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<DoorOpen className="h-4 w-4" /> Xona nomi
														</div>
													</TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<Users className="h-4 w-4" /> Sig'im
														</div>
													</TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<UsersRound className="h-4 w-4" /> Guruh
														</div>
													</TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<Clock className="h-4 w-4" /> Vaqt
														</div>
													</TableHead>
													<TableHead className="text-gray-400">
														<div className="flex items-center gap-2">
															<CalendarRange className="h-4 w-4" /> Kunlar
														</div>
													</TableHead>
													<TableHead className="text-gray-400 text-right w-20">
														Amallar
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{roomData.map((room) => {
													const isOccupied = !!room.group_name;
													const today = new Date().toLocaleDateString("uz-UZ", {
														weekday: "short",
													});
													const uzToday = getUzDays(today);

													return (
														<TableRow
															key={room.room_id}
															className={`border-white/5 hover:bg-amber-400/5 transition-all duration-200 group/row ${isOccupied ? "bg-emerald-500/5" : ""}`}
														>
															<TableCell className="py-4">
																<Avatar
																	className={`w-10 h-10 border border-white/10 ${isOccupied ? "bg-linear-to-br from-emerald-400/20 to-teal-400/20" : "bg-linear-to-br from-amber-400/20 to-orange-400/20"}`}
																>
																	<AvatarFallback
																		className={`${isOccupied ? "text-emerald-400" : "text-amber-400"} text-sm font-semibold bg-transparent`}
																	>
																		{getInitials(room.room_name)}
																	</AvatarFallback>
																</Avatar>
															</TableCell>
															<TableCell className="font-medium text-white">
																<div>
																	<p className="truncate max-w-32">
																		{room.room_name}
																	</p>
																	{isOccupied && (
																		<Badge
																			variant="outline"
																			className="mt-1 text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
																		>
																			<UsersRound className="w-3 h-3 mr-1" />{" "}
																			{room.group_name}
																		</Badge>
																	)}
																</div>
															</TableCell>
															<TableCell className="text-gray-300">
																<Badge
																	variant="outline"
																	className="border-white/20 text-gray-300"
																>
																	{room.capacity} kishi
																</Badge>
															</TableCell>
															<TableCell className="text-gray-400 text-sm">
																{room.group_name || (
																	<span className="text-gray-600 italic">
																		Bo'sh
																	</span>
																)}
															</TableCell>
															<TableCell className="text-gray-400 text-sm">
																{room.group_lesson_time || "—"}
															</TableCell>
															<TableCell>
																<div className="flex flex-wrap gap-1">
																	{room.group_lesson_days ? (
																		getUzDays(room.group_lesson_days).map(
																			(day, idx) => (
																				<DayPill
																					key={idx}
																					day={day}
																					isToday={day === uzToday}
																				/>
																			),
																		)
																	) : (
																		<span className="text-gray-600 text-xs">
																			—
																		</span>
																	)}
																</div>
															</TableCell>
															<TableCell className="text-right">
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button
																			variant="ghost"
																			size="icon"
																			className="h-8 w-8 text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors opacity-0 group-hover/row:opacity-100"
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
																				setRoomModal({ open: true, data: room })
																			}
																			className="cursor-pointer hover:bg-amber-400/10 focus:bg-amber-400/10"
																		>
																			<Edit2 className="mr-2 h-4 w-4 text-blue-400" />{" "}
																			Tahrirlash
																		</DropdownMenuItem>
																		<DropdownMenuSeparator className="bg-white/10" />
																		<DropdownMenuItem
																			onClick={() =>
																				setDeleteId({
																					id: room.room_id,
																					type: "room",
																				})
																			}
																			className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10"
																		>
																			<Trash2 className="mr-2 h-4 w-4" />{" "}
																			O'chirish
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* 🎭 Course Modal */}
				<Dialog
					open={courseModal.open}
					onOpenChange={(val) => setCourseModal({ ...courseModal, open: val })}
				>
					<DialogContent className="bg-[#1f1f1f] border-white/10 text-white max-w-md">
						<DialogHeader>
							<DialogTitle className="text-xl flex items-center gap-2">
								<BookOpen className="text-amber-400" />
								{courseModal.data ? "Kursni tahrirlash" : "Yangi kurs yaratish"}
							</DialogTitle>
							<DialogDescription className="text-gray-400">
								Kurs ma'lumotlarini to'ldiring va saqlang
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleCourseSubmit} className="space-y-4 pt-4">
							<div className="grid gap-2">
								<Label htmlFor="cname" className="text-gray-300">
									Kurs nomi
								</Label>
								<Input
									id="cname"
									name="name"
									defaultValue={courseModal.data?.name}
									required
									className="bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
									placeholder="Masalan: Ingliz tili B1"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="cprice" className="text-gray-300">
										Narxi (so'm)
									</Label>
									<Input
										id="cprice"
										name="price"
										type="number"
										defaultValue={courseModal.data?.price}
										required
										className="bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
										placeholder="250000"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="clessons" className="text-gray-300">
										Darslar soni
									</Label>
									<Input
										id="clessons"
										name="lesson_count"
										type="number"
										defaultValue={courseModal.data?.lesson_count}
										required
										className="bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
										placeholder="12"
									/>
								</div>
							</div>
							<DialogFooter className="pt-4 flex gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => setCourseModal({ open: false, data: null })}
									className="border-white/20 text-gray-300 hover:bg-white/10"
								>
									<X className="mr-2 h-4 w-4" /> Bekor qilish
								</Button>
								<Button
									type="submit"
									className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black"
								>
									<Save className="mr-2 h-4 w-4" />{" "}
									{courseModal.data ? "Saqlash" : "Yaratish"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* 🎭 Room Modal */}
				<Dialog
					open={roomModal.open}
					onOpenChange={(val) => setRoomModal({ ...roomModal, open: val })}
				>
					<DialogContent className="bg-[#1f1f1f] border-white/10 text-white max-w-md">
						<DialogHeader>
							<DialogTitle className="text-xl flex items-center gap-2">
								<DoorOpen className="text-amber-400" />
								{roomModal.data ? "Xonani tahrirlash" : "Yangi xona qo'shish"}
							</DialogTitle>
							<DialogDescription className="text-gray-400">
								Xona ma'lumotlarini to'ldiring va saqlang
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleRoomSubmit} className="space-y-4 pt-4">
							<div className="grid gap-2">
								<Label htmlFor="rname" className="text-gray-300">
									Xona nomi
								</Label>
								<Input
									id="rname"
									name="name"
									defaultValue={roomModal.data?.room_name}
									required
									className="bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
									placeholder="Masalan: 301-xona"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="rcapacity" className="text-gray-300">
									Sig'imi (kishi)
								</Label>
								<Input
									id="rcapacity"
									name="capacity"
									type="number"
									defaultValue={roomModal.data?.capacity}
									required
									className="bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
									placeholder="15"
								/>
							</div>
							<DialogFooter className="pt-4 flex gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => setRoomModal({ open: false, data: null })}
									className="border-white/20 text-gray-300 hover:bg-white/10"
								>
									<X className="mr-2 h-4 w-4" /> Bekor qilish
								</Button>
								<Button
									type="submit"
									className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black"
								>
									<Save className="mr-2 h-4 w-4" />{" "}
									{roomModal.data ? "Saqlash" : "Yaratish"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				<ConfirmDeleteModal
					isOpen={!!deleteId.id}
					onClose={() => setDeleteId({ id: null, type: null })}
					onConfirm={handleConfirmDelete}
					title={
						deleteId.type === "course" ? "Kursni o'chirish" : "Xonani o'chirish"
					}
					description={
						deleteId.type === "course"
							? "Haqiqatdan ham ushbu kursni o'chirib tashlamoqchimisiz? Barcha bog'liq ma'lumotlar ham o'chiriladi."
							: "Haqiqatdan ham ushbu xonani o'chirib tashlamoqchimisiz? Agar xona band bo'lsa, avval guruhni boshqa xonaga o'tkazing."
					}
				/>
			</div>
		</div>
	);
}

// 🧩 Empty State Component
const EmptyState = ({ type, onAddNew }) => {
	const isCourse = type === "course";

	return (
		<div className="flex flex-col items-center justify-center text-center py-12 px-4">
			<div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
				{isCourse ? (
					<BookOpen className="w-8 h-8" />
				) : (
					<DoorOpen className="w-8 h-8" />
				)}
			</div>
			<h3 className="text-lg font-semibold text-white mb-2">
				{isCourse ? "Kurslar yo'q" : "Xonalar yo'q"}
			</h3>
			<p className="text-gray-500 text-sm max-w-sm mb-6">
				{isCourse
					? "Hozircha hech qanday kurs mavjud emas. Birinchi kursni yaratishni boshlang!"
					: "Hozircha hech qanday xona mavjud emas. Birinchi xonani qo'shishni boshlang!"}
			</p>
			<Button
				onClick={onAddNew}
				className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black gap-2"
			>
				<Plus className="w-4 h-4" />{" "}
				{isCourse ? "Birinchi kursni yaratish" : "Birinchi xonani qo'shish"}
			</Button>
		</div>
	);
};
