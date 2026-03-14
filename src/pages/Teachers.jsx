import Loader from "../components/Loader";
import { useTeachers } from "../services/teacher/useTeachers";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "../components/ConfirmProvider";
import { withConfirm } from "../helpers/withConfirm";
import { FaEllipsisV, FaChalkboardTeacher, FaPhone, FaPlus } from "react-icons/fa";
import { goBack } from "../utils/navigate.js";

import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import TeacherModal from "../components/TeacherModal";
import ActionMenu from "../components/ActionMenu";

export default function Teachers() {
	const confirm = useConfirm();
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
	const { tenant } = useParams();

	const handleRowClick = (teacherId) => {
		navigate(`/${tenant}/teachers/${teacherId}`);
	};
	const handleDeleteTeacher = withConfirm(
		confirm,
		"Are you sure you want to delete this teacher?",
		async (teacher) => {
			await deleteTeacher(teacher.id);
			setActionMenu((m) => ({ ...m, isOpen: false }));
		}
	)

	if (isLoading) return <Loader />;


	return (
		<div className="table-container">
			<button className="btn btn-default bg-primary " onClick={goBack}>
				← Ortga
			</button>
			<h2>
				<FaChalkboardTeacher /> O'qituvchilar
			</h2>
			<div className="table-actions mb-[30px]">
				<div className="search-box">
					<FaSearch />
					<input
						type="text"
						placeholder="O'qituvchilarni ismi bo'yicha qidirsh ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<button
					className="btn btn-default bg-primary  text-nowrap"
					onClick={() => {
						setEditingTeacher(null);
						setIsModalOpen(true);
					}}
				>
					<FaPlus /> O'qituvchi qo'shish
				</button>
			</div>

			{teachers && teachers.length < 1 ? (
				<p>O'qituvchilar yo'q</p>
			) : (
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
									<td><p
										onClick={(e) => {
											e.stopPropagation();
											navigator.clipboard.writeText(t.phone);

											const el = e.currentTarget;
											el.dataset.copied = "true";

											setTimeout(() => {
												el.dataset.copied = "false";
											}, 2000);
										}}
										data-copied="false"
										className="copy-phone">{t.phone}
									</p>
									</td>
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
			)
			}

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
				onDelete={() => handleDeleteTeacher(actionMenu.teacher)}
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
