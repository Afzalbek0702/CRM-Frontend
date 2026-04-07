import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useGroups } from "../services/group/useGroups";
import { useAttendance } from "../services/attendance/useAttendance";
import { useStudent } from "../services/student/useStudent";
import { usePayments } from "../services/payment/usePayments";
import { useTeachers } from "../services/teacher/useTeachers";
import Loader from "../components/Loader";
import PaymentModal from "../components/PaymentModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUzDays } from "@/utils/weekday";
import {
	FaArrowLeft,
	FaSearch,
	FaUsers,
	FaMoneyCheckAlt,
	FaUserMinus,
	FaCalendarAlt,
	FaClock,
	FaTag,
	FaChalkboardTeacher,
	FaCheckCircle,
	FaEllipsisV,
} from "react-icons/fa";

export default function GuruhlarInfo() {
	const { role } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { loading, error, fetchById } = useGroups();
	const { removeFromGroup } = useStudent();
	const { createPayment } = usePayments();
	const { teachers } = useTeachers();
	const [group, setGroup] = useState(null);
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [deleteId, setDeleteId] = useState(null);
	const {
		attendance,
		updateLocalAttendance,
		saveAttendance,
		isSaving,
		isDirty,
	} = useAttendance({ group_id: id, month });

	useEffect(() => {
		fetchById(id).then((d) => {
			setGroup(d);
			setStudents(d.students || []);
		});
	}, [id]);

	const stats = useMemo(() => {
		if (!attendance.length) return { total: 0, present: 0, absent: 0, rate: 0 };
		const total = attendance.length,
			present = attendance.filter((s) =>
				s.days.some((d) => d.status && d.status !== "NOT_ENROLLED"),
			).length;
		return {
			total,
			present,
			absent: total - present,
			rate: total ? Math.round((present / total) * 100) : 0,
		};
	}, [attendance]);

const months = useMemo(() => {
	return Array.from({ length: 12 }, (_, i) => {
		const currentYear = new Date().getFullYear();
		const monthIndex = i + 1; // 1 dan 12 gacha

		// Value: "2026-01", "2026-02" ...
		const value = `${currentYear}-${String(monthIndex).padStart(2, "0")}`;

		let monthName = "";
		switch (monthIndex) {
			case 1:
				monthName = "Yanvar";
				break;
			case 2:
				monthName = "Fevral";
				break;
			case 3:
				monthName = "Mart";
				break;
			case 4:
				monthName = "Aprel";
				break;
			case 5:
				monthName = "May";
				break;
			case 6:
				monthName = "Iyun";
				break;
			case 7:
				monthName = "Iyul";
				break;
			case 8:
				monthName = "Avgust";
				break;
			case 9:
				monthName = "Sentabr";
				break;
			case 10:
				monthName = "Oktabr";
				break;
			case 11:
				monthName = "Noyabr";
				break;
			case 12:
				monthName = "Dekabr";
				break;
			default:
				monthName = "";
		}

		return {
			value: value,
			// Label: "2026-yil Yanvar" yoki "Yanvar, 2026"
			label: `${currentYear}-yil ${monthName}`,
		};
	});
}, []);
	const todayStr = new Date().toISOString().slice(0, 10);
	const lessonDates = attendance[0]?.days.map((d) => d.date) || [];
	const todayIdx = lessonDates.findIndex((d) => d >= todayStr);
	const anchorIdx = todayIdx === -1 ? lessonDates.length - 1 : todayIdx;
	const filtered = students.filter((s) =>
		s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);
	const removeStudent = async () => {
		if (deleteId) {
			await removeFromGroup(deleteId, id);
			setStudents((prev) => prev.filter((s) => s.id !== deleteId));
			setDeleteId(null);
		}
	};
	const initials = (n) => n?.charAt(0).toUpperCase() || "?";
	const dayPill = (day, active) =>
		`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${active ? "bg-linear-to-r from-amber-400 to-orange-400 text-black shadow-lg shadow-amber-500/25 scale-105" : "bg-white/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20"}`;
	const statBox = (label, value, color, progress) => {
		const c = {
			gray: "text-gray-300",
			green: "text-green-400",
			amber: "text-amber-400",
		};
		return (
			<div
				className={`relative p-3 rounded-xl bg-${color}-500/20 border border-white/10`}
			>
				<p className="text-xs text-gray-500">{label}</p>
				<p className={`text-xl font-bold ${c[color]}`}>{value}</p>
				{progress !== undefined && (
					<div className="absolute bottom-2 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
						<div
							className="h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-full transition-all"
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}
			</div>
		);
	};
	console.log("month", month);
	console.log("months", months);
	if (loading || !group) return <Loader />;
	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="bg-red-500/10 border-red-500/30 p-6 max-w-md">
					<p className="text-red-400 text-center mb-4">{error}</p>
					<Button
						onClick={() => navigate(-1)}
						variant="outline"
						className="w-full"
					>
						<FaArrowLeft className="mr-2" />
						Ortga
					</Button>
				</Card>
			</div>
		);

	return (
		<div className="relative min-h-screen bg-background p-4">
			<div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<Button
							onClick={() => navigate(-1)}
							variant="ghost"
							className="text-gray-400 hover:text-white"
						>
							<FaArrowLeft />
							<span className="ml-2 hidden sm:inline">Ortga</span>
						</Button>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
								{group.name}
							</h1>
							<p className="text-sm text-gray-500 mt-1">{group.course_type}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Badge
							variant="outline"
							className="border-amber-400/30 text-amber-300 bg-amber-400/10"
						>
							<FaUsers className="mr-1.5" />
							{students.length} o'quvchi
						</Badge>
						{isDirty && (
							<Badge className="bg-amber-500 text-black animate-pulse">
								<FaCheckCircle className="mr-1" />
								Saqlanmagan
							</Badge>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-4">
					{/* Left Panel */}
					<div className="xl:col-span-4 space-y-6">
						{/* Group Info */}
						<Card className="bg-linear-to-br from-[#1f1f1f] to-[#161616] border-white/10 backdrop-blur-xl">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-xl text-white">
										Guruh ma'lumotlari
									</CardTitle>
									<div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
										<FaChalkboardTeacher className="text-amber-400" />
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									{[
										{
											i: <FaTag />,
											l: "Narx",
											v: `${group.price.toLocaleString()} so'm`,
											a: true,
										},
										{ i: <FaClock />, l: "Dars vaqti", v: group.lesson_time },
										{
											i: <FaChalkboardTeacher />,
											l: "O'qituvchi",
											v:
												teachers.find((t) => t.id === group.teacher_id)
													?.full_name || "—",
										},
										{
											i: <FaCalendarAlt />,
											l: "Davomiyligi",
											v: `${group.duration} oy`,
										},
									].map((it, i) => (
										<div key={i} className="space-y-1.5">
											<p
												className={`text-xs text-gray-500 flex items-center gap-1.5 ${it.a ? "text-amber-400" : ""}`}
											>
												{it.i}
												{it.l}
											</p>
											<p
												className={`font-semibold ${it.a ? "text-amber-400" : "text-white"}`}
											>
												{it.v}
											</p>
										</div>
									))}
								</div>
								<Separator className="bg-white/10" />
								<div>
									<p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
										Dars kunlari
									</p>
									<div className="flex flex-wrap gap-2">
										{getUzDays(group.lesson_days).map((day, idx) => (
											<span key={idx} className={dayPill(day, idx === 0)}>
												{day}
											</span>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Students List */}
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl h-[calc(100vh-400px)] flex flex-col">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg text-white flex items-center gap-2">
									<FaUsers className="text-amber-400" />
									O'quvchilar
									<Badge
										variant="secondary"
										className="ml-2 bg-white/10 text-gray-300"
									>
										{filtered.length}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 flex flex-col px-6 pb-6">
								<InputGroup className="bg-black/40 border-white/20 mb-4">
									<InputGroupInput
										placeholder="O'quvchi qidirish..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="bg-transparent text-white border-0 focus:ring-0"
									/>
									<InputGroupAddon>
										<FaSearch className="text-gray-500" />
									</InputGroupAddon>
								</InputGroup>
								<div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-2">
									{filtered.length === 0 ? (
										<div className="text-center py-8 text-gray-500">
											<FaUsers className="text-4xl mx-auto mb-3 opacity-30" />
											<p>O'quvchilar topilmadi</p>
										</div>
									) : (
										filtered.map((s) => (
											<div
												key={s.id}
												className="group flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
											>
												<div className="flex items-center gap-3 min-w-0">
													<div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
														{initials(s.full_name)}
													</div>
													<div className="min-w-0">
														<p className="font-medium text-white truncate">
															{s.full_name}
														</p>
														<p className="text-xs text-gray-500">ID: #{s.id}</p>
													</div>
												</div>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="text-gray-500 hover:text-amber-400"
														>
															<FaEllipsisV />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="bg-[#1f1f1f] border-white/10 text-white w-48"
													>
														<DropdownMenuItem
															onClick={() => {
																setSelectedStudent(s);
																setShowPaymentModal(true);
															}}
															className="hover:bg-amber-400/10 cursor-pointer"
														>
															<FaMoneyCheckAlt className="mr-2 text-amber-400" />
															To'lov qilish
														</DropdownMenuItem>
														<DropdownMenuSeparator className="bg-white/10" />
														<DropdownMenuItem
															onClick={() => setDeleteId(s.id)}
															className="text-red-400 hover:bg-red-400/10 cursor-pointer"
														>
															<FaUserMinus className="mr-2" />
															Guruhdan o'chirish
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Panel: Attendance */}
					<div className="xl:col-span-8">
						<Card className="bg-[#1f1f1f]/80 border-white/10 backdrop-blur-xl h-full">
							<CardHeader className="pb-4">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div>
										<CardTitle className="text-xl text-white flex items-center gap-2">
											<FaCalendarAlt className="text-amber-400" />
											Davomat jurnali
										</CardTitle>
										<CardDescription className="text-gray-500 mt-1">
											{months.find((m) => m.value === month)?.label}
										</CardDescription>
									</div>
									<div className="flex items-center gap-3">
										<Select value={month} onValueChange={setMonth}>
											<SelectTrigger className="w-44 bg-black/40 border-white/20 text-white">
												<SelectValue placeholder="Oy tanlang" />
											</SelectTrigger>
											<SelectContent className="bg-[#1f1f1f] border-white/10 text-white">
												{months.map((m) => (
													<SelectItem
														key={m.value}
														value={m.value}
														className="hover:bg-amber-400/10"
													>
														{m.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Button
											onClick={saveAttendance}
											disabled={isSaving || !isDirty}
											className={`min-w-32 transition-all ${isDirty ? "bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25" : "bg-white/10 text-gray-400 border border-white/20"}`}
										>
											{isSaving ? (
												<span className="flex items-center gap-2">
													<span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
													Saqlanmoqda...
												</span>
											) : isDirty ? (
												<>
													<FaCheckCircle />
													Saqlash
												</>
											) : (
												<>
													<FaCheckCircle className="text-green-400" />
													Saqlandi
												</>
											)}
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent className="px-2">
								{/* Stats */}
								<div className="grid grid-cols-3 gap-3 mb-4">
									{statBox("Jami", stats.total, "gray")}
									{statBox("Qatnashdi", stats.present, "green")}
									{statBox("Davomat", `${stats.rate}%`, "amber", stats.rate)}
								</div>

								{/* Table */}
								<div className="relative overflow-x-auto rounded-lg border border-white/10">
									<Table>
										<TableHeader>
											<TableRow className="bg-black/40 border-white/10">
												<TableHead className="sticky left-0 z-20 w-48 bg-[#1a1a1a] border-r border-white/10 text-gray-400">
													O'quvchi
												</TableHead>
												{lessonDates.map((date, idx) => {
													const d = new Date(date),
														isToday = date === todayStr,
														isFuture = d > new Date(todayStr);
													return (
														<TableHead
															key={idx}
															className={`text-center min-w-10 px-2 py-3 text-xs ${isToday ? "bg-amber-400/20 text-amber-300" : "text-gray-500"} ${isFuture ? "opacity-50" : ""}`}
														>
															<div className="flex flex-col items-center gap-1">
																<span
																	className={`font-bold ${isToday ? "text-amber-400" : "text-white"}`}
																>
																	{d.getDate()}
																</span>
																<span className="text-[10px] uppercase">
																	{getUzDays(
																		d.toLocaleDateString("uz-UZ", {
																			weekday: "short",
																		}),
																	)}
																</span>
																{isToday && (
																	<span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
																)}
															</div>
														</TableHead>
													);
												})}
											</TableRow>
										</TableHeader>
										<TableBody>
											{attendance.map((s, rowIdx) => (
												<TableRow
													key={s.student_id}
													className={`border-white/5 hover:bg-white/5 ${rowIdx % 2 === 0 ? "bg-white/2" : ""}`}
												>
													<TableCell className="sticky left-0 z-10 bg-[#1f1f1f] border-r border-white/10 font-medium text-white">
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-bold">
																{initials(s.full_name)}
															</div>
															<span className="truncate max-w-32">
																{s.full_name}
															</span>
														</div>
													</TableCell>
													{s.days.map((day, idx) => {
														const isNotEnrolled = day.status === "NOT_ENROLLED",
															isFuture = new Date(day.date) > new Date(),
															isTeacher = role === "TEACHER",
															outOfRange =
																isTeacher &&
																(idx < anchorIdx - 2 || idx > anchorIdx + 2),
															isToday = day.date === todayStr;
														return (
															<TableCell
																key={idx}
																className={`${isToday ? "bg-amber-400/5" : ""} p-0`}
                                             >
                                                <div className="flex justify-center items-center">
																{isNotEnrolled || outOfRange ? (
																	<span className="text-zinc-700 text-xs">
																		—
																	</span>
																) : (
																	<Checkbox
																		checked={!!day.status}
																		disabled={isFuture}
																		onCheckedChange={(val) =>
																			updateLocalAttendance(
																				s.student_id,
																				day.date,
																				val,
																			)
																		}
																		className={`border-white/30 data-[state=checked]:bg-linear-to-r data-[state=checked]:from-amber-400 data-[state=checked]:to-orange-400 data-[state=checked]:text-black transition-all ${isFuture ? "opacity-30 cursor-not-allowed" : "hover:border-amber-400"} ${isToday ? "ring-2 ring-amber-400/30" : ""}`}
																	/>
																)}
                                                </div>
															</TableCell>
														);
													})}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								{/* Legend */}
								<div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
									<div className="flex items-center gap-2">
										<Checkbox
											checked
											disabled
											className="border-green-400 bg-green-400"
										/>
										<span>Qatnashdi</span>
									</div>
									<div className="flex items-center gap-2">
										<Checkbox disabled className="border-red-400/50" />
										<span>Qatnashmadi</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="w-4 h-4 rounded bg-amber-400/20 flex items-center justify-center text-[10px]">
											—
										</span>
										<span>Mavjud emas</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Modals */}
			<PaymentModal
				isOpen={showPaymentModal}
				onClose={() => {
					setShowPaymentModal(false);
					setSelectedStudent(null);
				}}
				initialData={{
					student_id: selectedStudent?.id,
					group_id: id,
					paid_at: new Date().toISOString().split("T")[0],
				}}
				onSubmit={async (data) => {
					await createPayment({
						...data,
						student_id: selectedStudent.id,
						group_id: Number(id),
					});
					setShowPaymentModal(false);
				}}
				student={selectedStudent}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={removeStudent}
				title="Guruhdan olib tashlash"
				description="Haqiqatdan ham ushbu o'quvchini guruhdan olib tashlamoqchimisiz? Bu amal bekor qilinmaydi."
			/>
		</div>
	);
}
