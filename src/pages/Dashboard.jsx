import { useDashboard } from "../services/dashboard/useDashboard.js";
import StatsCards from "../components/Statscards";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import {
	FaUsers,
	FaClock,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../context/authContext";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.jsx";
import PhoneUtils from "@/utils/phoneFormat.js";

export default function Dashboard() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { tenant } = useParams();
	const { students } = useStudent();
	const { groups } = useGroups();
	const { absentStudents, monthlyIncome, todayLessons, topDebtors, isLoading } =
		useDashboard();

	const handleRowClick = (groupId) => {
		navigate(`/${tenant}/groups/${groupId}`);
	};

	// O'qituvchi uchun ma'lumotlarni filtrlash
	const teacherGroups = groups?.filter((g) => g.teacher_id === user?.id) || [];
	const teacherLessons =
		todayLessons?.filter((l) => l.teacher_name === user?.username) || [];

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			{/* Header qismi */}
			<div>
				<h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
					<MdDashboard className="text-[#fcd34d]" /> Asosiy panel
				</h1>
				<p className="text-gray-400">
					Xush kelibsiz,{" "}
					<span className="text-primary font-medium">{user?.username}</span>
				</p>
			</div>

			{/* Statistika Kartochkalari */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{user?.role === "CEO" ? (
					<>
						<NavLink to={`/${tenant}/payments`}>
							<StatsCards
								data={monthlyIncome?.[0]?.total_income || 0}
								type="Oylik Tushum"
							/>
						</NavLink>
						<NavLink to={`/${tenant}/payments/debtors`}>
							<StatsCards data={topDebtors?.length || 0} type="Qarzdorlar" />
						</NavLink>
						<NavLink to={`/${tenant}/students`}>
							<StatsCards
								data={students?.length || 0}
								type="O'quvchilar"
							/>
						</NavLink>
						<NavLink to={`/${tenant}/groups`}>
							<StatsCards data={groups?.length || 0} type="Guruhlar" />
						</NavLink>
					</>
				) : (
					<>
						<StatsCards data={teacherGroups.length} type="Mening Guruhlarim" />
						<StatsCards data={teacherLessons.length} type="Bugungi Darslar" />
						<StatsCards
							data={
								absentStudents?.filter((s) => s.teacher_id === user?.id)
									.length || 0
							}
							type="Kelmaganlar"
						/>
						<StatsCards data="100%" type="Dars Sifati" />
					</>
				)}
			</div>

			{/* Jadvallar qismi */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{/* 1. Bugungi darslar jadvali */}
				<div className="bg-[#1f1f1f] p-6 rounded-lg border border-[#ffffff1a]">
					<h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-[#fcd34d]">
						<FaClock /> Bugungi darslar
					</h2>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-[#ffffff1a]">
									<TableHead className="text-gray-400">Guruh / Kurs</TableHead>
									<TableHead className="text-gray-400">O'qituvchi</TableHead>
									<TableHead className="text-gray-400 text-right">
										Vaqt
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{!todayLessons?.length ? (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center py-8 text-gray-500"
										>
											Bugun darslar yo'q
										</TableCell>
									</TableRow>
								) : (
									todayLessons.map((lesson) => (
										<TableRow
											key={lesson.id}
											onClick={() => handleRowClick(lesson.id)}
											className="cursor-pointer border-[#ffffff1a] hover:bg-white/5"
										>
											<TableCell>
												<div className="font-medium text-white">
													{lesson.group_name}
												</div>
												<div className="text-xs text-gray-500 italic">
													{lesson.course_type}
												</div>
											</TableCell>
											<TableCell className="text-gray-300">
												{lesson.teacher_name}
											</TableCell>
											<TableCell className="text-right text-[#fcd34d] font-mono">
												{lesson.lesson_time}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* 2. Bugun kelmaganlar jadvali */}
				<div className="bg-[#1f1f1f] p-6 rounded-lg border border-[#ffffff1a]">
					<h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-red-400">
						<FaUsers /> Bugun kelmagan o'quvchilar
					</h2>
					<div className="overflow-x-auto text-white">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-[#ffffff1a]">
									<TableHead className="text-gray-400">O'quvchi</TableHead>
									<TableHead className="text-gray-400">Guruh</TableHead>
									<TableHead className="text-gray-400 text-right">
										Telefon
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{!absentStudents?.length ? (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center py-8 text-green-500 font-medium"
										>
											Hamma o'quvchilar kelgan! 🎉
										</TableCell>
									</TableRow>
								) : (
									absentStudents.map((student) => (
										<TableRow
											key={student.student_id}
											onClick={() => handleRowClick(student.group_id)}
											className="cursor-pointer border-[#ffffff1a] hover:bg-white/5"
										>
											<TableCell className="font-medium">
												{student.full_name}
											</TableCell>
											<TableCell className="text-gray-400 text-sm">
												{student.group_name}
											</TableCell>
											<TableCell className="text-right">
												<button
													onClick={(e) => {
														e.stopPropagation();
														navigator.clipboard.writeText(student.phone);
														// Bu yerda Toast xabarnoma chiqarsangiz bo'ladi
													}}
													className="text-xs bg-black/40 px-2 py-1 rounded border border-[#ffffff1a] hover:border-[#fcd34d] transition-colors"
												>
													{PhoneUtils.formatPhone(student.phone)}
												</button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
