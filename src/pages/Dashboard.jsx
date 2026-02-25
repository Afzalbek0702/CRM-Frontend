import { useDashboard } from "../services/dashboard/useDashboard.js";
import StatsCards from "../components/Statscards";
import { useStudents } from "../services/student/useStudents.js";
import { useGroups } from "../services/group/useGroups.js";
import { useNavigate, NavLink } from "react-router-dom";
import { FaUsers, FaClock, FaBook, FaChalkboardTeacher, FaPhone, FaExclamationTriangle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function Dashboard() {
	
	const navigate = useNavigate();
	const {absentStudents,monthlyIncome,todayLessons,topDebtors,isLoading,error } = useDashboard();

	const handleRowClick = (groupId) => {
		navigate(`/groups/${groupId}`);
	};

   
	const { students } = useStudents();
	const { groups } = useGroups();
   if (!localStorage.getItem("token")) return navigate("/login");

	return (
		<>
			<div className="dashboard-header">
				<h1>
					<MdDashboard style={{ marginTop: "0px" }} /> Dashboard
				</h1>
				<p>Xush kelibsiz {"Admin"}</p>
			</div>
			<div className="dashboard-cards">
				<NavLink to="/payments">
					<StatsCards
						data={monthlyIncome ? monthlyIncome.total_income : ""}
						type={"Oylik Tushum"}
					/>
				</NavLink>

				<NavLink to="/payments/debtors">
					<StatsCards
						className="statcards"
						data={topDebtors?.length}
						type={"Qarzdor"}
					/>
				</NavLink>

				<NavLink to="/students">
					<StatsCards
						className="statcards"
						data={students?.length}
						type={"O'quvchi"}
					/>
				</NavLink>

				<NavLink to="/groups">
					<StatsCards
						className="statcards"
						data={groups?.length}
						type={"Guruh"}
					/>
				</NavLink>
			</div>
			<div className="dashboard-content-wrapper">
				<div className="dashboard-today-lesson absent-students">
					<h2>
						<FaExclamationTriangle /> Bugun kelmagan o'quvchilar
					</h2>


					<div className="table-container">
						{isLoading ? (
							<p>Yuklanmoqda...</p>
						) : error ? (
							<p>Xatolik yuz berdi</p>
						) : students && students.length < 1 ? (
							<p>Studentlar yo'q</p>
						) : absentStudents && absentStudents.length > 0 ? (
							<table>
								<thead>
									<tr>
										<th>
											<FaUsers /> O'quvchi Nomi
										</th>
										<th>
											<FaUsers /> Guruh
										</th>
										<th>
											<FaPhone /> Telefon
										</th>
									</tr>
								</thead>
								<tbody>
									{absentStudents.map((student) => (
										<tr
											key={student.student_id}
											onClick={() => handleRowClick(student.group_id)}
											style={{ cursor: "pointer" }}
										>
											<td>{student.student_name}</td>
											<td>{student.group_name}</td>
											<td
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
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p>Bugun hamma o'quvchilar kelib qolipdi! 🎉</p>
						)}
					</div>
				</div>

				<div className="dashboard-today-lesson today-lessons">
					<h2>Bugungi darslar</h2>
					<div className="table-container">
						{isLoading ? (
							<p>Yuklanmoqda...</p>
						) : error ? (
							<p>Xatolik yuz berdi</p>
						) : groups && groups.length < 1 ? (
							<p>Guruhlar yo'q</p>
						) :
						
						(
							<table style={{ maxWidth: "600px" }}>
								<thead>
									<tr>
										<th>
											<FaUsers /> Guruh Nomi
										</th>
										<th>
											<FaBook /> Kurs
										</th>
										<th>
											<FaChalkboardTeacher /> O'qituvchi
										</th>
										<th>
											<FaClock /> Dars Vaqti
										</th>
									</tr>
								</thead>
								<tbody>
									{todayLessons?.map((lesson) => (
										<tr
											key={lesson.id}
											onClick={() => handleRowClick(lesson.id)}
											style={{ cursor: "pointer" }}
										>
											<td>{lesson.group_name}</td>
											<td>{lesson.course_type}</td>
											<td>{lesson.teacher_name}</td>
											<td>{lesson.lesson_time}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
