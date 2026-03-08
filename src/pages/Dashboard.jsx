import { useDashboard } from "../services/dashboard/useDashboard.js";
import StatsCards from "../components/Statscards";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import { useCourse } from "../services/course/useCourse.js";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { FaUsers, FaClock, FaBook, FaChalkboardTeacher, FaPhone, FaExclamationTriangle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../context/authContext";
export default function Dashboard() {
	const navigate = useNavigate();
	const { absentStudents, monthlyIncome, todayLessons, topDebtors, isLoading, error } = useDashboard();
	const { courseData } = useCourse();
	const courseMap = Object.fromEntries(courseData?.map(c => [c.id, c.name]));
	const handleRowClick = (groupId) => {
		navigate(`/${tenant}/groups/${groupId}`);
	};
	const { user } = useAuth();
	const { tenant } = useParams()
	const { students } = useStudent();
	const { groups } = useGroups();
	// console.log(user);
	// console.log(tenant);
	
	


	return (
		<>
			<div className="dashboard-header">
				<h1>
					<MdDashboard style={{ marginTop: "0px" }} /> Asosiy panel
				</h1>
				<p>
					Xush kelibsiz
					<span className="tooltip-wrapper">
						<span className="text-special-part">
							<NavLink to={`/${tenant}/profile`}>{user?.username}</NavLink>
						</span>
						<span className="text-special-part-title">
							{user?.role}
						</span>
					</span>
				</p>
			</div>
			{user?.role === "CEO" &&
				<div className="dashboard-cards">
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
			}
			{user?.role === "TEACHER" &&
				<div className="dashboard-cards">
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


			}
			{user?.role === "CEO" ? (
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
												<td>{student.full_name}</td>
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
													<td>{courseMap[lesson.course_type] ?? "Noma'lum"}</td>
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
												<td>{student.full_name}</td>
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
													<td>{courseMap[lesson.course_type] ?? "Noma'lum"}</td>
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
			) : null}
		</>
	);
}
