import Loader from "../components/Loader.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../hooks/useStudents.js";

import { FaEllipsisV, FaUserGraduate, FaPhone, FaBirthdayCake, FaUsers, FaWallet } from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import StudentModal from "../components/StudentModal.jsx";
import ActionMenu from "../components/ActionMenu.jsx";
import AddToGroupModal from "../components/AddToGroupModal.jsx";


export default function Students() {
	const navigate = useNavigate();
	const { students, loading, error, createStudent, updateStudent, deleteStudent, addToGroup } = useStudents();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState(null);

	const [searchTerm, setSearchTerm] = useState("");

	// action menu state
	const [actionMenu, setActionMenu] = useState({ isOpen: false, position: { top: 0, left: 0 }, student: null });
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);
	const [addToGroupStudent, setAddToGroupStudent] = useState(null);

	const handleRowClick = (studentId) => {
		navigate(`/students/${studentId}`);
	};
	console.log(students);

	if (loading) return <Loader />;
	if (error) return <div>Error</div>;
	return (
		<div className="table-container">
			<div className="students-header">
				<h2><FaUserGraduate /> Students</h2>
			</div>

			<div className="table-actions">
				<div className="search-box">
					<FaSearch />
					<input
						type="text"
						placeholder="Search student by name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<button className="btn1" onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}>New Student</button>
			</div>
			<table>
				<thead>
					<tr>
						<th><FaUserGraduate /> Full Name</th>
						<th><FaUsers /> Group Name</th>
						<th><FaPhone /> Phone</th>
						<th><FaBirthdayCake /> Birthday</th>
						<th><FaUsers /> Parents</th>
						<th><FaWallet /> Balance</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{(students || [])
						.filter((s) => s.full_name && s.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
									<td>{s.groups[0] || "No Group"}</td>
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
									<td>{s.monthly_paid?.toLocaleString() ?? 0} so&apos;m</td>
									<td onClick={(e) => e.stopPropagation()}>
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
				onClose={() => { setAddToGroupOpen(false); setAddToGroupStudent(null); }}
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
