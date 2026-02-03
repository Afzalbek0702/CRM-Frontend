import { useDashboard } from "../hooks/useDashboard";
import StatsCards from "../components/Statscards";
import { useStudents } from "../hooks/useStudents.js";
import { useGroups } from "../hooks/useGroups.js";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaClock, FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function Dashboard() {
	const { monthlyIncomeQuery, topDebtorsQuery, todayLessons } = useDashboard(
		new Date().toISOString().slice(0, 7) + "-01",
		new Date().toISOString().slice(0, 7) + "-31",
		new Date().toISOString().slice(0, 7) + "-01",
	);

	const data = monthlyIncomeQuery.data;
	const debtorsData = topDebtorsQuery.data;
	const todayLessonsData = todayLessons.data;
	const { students } = useStudents();
	const { groups } = useGroups();
	const navigate = useNavigate();
	if (!localStorage.getItem("token")) return navigate("/login");
	return (
		<>
			<div className="dashboard-header">
				<h1>
					<MdDashboard style={{marginTop:'0px'}}/> Dashboard
				</h1>
				<p>Xush kelibsiz {"Admin"}</p>
			</div>
			<div className="dashboard-cards">
				<StatsCards
					data={data ? data[0]?.total_income : ""}
					type={"Oylik Tushum"}
				/>
				<StatsCards data={debtorsData?.length} type={"Qarzdor"} />
				<StatsCards data={students?.length} type={"O'quvchi"} />
				<StatsCards data={groups?.length} type={"Guruh"} />
			</div>
			<div className="dashboard-today-lesson">
				<h2>Bugungi darslar</h2>
				<div className="table-container">
					{todayLessons.isLoading ? (
						<p>Yuklanmoqda...</p>
					) : todayLessons.isError ? (
						<p>Xatolik yuz berdi</p>
					) : (
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
								{todayLessonsData?.map((lesson) => (
									<tr key={lesson.id}>
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
		</>
	);
}
