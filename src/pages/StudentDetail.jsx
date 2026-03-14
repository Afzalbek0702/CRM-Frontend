import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useStudent } from "../services/student/useStudent";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { useGroups } from "../services/group/useGroups";
import { goBack } from "../utils/navigate.js";


export default function StudentDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchById, loading, error } = useStudent();
	const [student, setStudent] = useState(null);
	const { groups } = useGroups();
	const [fullGroups, setFullGroups] = useState([]);

	useEffect(() => {
		const loadStudent = async () => {
			const data = await fetchById(id);
			setStudent(data);

			if (data?.group) {
				const mapped = groups.filter((g) => g.id === data.group.id);
				setFullGroups(mapped);
			} else {
				setFullGroups([]);
			}
		};
		loadStudent();
	}, [id, groups]);

	if (loading) return <Loader />;
	if (error) return <p>Error: {error}</p>;
	if (!student) return <Loader />;

	const formatDate = (d) => {
		if (!d) return "";
		return String(d).split("T")[0];
	};

	console.log("group the student is in : ", fullGroups);
	console.log("student : ", student);



	return (
		<div className="table-container">
			<button className="btn btn-default bg-primary " onClick={goBack}>
				← Ortga
			</button>
			<button
				onClick={() => navigate(-1)}
				className="btn btn-default bg-primary "
				style={{ marginBottom: "20px", cursor: "pointer" }}
			>
				<FaArrowLeft /> Back
			</button>

			<h2>{student.full_name}</h2>

			<div
				style={{
					marginBottom: "30px",
					background: "var(--background-color-secondary)",
					padding: "20px",
					borderRadius: "8px",
				}}
			>
				<p>
					<strong>Telefon raqam:</strong> {student.phone}
				</p>
				<p>
					<strong>Tug'ilgan kun:</strong> {formatDate(student.birthday)}
				</p>
				<p>
					<strong>Ota-ona ismi:</strong> {student.parents_name}
				</p>
				<p>
					<strong>Balance:</strong> {student.balance?.toLocaleString() ?? 0}{" "}
					so'm
				</p>
			</div>

			<h3>
				<FaUsers /> Guruh
			</h3>
			{fullGroups && fullGroups.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Guruh nomi</th>
							<th>Kurs turi</th>
							<th>Narxi</th>
							<th>Dars vaqti</th>
						</tr>
					</thead>
					<tbody>
						{fullGroups.map((group) => (
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
				<p></p>
			)}
		</div>
	);
}
