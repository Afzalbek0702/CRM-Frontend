import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useTeachers } from "../hooks/useTeachers";
import { FaArrowLeft, FaUsers } from "react-icons/fa";

export default function TeacherDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchById,error,isLoading } = useTeachers();
	const [teacher, setTeacher] = useState(null);
	useEffect(() => {
		const loadTeacher = async () => {
				const data = await fetchById(id);
				setTeacher(data);
		};
		loadTeacher();
	}, []);

	if (isLoading) return <Loader />;
	if (error) return <p>Error: {error}</p>;
	if (!teacher) return <p>Teacher not found</p>;

	return (
		<div className="table-container">
			<button onClick={() => navigate(-1)} className="btn1" style={{ marginBottom: "20px" }}>
				<FaArrowLeft /> Back
			</button>

			<h2>{teacher.full_name}</h2>

			<div style={{ marginBottom: "30px", background: "var(--background-color-secondary)", padding: "20px", borderRadius: "8px" }}>
				<p><strong>Phone:</strong> {teacher.phone}</p>
			</div>

			<h3><FaUsers /> Groups Teaching</h3>
			{teacher.groups && teacher.groups.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Group Name</th>
							<th>Course Type</th>
							<th>Price</th>
							<th>Lesson Time</th>
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
				<p>No groups yet</p>
			)}
		</div>
	);
}
