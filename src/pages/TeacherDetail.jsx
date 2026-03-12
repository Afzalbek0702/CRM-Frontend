import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useTeachers } from "../services/teacher/useTeachers";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { goBack } from "../utils/navigate.js";


export default function TeacherDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchById } = useTeachers();
	const [teacher, setTeacher] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	console.log("Route id:", id);
	useEffect(() => {
		if (!id) return;

		const loadTeacher = async () => {
			try {
				setLoading(true);
				const data = await fetchById(id);
				console.log("Fetched teacher:", data);
				setTeacher(data);
			} catch (err) {
				console.error(err);
				setError("Failed to load teacher");
			} finally {
				setLoading(false);
			}
		};

		loadTeacher();
	}, [id]);

	if (loading) return <Loader />;
	if (error) return <p>{error}</p>;
	if (!teacher) return <p>Teacher not found</p>;

	return (
		<div className="table-container">
			<button className="btn btn-default" onClick={goBack}>
				← Ortga
			</button>

			<h2>{teacher.full_name}</h2>

			<div style={{ marginBottom: "30px", background: "var(--background-color-secondary)", padding: "20px", borderRadius: "8px" }}>
				<p><strong>Pozitsiya:</strong> {teacher.position}</p>
				<p><strong>Telefon raqami:</strong> {teacher.phone}</p>
				<p><strong>Oyli maoshi:</strong> {teacher.salary} {teacher.salary_type}</p>
			</div>

			<h3><FaUsers /> Guruhlari</h3>
			{teacher.groups && teacher.groups.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Nomi</th>
							<th>Kurs turi</th>
							<th>Narx</th>
							<th>Dars vaqti</th>
						</tr>
					</thead>
					<tbody>
						{teacher.groups.map((group) => (
							<tr key={group.id}>
								<td>{group.name}</td>
								<td>{group.course_type}</td>
								<td>{group.price}</td>
								<td>{group.lesson_time}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>Guruh yo'q</p>
			)}
		</div>
	);
}
