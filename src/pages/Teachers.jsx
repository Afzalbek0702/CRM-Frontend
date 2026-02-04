import Loader from "../components/Loader";
import { useTeachers } from "../hooks/useTeachers";
import { useNavigate } from "react-router-dom";

import { FaEllipsisV, FaChalkboardTeacher, FaPhone } from "react-icons/fa";

import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import TeacherModal from "../components/TeacherModal";
import ActionMenu from "../components/ActionMenu";

export default function Teachers() {
	const navigate = useNavigate();
	const { teachers, isLoading, createTeacher, updateTeacher, deleteTeacher } =
		useTeachers();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTeacher, setEditingTeacher] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		teacher: null,
	});

	const handleRowClick = (teacherId) => {
		navigate(`/teachers/${teacherId}`);
	};

	if (isLoading) return <Loader />;

	return (
		<div className="table-container">
			<div className="teachers-header">
				<h2>
					<FaChalkboardTeacher /> O'qituvchilar
				</h2>
			</div>

			<div className="table-actions">
				<div className="search-box">
					<FaSearch />
					<input
						type="text"
						placeholder="O'qituvchilarni ismi bo'yicha qidirish ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<button
					className="btn1"
					onClick={() => {
						setEditingTeacher(null);
						setIsModalOpen(true);
					}}
				>
					Yangi O'qituvchi
				</button>
			</div>

			<table>
				<thead>
					<tr>
						<th>
							<FaChalkboardTeacher /> Ism
						</th>
						<th>
							<FaPhone /> Telefon
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{(teachers || [])
						.filter(
							(t) =>
								t.full_name &&
								t.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
						)
						.map((t) => (
							<tr
								key={t.id}
								onClick={() => handleRowClick(t.id)}
								style={{ cursor: "pointer" }}
							>
								<td className="teacher">{t.full_name}</td>
								<td>{t.phone}</td>
								<td
									style={{ width: "10px" }}
									onClick={(e) => e.stopPropagation()}
								>
									<button
										className="icon-button"
										onClick={(e) => {
											const rect = e.currentTarget.getBoundingClientRect();
											setActionMenu({
												isOpen: true,
												position: {
													top: rect.bottom + window.scrollY + 8 + "px",
													left: rect.right + window.scrollX - 150 + "px",
												},
												teacher: t,
											});
										}}
									>
										<FaEllipsisV />
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>

			<ActionMenu
				isOpen={actionMenu.isOpen}
				position={actionMenu.position}
				onClose={() => setActionMenu((s) => ({ ...s, isOpen: false }))}
				entityLabel="Teacher"
				onEdit={() => {
					const t = actionMenu.teacher;
					setEditingTeacher(t);
					setIsModalOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onDelete={async () => {
					const t = actionMenu.teacher;
					if (!t) return;
					await deleteTeacher(t.id);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
			/>

			<TeacherModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingTeacher}
				onSubmit={async (formData) => {
					if (editingTeacher) {
						await updateTeacher(editingTeacher.id, formData);
					} else {
						await createTeacher(formData);
					}
					setIsModalOpen(false);
					setEditingTeacher(null);
				}}
			/>
		</div>
	);
}
