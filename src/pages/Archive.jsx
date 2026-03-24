import { useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useArchive } from "../services/archive/useArchive.js";
import {
	FaBook,
	FaCalendarAlt,
	FaChalkboardTeacher,
	FaClock,
	FaDollarSign,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Calendar,
	CalendarDays,
	GraduationCap,
	Phone,
	Users,
	Wallet,
	User,
	Users2,
	Globe,
	BookOpen,
	MessageSquare,
	UserRound,
	PhoneForwarded,
	Share2,
	CircleDollarSign,
	CreditCard,
	ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "./Archive.css";
import { HiOutlinePencilAlt } from "react-icons/hi";
import PhoneUtils from "@/utils/phoneFormat.js";
import { useCourse } from "@/services/course/useCourse.js";
import { getUzDays } from "@/utils/weekday.js";

export default function Archive() {
	const { category } = useParams();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const {
		archivedGroups = [],
		useAllArchivedStudents,
		useAllArchivedLeads,
		useAllArchivedPayments,
		useAllArchivedTeachers,
	} = useArchive();

	const [openTeacher, setOpenTeacher] = useState(false);
	const [openGroup, setOpenGroup] = useState(false);

	const {
		data: students = [],
		isLoading: loadingStudents,
		error: errorStudents,
	} = useAllArchivedStudents();
	const {
		data: leads = [],
		isLoading: loadingLeads,
		error: errorLeads,
	} = useAllArchivedLeads();
	const {
		data: payments = [],
		isLoading: loadingPayments,
		error: errorPayments,
	} = useAllArchivedPayments();
	const {
		data: teachers = [],
		isLoading: loadingTeachers,
		error: errorTeachers,
	} = useAllArchivedTeachers();
	const { courseData } = useCourse();
	if (
		(category === "students" && loadingStudents) ||
		(category === "leads" && loadingLeads) ||
		(category === "payments" && loadingPayments) ||
		(category === "teachers" && loadingTeachers)
	)
		return <Loader />;

	if (
		!["students", "leads", "payments", "groups", "teachers"].includes(category)
	) {
		return (
			<div className="text-center p-10 text-[#e74c3c] bg-[rgba(231, 76, 60, 0.1)] rounded-3xl mx-5 my-15">
				Invalid category
			</div>
		);
	}

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			<Button onClick={() => navigate(-1)} className="btn-default">
				<ArrowLeft className="h-4 w-4" /> Ortga qaytish
			</Button>
			<h2 className="page-title flex items-center gap-2 text-2xl font-bold my-6">
				Arxiv -{" "}
				<span>
					{category === "students"
						? "O'quvchilar"
						: category === "teachers"
							? "O'qituvchilar"
							: category === "payments"
								? "To'lovlar"
								: category === "groups"
									? "Guruhlar"
									: category === "leads"
										? "Lidlar"
										: ""}
				</span>
			</h2>

			<div>
				{/* Students Table */}
				{category === "students" && (
					<div className="rounded-md border shadow-sm overflow-hidden">
						<Table>
							<TableHeader className="bg-primary">
								<TableRow>
									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<GraduationCap className="h-4 w-4" /> Ism
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4" /> Guruh
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4" /> Telefon
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" /> Tug'ilgan kun
										</div>
									</TableHead>
									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<UserRound className="h-4 w-4" /> Ota-ona ismi
										</div>
									</TableHead>
									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<PhoneForwarded className="h-4 w-4 " /> Ota-ona raqami
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Wallet className="h-4 w-4" /> Balans
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="h-24 text-center text-muted-foreground"
										>
											O'quvchilar topilmadi.
										</TableCell>
									</TableRow>
								) : (
									students
										?.filter((s) =>
											s.full_name
												?.toLowerCase()
												.includes(searchTerm.toLowerCase()),
										)
										.filter(
											(s) =>
												!selectedTeacher ||
												s.groups?.some((studentGroupName) => {
													const groupObj = archivedGroups.find(
														(g) => g.name === studentGroupName,
													);
													return groupObj?.teacher_id === selectedTeacher;
												}),
										)
										.filter(
											(s) =>
												!selectedGroup ||
												s.archivedGroups?.includes(
													archivedGroups.find((g) => g.id === selectedGroup)
														?.name,
												),
										)
										.map((s) => (
											<TableRow key={s.id}>
												<TableCell>{s.full_name}</TableCell>
												<TableCell>{s.groups?.[0] || "No Group"}</TableCell>
												<TableCell>{PhoneUtils.formatPhone(s.phone)}</TableCell>
												<TableCell>{s.birthday?.split("T")[0]}</TableCell>
												<TableCell>{s.parents_name}</TableCell>
												<TableCell>
													{PhoneUtils.formatPhone(s.parents_phone)}
												</TableCell>
												<TableCell>
													<span className="balance-badge">
														{s.monthly_paid?.toLocaleString() ?? 0} so'm
													</span>
												</TableCell>
											</TableRow>
										))
								)}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Teachers Table */}
				{category === "teachers" && (
					<div className="rounded-md border shadow-sm overflow-hidden">
						<Table>
							<TableHeader className="bg-primary">
								<TableRow>
									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4" /> Ism
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4" /> Telefon
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Share2 className="h-4 w-4" /> Manba
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="h-24 text-center text-muted-foreground"
										>
											O'qituvchilar topilmadi.
										</TableCell>
									</TableRow>
								) : (
									teachers?.map((t) => (
										<TableRow key={t.id}>
											<TableCell>{t.full_name}</TableCell>
											<TableCell>{PhoneUtils.formatPhone(t.phone)}</TableCell>
											<TableCell>{t.source}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Leads Table */}
				{category === "leads" && (
					<div className="rounded-md border shadow-sm overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-primary hover:bg-primary/95">
									<TableHead className="text-primary-foreground">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4" /> Ism
										</div>
									</TableHead>

									<TableHead className="text-primary-foreground">
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4" /> Telefon
										</div>
									</TableHead>

									<TableHead className="text-primary-foreground">
										<div className="flex items-center gap-2">
											<Globe className="h-4 w-4" /> Manba
										</div>
									</TableHead>

									<TableHead className="text-primary-foreground">
										<div className="flex items-center gap-2">
											<BookOpen className="h-4 w-4" /> Qiziqadigan Kurs
										</div>
									</TableHead>

									<TableHead className="text-primary-foreground">
										<div className="flex items-center gap-2">
											<MessageSquare className="h-4 w-4" /> Izoh
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{leads?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-10 text-gray-500"
										>
											Lidlar topilmadi.
										</TableCell>
									</TableRow>
								) : (
									leads?.map((l) => (
										<TableRow key={l.id} className="bg-card transition-colors">
											<TableCell className="font-medium">
												{l.full_name}
											</TableCell>
											<TableCell>
												<span
													onClick={(e) => handleCopyPhone(e, l.phone)}
													className="cursor-pointer hover:text-blue-600 transition-colors underline decoration-dotted"
												>
													{PhoneUtils.formatPhone(l.phone)}
												</span>
											</TableCell>
											<TableCell>{l.source}</TableCell>
											<TableCell>
												{courseData?.find((c) => c.name === l.interested_course)
													?.name || "-"}
											</TableCell>
											<TableCell
												className="max-w-50 truncate"
												title={l.comment}
											>
												{l.comment}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Payments Table */}
				{category === "payments" && (
					<div className="rounded-md border overflow-hidden shadow-lg">
						<Table>
							<TableHeader className="bg-primary">
								<TableRow className="hover:bg-primary/95">
									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<CalendarDays className="h-4 w-4" /> Sana
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<GraduationCap className="h-4 w-4" /> O'quvchi
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<Users2 className="h-4 w-4" /> Guruh
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<CircleDollarSign className="h-4 w-4" /> Miqdor
										</div>
									</TableHead>

									<TableHead className="text-black font-bold whitespace-nowrap">
										<div className="flex items-center gap-2">
											<CreditCard className="h-4 w-4" /> Tur
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{(payments || []).length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-10 text-gray-500"
										>
											To'lovlar topilmadi.
										</TableCell>
									</TableRow>
								) : (
									payments.map((p) => (
										<TableRow key={p.id} className="bg-card">
											<TableCell>{formatDate(p.paid_at)}</TableCell>
											<TableCell className="font-medium">
												{p.student_name}
											</TableCell>
											<TableCell>{p.group_name}</TableCell>
											<TableCell className="text-primary font-semibold">
												{p.amount?.toLocaleString() ?? 0} so'm
											</TableCell>
											<TableCell>
												<span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">
													{p.method}
												</span>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Groups Table */}
				{category === "groups" && (
					<div className="rounded-md border shadow-sm overflow-hidden">
						<Table>
							<TableHeader className="bg-primary">
								<TableRow>
									<TableHead>
										<div className="flex items-center gap-1">
											<HiOutlinePencilAlt /> Nomi
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-1">
											<FaDollarSign /> Narx
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-1">
											<FaClock /> Dars vaqti
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-1">
											<FaBook /> Kurs turi
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-1">
											<FaChalkboardTeacher /> O'qituvchi
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-1">
											<FaCalendarAlt /> Dars kunlari
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{archivedGroups?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-10 text-gray-500"
										>
											Guruhlar topilmadi.
										</TableCell>
									</TableRow>
								) : (
									archivedGroups?.map((g) => (
										<TableRow
											key={g.id}
											onClick={() => navigate(`/${tenant}/groups/${g.id}`)}
											className="cursor-pointer bg-card"
										>
											<TableCell>
												{g.name}{" "}
												<span id="studentCounter">[{g.studentCount}]</span>
											</TableCell>
											<TableCell>{g.price} ming so'm</TableCell>
											<TableCell>{g.lesson_time}</TableCell>
											<TableCell>{g.course_type}</TableCell>
											<TableCell className="teacher">
												{g.teachers?.full_name}
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													{getUzDays(g.lesson_days).map((day) => (
														<span
															key={day}
															className="day-pill px-2.5 py-0.5 rounded-[10px] bg-primary text-black"
														>
															{day}
														</span>
													))}
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}
