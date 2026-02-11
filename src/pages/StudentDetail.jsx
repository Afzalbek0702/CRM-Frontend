import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useStudents } from "../hooks/useStudents";
import { FaArrowLeft, FaUsers } from "react-icons/fa";

export default function StudentDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchById,loading,error } = useStudents();
	const [student, setStudent] = useState(null);


	useEffect(() => {
		const loadStudent = async () => {
				const data = await fetchById(id);
            setStudent(data);
		};
		loadStudent();
	}, [ ]);

	if (loading) return <Loader />;
	if (error) return <p>Error: {error}</p>;
	if (!student) return <p>Student not found</p>;

	const formatDate = (d) => {
		if (!d) return "";
		return String(d).split("T")[0];
	};

	return (
		<div className="table-container">
			<button onClick={() => navigate(-1)} className="btn1" style={{ marginBottom: "20px", cursor: "pointer"}}>
				<FaArrowLeft /> Back
			</button>

			<h2>{student.full_name}</h2>

			<div style={{ marginBottom: "30px", background: "var(--background-color-secondary)", padding: "20px", borderRadius: "8px" }}>
				<p><strong>Phone:</strong> {student.phone}</p>
				<p><strong>Birthday:</strong> {formatDate(student.birthday)}</p>
				<p><strong>Parents:</strong> {student.parents_name}</p>
				<p><strong>Balance:</strong> {student.balance?.toLocaleString() ?? 0} so'm</p>
			</div>

			<h3><FaUsers /> Groups</h3>
			{student.groups && student.groups.length > 0 ? (
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
						{student.groups.map((group) => (
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
