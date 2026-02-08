import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ActionMenu from "../components/ActionMenu";
import { useGroups } from "../hooks/useGroups.js";
import { useStudents } from "../hooks/useStudents.js";
import {
	FaEllipsisV,
	FaPlus,
	FaUsers,
	FaDollarSign,
	FaClock,
	FaBook,
	FaChalkboardTeacher,
	FaCalendarAlt,
} from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";

export default function Groups() {
	const navigate = useNavigate();
	const { groups, loading, createGroup, deleteGroup, updateGroup } =
		useGroups();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
	const [actionMenuPosition, setActionMenuPosition] = useState({
		top: 0,
		left: 0,
	});
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const { students } = useStudents();

	const studentCountMap = students.reduce((acc, student) => {
		if (!Array.isArray(student.groups)) return acc;

		student.groups.forEach(groupName => {
			acc[groupName] = (acc[groupName] || 0) + 1;
		});

		return acc;
	}, {});

	const groupsWithCount = groups.map(group => ({
		...group,
		studentCount: studentCountMap[group.name] || 0
	}));






	const handleCreate = () => {
		setIsEditMode(false);
		setSelectedGroup(null);
		setIsModalOpen(true);
	};

	const handleEdit = () => {
		setIsEditMode(true);
		setIsActionMenuOpen(false);
		setIsModalOpen(true);
	};

	const handleDelete = () => {
		if (
			selectedGroup &&
			window.confirm(`Are you sure you want to delete ${selectedGroup.name}?`)
		) {
			deleteGroup(selectedGroup.id);
			setIsActionMenuOpen(false);
		}
	};

	const handleActionMenu = (e, group) => {
		e.stopPropagation();
		setSelectedGroup(group);
		const rect = e.currentTarget.getBoundingClientRect();
		setActionMenuPosition({
			top: rect.bottom + 5,
			left: rect.left - 100,
		});
		setIsActionMenuOpen(true);
	};

	const handleRowClick = (groupId) => {
		navigate(`/groups/${groupId}`);
	};

	const handleSubmit = (formData) => {
		if (isEditMode && selectedGroup) {
			updateGroup(selectedGroup.id, formData);
		} else {
			createGroup(formData);
		}
		setIsModalOpen(false);
		setSelectedGroup(null);
		setIsEditMode(false);
	};
	// console.log(students[0]);

	if (loading) return <Loader />;
	return (
		<div className="table-container">
			<div className="groups-header">
				<h1>
					<FaUsers style={{ marginTop: '0px' }} /> Guruhlar
				</h1>
				<p>Barcha guruhlar ro'yxati</p>
			</div>
			<button className="btn1 " onClick={handleCreate}>
				<FaPlus /> Guruh yaratish
			</button>

			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedGroup(null);
					setIsEditMode(false);
				}}
				onSubmit={handleSubmit}
				title={isEditMode ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
				initialData={selectedGroup}
			/>

			<ActionMenu
				isOpen={isActionMenuOpen}
				position={actionMenuPosition}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onClose={() => setIsActionMenuOpen(false)}
			/>

			<table>
				<thead>
					<tr>
						<th>
							<HiOutlinePencilAlt /> Nomi
						</th>
						<th>
							<FaDollarSign /> Narx
						</th>
						<th>
							<FaClock /> Dars vaqti
						</th>
						<th>
							<FaBook /> Kurs turi
						</th>
						<th>
							<FaChalkboardTeacher /> O'qituvchi
						</th>
						<th>
							<FaCalendarAlt /> Dars kunlari
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{groupsWithCount.map((g) => (
						<tr
							key={g.id}
							onClick={() => handleRowClick(g.id)}
							style={{ cursor: "pointer" }}
						>
							<td>{g.name} <span id="studentCounter">[{g.studentCount}]</span></td>
							<td>{g.price} ming so'm</td>
							<td>{g.lesson_time}</td>
							<td>{g.course_type}</td>
							<td className="teacher">{g.teacher}</td>
							<td>
								{Array.isArray(g.lesson_days) ? (
									g.lesson_days.map((day) => (
										<span
											key={day}
											className="day-pill"
											style={{ padding: "3px 10px", borderRadius: "10px" }}
										>
											{day}
										</span>
									))
								) : (
									<span className="day-pill">{g.lesson_days}</span>
								)}
							</td>
							<td
								style={{ width: "10px" }}
								onClick={(e) => e.stopPropagation()}
							>
								<button
									className="icon-button"
									onClick={(e) => handleActionMenu(e, g)}
								>
									<FaEllipsisV />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
