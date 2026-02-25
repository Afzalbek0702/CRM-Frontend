import Loader from "../components/Loader.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../services/student/useStudents.js";
import { useGroups } from "../services/group/useGroups.js";
import { useTeachers } from "../services/teacher/useTeachers.js";
import {
	FaEllipsisV,
	FaUserGraduate,
	FaPhone,
	FaBirthdayCake,
	FaUsers,
	FaWallet,
	FaPlus,
} from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import StudentModal from "../components/StudentModal.jsx";
import ActionMenu from "../components/ActionMenu.jsx";
import AddToGroupModal from "../components/AddToGroupModal.jsx";

export default function Students() {
	const navigate = useNavigate();
	const {
		students,
		loading,
		error,
		createStudent,
		updateStudent,
		deleteStudent,
		addToGroup,
	} = useStudents();
	const { groups } = useGroups();
	const { teachers } = useTeachers();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		student: null,
	});
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);
	const [addToGroupStudent, setAddToGroupStudent] = useState(null);

	const handleRowClick = (studentId) => {
		navigate(`/students/${studentId}`);
	};
	// console.log(students);
	// console.log(groups);
	// console.log(teachers);



	if (loading) return <Loader />;
	if (error) return <div>Error</div>;
	return (
		<div className="table-container">
			<h2>
				<FaUserGraduate /> O'quvchilar
			</h2>
			<div className="table-actions">
				<div className="filters">
					<select
						value={selectedTeacher}
						onChange={(e) => setSelectedTeacher(Number(e.target.value) || "")}
					>
						<option value="">All Teachers</option>
						{teachers.map((t) => (
							<option key={t.id} value={t.id}>{t.full_name}</option>
						))}
					</select>

					<select
						value={selectedGroup}
						onChange={(e) => setSelectedGroup(Number(e.target.value) || "")} // converts to number
					>
						<option value="">All Groups</option>
						{groups.map((g) => (
							<option key={g.id} value={g.id}>{g.name}</option>
						))}
					</select>
				</div>
				<div className="search-box">
					<FaSearch />
					<input
						type="text"
						placeholder="O'quvchilarni ismi bo'yicha qidirsh ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<button
					className="btn1"
					onClick={() => {
						setEditingStudent(null);
						setIsModalOpen(true);
					}}
				>
					<FaPlus /> O'quvchi qo'shish
				</button>
			</div>

			{students && students.length < 1 ? (
				<p>Studentlar yo'q</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>
								<FaUserGraduate /> Ism
							</th>
							<th>
								<FaUsers /> Guruh nomi
							</th>
							<th>
								<FaPhone /> Telefon
							</th>
							<th>
								<FaBirthdayCake /> Tug'ilgan kun
							</th>
							<th>
								<FaUsers /> Ota-onasi
							</th>
							<th>
								<FaPhone /> Ota-onasi telefon
							</th>
							<th>
								<FaWallet /> Balance
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{
							(students || [])
								.filter((s) =>
									s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
								)
								.filter((s) =>
									!selectedTeacher ||
									s.groups?.some(studentGroupName => {
										const groupObj = groups.find(g => g.name === studentGroupName);
										return groupObj?.teacher_id === selectedTeacher;
									})
								)
								.filter((s) =>
									!selectedGroup || s.groups?.includes(
										groups.find(g => g.id === selectedGroup)?.name
									)
								)
								.map((s) => {
									const formatDate = (d) => {
										if (!d) return "";
										return String(d).split("T")[0];
									};

									return (
										<tr
											key={s.id}
											onClick={() => handleRowClick(s.id)}
											style={{ cursor: "pointer" }}
										>
											<td>{s.full_name}</td>
											<td>{s.groups?.length > 0 ? s.groups[0] : "No Group"}</td>
											<td
												onClick={(e) => {
													e.stopPropagation();
													navigator.clipboard.writeText(s.phone);

													const el = e.currentTarget;
													el.dataset.copied = "true";

													setTimeout(() => {
														el.dataset.copied = "false";
													}, 2000);
												}}
												data-copied="false"
												className="copy-phone"
											>
												{s.phone}
											</td>

											<td>{formatDate(s.birthday)}</td>
											<td>{s.parents_name}</td>
											<td>{s.parents_phone}</td>
											<td>{s.monthly_paid?.toLocaleString() ?? 0} so&apos;m</td>
											<td
												style={{ width: "10px" }}
												onClick={(e) => e.stopPropagation()}
											>
												<button
													className="icon-button"
													onClick={(e) => {
														const rect = e.currentTarget.getBoundingClientRect();

														const menuHeight = 100;
														const menuWidth = 150;

														const scrollY = window.scrollY;
														const scrollX = window.scrollX;

														const absoluteTop = rect.top + scrollY;
														const absoluteBottom = rect.bottom + scrollY;

														const viewportBottom = scrollY + window.innerHeight;
														const viewportRight = scrollX + window.innerWidth;

														const top =
															absoluteBottom + menuHeight > viewportBottom
																? absoluteTop - menuHeight - 8
																: absoluteBottom + 8;

														let left = rect.right + scrollX - menuWidth;
														if (left + menuWidth > viewportRight) {
															left = viewportRight - menuWidth - 10;
														}
														if (left < scrollX) {
															left = scrollX + 10;
														}

														setActionMenu({
															isOpen: true,
															position: {
																top: top + "px",
																left: left + "px",
															},
															student: s,
														});
													}}
												>
													<FaEllipsisV />
												</button>
											</td>
										</tr>
									);
								})}
					</tbody>
				</table>
			)

			}




			<ActionMenu
				isOpen={actionMenu.isOpen}
				position={actionMenu.position}
				onClose={() => setActionMenu((s) => ({ ...s, isOpen: false }))}
				entityLabel="Student"
				onEdit={() => {
					const s = actionMenu.student;
					setEditingStudent(s);
					setIsModalOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onDelete={async () => {
					const s = actionMenu.student;
					if (!s) return;
					await deleteStudent(s.id);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onAddToGroup={() => {
					const s = actionMenu.student;
					if (!s) return;
					setAddToGroupStudent(s);
					setAddToGroupOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
			/>

			<StudentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingStudent}
				onSubmit={async (formData) => {
					if (editingStudent) {
						await updateStudent(editingStudent.id, formData);
					} else {
						await createStudent(formData);
					}
					setIsModalOpen(false);
					setEditingStudent(null);
				}}
			/>

			<AddToGroupModal
				isOpen={addToGroupOpen}
				onClose={() => {
					setAddToGroupOpen(false);
					setAddToGroupStudent(null);
				}}
				initialGroupId={addToGroupStudent?.group_id}
				onConfirm={async (groupId) => {
					if (!addToGroupStudent) return;
					await addToGroup(addToGroupStudent.id, Number(groupId));
					setAddToGroupOpen(false);
					setAddToGroupStudent(null);
				}}
			/>
		</div>
	);
}
