import { useDashboard } from "../services/dashboard/useDashboard.js";
import StatsCards from "../components/Statscards";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import { useCourse } from "../services/course/useCourse.js";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import {
	FaUsers,
	FaClock,
	FaBook,
	FaChalkboardTeacher,
	FaPhone,
	FaExclamationTriangle,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../context/authContext";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.jsx";
export default function Dashboard() {
	const navigate = useNavigate();
	const {
		absentStudents,
		monthlyIncome,
		todayLessons,
		topDebtors,
		isLoading,
		error,
	} = useDashboard();
	const handleRowClick = (groupId) => {
		navigate(`/${tenant}/groups/${groupId}`);
	};
	const { user } = useAuth();
	const { tenant } = useParams();
	const { students } = useStudent();
	const { groups } = useGroups();

	return (
		<>
			<div className="dashboard-header">
				<h1 className="flex items-center text-2xl font-semibold">
					<MdDashboard style={{ marginTop: "0px" }} /> Asosiy panel
				</h1>
				<p>
					Xush kelibsiz
					<span className="text-(--primary-color) font-sans ml-0.5">
						{user?.username}
					</span>
				</p>
			</div>
			{user?.role === "CEO" && (
				<div className="grid xl:grid-cols-4 items-center gap-6 md:grid-cols-2 mt-7.5">
					<NavLink to={`/${tenant}/payments`}>
						<StatsCards
							data={monthlyIncome ? monthlyIncome[0]?.total_income : ""}
							type={"Oylik Tushum"}
						/>
					</NavLink>

					<NavLink to={`/${tenant}/payments/debtors`}>
						<StatsCards
							className="statcards"
							data={topDebtors?.length}
							type={"Qarzdor"}
						/>
					</NavLink>

					<NavLink to={`/${tenant}/students`}>
						<StatsCards
							className="statcards"
							data={students?.length}
							type={"O'quvchi"}
						/>
					</NavLink>

					<NavLink to={`/${tenant}/groups`}>
						<StatsCards
							className="statcards"
							data={groups?.length}
							type={"Guruh"}
						/>
					</NavLink>
				</div>
			)}
			{user?.role === "TEACHER" && (
				<div className="grid xl:grid-cols-4 items-center gap-6 md:grid-cols-2 mt-7.5">
					<NavLink to={`/${tenant}/groups`}>
						<StatsCards
							className="statcards"
							// data={students?.length} bilmadim teacherni dashboardiga ham biror nimalar oylab topelik
							type={"Davomat olinmagan darslar"}
						/>
					</NavLink>

					<NavLink to={`/${tenant}/groups`}>
						<StatsCards
							className="statcards"
							// data={students?.length}
							type={"Kelmagan o'quvchilar"}
						/>
					</NavLink>

					<NavLink to={`/${tenant}/groups`}>
						<StatsCards
							className="statcards"
							// data={students?.length}
							type={"Oylik tushum"}
						/>
					</NavLink>

					<NavLink to={`/${tenant}/groups`}>
						<StatsCards
							className="statcards"
							// data={students?.length}
							type={"Dars sifati"}
						/>
					</NavLink>
				</div>
			)}
			{user?.role === "CEO" ? (
				<div className="flex gap-7.5">
					<div className="max-w-150 w-full">
						<h2>Bugungi darslar</h2>
						<Table>
							<TableCaption>Bugungi darslar</TableCaption>
							<TableHeader className={"bg-(--primary-color)"}>
								<TableRow>
									<TableHead>
										<FaUsers /> Guruh Nomi
									</TableHead>
									<TableHead>
										<FaBook /> Kurs
									</TableHead>
									<TableHead>
										<FaChalkboardTeacher /> O'qituvchi
									</TableHead>
									<TableHead>
										<FaClock /> Dars Vaqti
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{todayLessons?.map((lesson) => (
									<TableRow
										key={lesson.id}
										onClick={() => handleRowClick(lesson.id)}
										style={{ cursor: "pointer" }}
									>
										<TableCell>{lesson.group_name}</TableCell>
										<TableCell>{lesson.course_type}</TableCell>
										<TableCell>{lesson.teacher_name}</TableCell>
										<TableCell>{lesson.lesson_time}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<div className="dashboard-today-lesson absent-students flex-1">
						<h2>
							<FaExclamationTriangle /> Bugun kelmagan o'quvchilar
						</h2>

						<div className="table-container">
							{students && students.length < 1 ? (
								<p>Studentlar yo'q</p>
							) : absentStudents && absentStudents.length > 0 ? (
								<Table>
									<TableHead>
										<TableRow>
											<TableHeader>
												<FaUsers /> O'quvchi Nomi
											</TableHeader>
											<TableHeader>
												<FaUsers /> Guruh
											</TableHeader>
											<TableHeader>
												<FaPhone /> Telefon
											</TableHeader>
										</TableRow>
									</TableHead>
									<TableBody>
										{absentStudents.map((student) => (
											<TableRow
												key={student.student_id}
												onClick={() => handleRowClick(student.group_id)}
												style={{ cursor: "pointer" }}
											>
												<TableCell>{student.full_name}</TableCell>
												<TableCell>{student.group_name}</TableCell>
												<TableCell
													onClick={(e) => {
														e.stopPropagation();
														navigator.clipboard.writeText(student.phone);

														const el = e.currentTarget;
														el.dataset.copied = "true";

														setTimeout(() => {
															el.dataset.copied = "false";
														}, 2000);
													}}
													data-copied="false"
													className="copy-phone"
												>
													{student.phone}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p>Bugun hamma o'quvchilar kelib qolipdi! 🎉</p>
							)}
						</div>
					</div>
				</div>
			) : user?.role === "TEACHER" ? (
				<div className="dashboard-content-wrapper">
					<div className="dashboard-today-lesson absent-students">
						<h2>
							<FaExclamationTriangle /> Bugun kelmagan o'quvchilaringiz
						</h2>

						<div className="table-container">
							{isLoading ? (
								<p>Yuklanmoqda...</p>
							) : error ? (
								<p>Xatolik yuz berdi</p>
							) : students && students.length < 1 ? (
								<p>Studentlar yo'q</p>
							) : absentStudents && absentStudents.length > 0 ? (
								<Table>
									<TableHead>
										<TableRow>
											<TableHead>
												<FaUsers /> O'quvchi Nomi
											</TableHead>
											<TableHead>
												<FaUsers /> Guruh
											</TableHead>
											<TableHead>
												<FaPhone /> Telefon
											</TableHead>
										</TableRow>
									</TableHead>
									<TableBody>
										{absentStudents.map((student) => (
											<TableRow
												key={student.student_id}
												onClick={() => handleRowClick(student.group_id)}
												style={{ cursor: "pointer" }}
											>
												<TableCell>{student.full_name}</TableCell>
												<TableCell>{student.group_name}</TableCell>
												<TableCell
													onClick={(e) => {
														e.stopPropagation();
														navigator.clipboard.writeText(student.phone);

														const el = e.currentTarget;
														el.dataset.copied = "true";

														setTimeout(() => {
															el.dataset.copied = "false";
														}, 2000);
													}}
													data-copied="false"
													className="copy-phone"
												>
													{student.phone}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p>Bugun hamma o'quvchilaringiz kelib qolipdi! 🎉</p>
							)}
						</div>
					</div>

					<div className="dashboard-today-lesson today-lessons">
						<h2>Bugungi darslaringiz</h2>
						<div className="table-container">
							{isLoading ? (
								<p>Yuklanmoqda...</p>
							) : error ? (
								<p>Xatolik yuz berdi</p>
							) : groups && groups.length < 1 ? (
								<p>Guruhlar yo'q</p>
							) : (
								<Table style={{ maxWidth: "600px" }}>
									<TableHead>
										<TableRow>
											<TableHead>
												<FaUsers /> Guruh Nomi
											</TableHead>
											<TableHead>
												<FaBook /> Kurs
											</TableHead>
											<TableHead>
												<FaChalkboardTeacher /> O'qituvchi
											</TableHead>
											<TableHead>
												<FaClock /> Dars Vaqti
											</TableHead>
										</TableRow>
									</TableHead>
									<TableBody>
										{todayLessons?.map((lesson) => (
											<TableRow
												key={lesson.id}
												onClick={() => handleRowClick(lesson.id)}
												style={{ cursor: "pointer" }}
											>
												<TableCell>{lesson.group_name}</TableCell>
												<TableCell>
													{courseMap[lesson.course_type] ?? "Noma'lum"}
												</TableCell>
												<TableCell>{lesson.teacher_name}</TableCell>
												<TableCell>{lesson.lesson_time}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
