import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useGroups } from "../hooks/useGroups";
import { useAttendance } from "../hooks/useAttendance";
import { useStudents } from "../hooks/useStudents";
import { usePayments } from "../hooks/usePayments";
import {useTeachers} from "../hooks/useTeachers";
import PaymentModal from "../components/PaymentModal";
import { FaArrowLeft, FaEllipsisV, FaSearch } from "react-icons/fa";


export default function GuruhlarInfo() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { loading, error, fetchById, groups } = useGroups();
	const { transferToGroup, removeFromGroup } = useStudents();
   const { createPayment } = usePayments();
   const { teachers} = useTeachers();
	const [group, setGroup] = useState(null);
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		student: null,
	});
	const [transferStudent, setTransferStudent] = useState(null);
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedStudentForPayment, setSelectedStudentForPayment] =
      useState(null);
   const [month, setMonth] = useState('')
	const { attendance, setAttendance } = useAttendance({
		group_id: id,
		month: month + '-01' || new Date().toISOString().slice(0, 7) + '-01',
	});
	console.log(month);

	useEffect(() => {
		fetchById(id).then((data) => {
			setGroup(data);
			setStudents(data.students || []);
         setMonth(new Date().toISOString().slice(0, 7))
		});
	}, []);

	if (loading || !group) return <Loader />;
	if (error) return <p>{error}</p>;

	const handleToggle = async (studentId, date, newStatus) => {
		await setAttendance.mutateAsync({
			student_id: studentId,
			group_id: id,
			lesson_date: date,
			status: newStatus,
		});
	};

	const filteredStudents = students.filter(
		(s) =>
			s.full_name &&
			s.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleActionMenu = (e, student) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const menuHeight = 150;
		const topPosition = rect.bottom + window.scrollY + 8;
		const shouldShowAbove = topPosition + menuHeight > viewportHeight;

		setActionMenu({
			isOpen: true,
			position: {
				top: shouldShowAbove
					? rect.top + window.scrollY - menuHeight + "px"
					: topPosition + "px",
				left: Math.max(10, rect.right + window.scrollX - 150) + "px",
			},
			student: student,
		});
	};

	const handleRemoveFromGroup = async (studentId) => {
		try {
			await removeFromGroup(studentId, id);
			setStudents((prev) => prev.filter((s) => s.id !== studentId));
			setActionMenu((s) => ({ ...s, isOpen: false }));
		} catch (err) {
			console.error("Failed to remove student", err);
		}
	};

	const handleTransferStudent = async (targetGroupId) => {
		console.log(transferStudent.id, group.id, Number(targetGroupId));

		try {
			await transferToGroup({
				student_id: transferStudent.id,
				from_group_id: id,
				to_group_id: Number(targetGroupId),
			});
			setStudents((prev) => prev.filter((s) => s.id !== transferStudent.id));
			setShowTransferModal(false);
			setTransferStudent(null);
		} catch (err) {
			console.error("Failed to transfer student", err);
		}
	};

	const handlePaymentSubmit = async (formData) => {
		try {
			await createPayment({
				student_id: selectedStudentForPayment.id,
				group_id: Number(id),
				amount: formData.amount,
				method: formData.method,
				paid_month: formData.paid_at + '-01',
			});
			setShowPaymentModal(false);
			setSelectedStudentForPayment(null);
		} catch (err) {
			console.error("Failed to create payment", err);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "100%",
			}}
		>
			<button
				onClick={() => navigate(-1)}
				className="btn1"
				style={{ marginBottom: "20px" , cursor : "pointer"}}
			>
				<FaArrowLeft /> Back
			</button>

			<div style={{ display: "flex", gap: "30px", flex: 1, minHeight: 0 }}>
				{/* Left Panel - Group Info and Students */}
				<div
					style={{
						flex: "0 0 500px",
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
				>
					{/* Group Info Card */}
					<div
						style={{
							background: "var(--background-color-secondary)",
							padding: "20px",
							borderRadius: "8px",
							marginBottom: "20px",
						}}
					>
						<h2 style={{ marginBottom: "15px", color: "white" }}>
							{group.name}
						</h2>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "12px",
								fontSize: "14px",
							}}
						>
							<div>
								<p
									style={{
										color: "var(--text-secondary)",
										marginBottom: "4px",
									}}
								>
									Kurs turi
								</p>
								<p style={{ color: "white", fontWeight: "600" }}>
									{group.course_type}
								</p>
							</div>
							<div>
								<p
									style={{
										color: "var(--text-secondary)",
										marginBottom: "4px",
									}}
								>
									Narx
								</p>
								<p style={{ color: "white", fontWeight: "600" }}>
									{group.price}
								</p>
							</div>
							<div>
								<p
									style={{
										color: "var(--text-secondary)",
										marginBottom: "4px",
									}}
								>
									Dars vaqti
								</p>
								<p style={{ color: "white", fontWeight: "600" }}>
									{group.lesson_time}
								</p>
							</div>
							<div>
								<p
									style={{
										color: "var(--text-secondary)",
										marginBottom: "4px",
									}}
								>
									O'qituvchi
								</p>
								<p style={{ color: "white", fontWeight: "600" }}>
									{teachers.find(t => t.id === group.teacher_id)?.full_name || 'Noma\'lum'}
								</p>
							</div>
							<div style={{ gridColumn: "1 / -1" }}>
								<p
									style={{
										color: "var(--text-secondary)",
										marginBottom: "4px",
									}}
								>
									Dars kunlari
								</p>
								<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
									{Array.isArray(group.lesson_days) ? (
										group.lesson_days.map((day) => (
											<span
												key={day}
												className="day-pill"
												style={{ padding: "6px 12px", borderRadius: "20px" }}
											>
												{day}
											</span>
										))
									) : (
										<span className="day-pill">{group.lesson_days}</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Students List */}
					<div
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							minHeight: 0,
						}}
					>
						<h3 style={{ color: "white", marginBottom: "12px" }}>
							O'quvchilar ({filteredStudents.length})
						</h3>

						<div
							className="search-box-compact"
							style={{ marginBottom: "12px" }}
						>
							<FaSearch />
							<input
								type="text"
								placeholder="Qidirish..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div
							style={{
								flex: 1,
								overflowY: "auto",
								borderRadius: "8px",
								border: "1px solid var(--border-color)",
								minHeight: 0,
							}}
						>
							{students.length === 0 ? (
								<p style={{ padding: "20px", color: "var(--text-secondary)" }}>
									Bu guruhda hali o'quvchilar yo'q
								</p>
							) : (
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<thead>
										<tr
											style={{
												backgroundColor: "var(--primary-color)",
												position: "sticky",
												top: 0,
											}}
										>
											<th
												style={{
													padding: "12px",
													textAlign: "left",
													color: "black",
													fontWeight: "600",
													borderBottom: "1px solid var(--border-color)",
												}}
											>
												Ism
											</th>
											<th
												style={{
													padding: "12px",
													textAlign: "center",
													color: "black",
													fontWeight: "600",
													width: "50px",
													borderBottom: "1px solid var(--border-color)",
												}}
											></th>
										</tr>
									</thead>
									<tbody>
										{filteredStudents.map((student) => (
											<tr
												key={student.id}
												style={{
													borderBottom: "1px solid var(--border-color)",
													backgroundColor: "var(--background-color-secondary)",
												}}
											>
												<td
													style={{
														padding: "12px",
														color: "white",
														fontSize: "14px",
													}}
												>
													{student.full_name}
												</td>
												<td
													style={{
														padding: "12px",
														textAlign: "center",
													}}
												>
													<button
														className="icon-button"
														onClick={(e) => handleActionMenu(e, student)}
														style={{ padding: "4px" }}
													>
														<FaEllipsisV />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				{/* Right Panel - Attendance */}
				<div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<h3 style={{ color: "white", marginBottom: "15px" }}>Davomat</h3>
						<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
					</div>
					{attendance.length === 0 ? (
						<p style={{ color: "var(--text-secondary)" }}>
                     Davomat ma'lumoti mavjud emas
						</p>
					) : (
						<div className="attendance-scroll">
							<table className="attendance-table">
								<thead>
									<tr>
										<th>O'quvchi</th>
										{attendance[0]?.days.map((day, idx) => (
											<th key={idx}>
												{new Date(day.date).getDate()}
												<br />
												{new Date(day.date).toLocaleDateString("uz-UZ", {
													weekday: "short",
												})}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{attendance.map((student) => (
										<tr key={student.student_id}>
											<td
												style={{
													background: "var(--background-color-secondary)",
												}}
											>
												{student.full_name}
											</td>
											{student.days.map((day, idx) => (
												<td
													key={idx}
													style={{
														textAlign: "center",
														background: "var(--background-color-secondary)",
													}}
												>
													<input
														type="checkbox"
														className="attendance-checkbox"
														checked={day.status}
														onChange={() =>
															handleToggle(
																student.student_id,
																day.date,
																!day.status,
															)
														}
													/>
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Action Menu */}
			{actionMenu.isOpen && (
				<div
					className="action-menu"
					style={{
						top: actionMenu.position.top,
						left: actionMenu.position.left,
					}}
				>
					<button
						className="action-item"
						onClick={() => {
							setSelectedStudentForPayment(actionMenu.student);
							setShowPaymentModal(true);
							setActionMenu((s) => ({ ...s, isOpen: false }));
						}}
					>
						Yangi to'lov
					</button>
					<button
						className="action-item"
						onClick={() => {
							setTransferStudent(actionMenu.student);
							setShowTransferModal(true);
							setActionMenu((s) => ({ ...s, isOpen: false }));
						}}
					>
						Boshqa guruhga o'tkazish
					</button>
					<button
						className="action-item delete"
						onClick={() => {
							if (
								window.confirm(
									`${actionMenu.student.full_name} ni guruhdan olib tashlamoqchimisiz?`,
								)
							) {
								handleRemoveFromGroup(actionMenu.student.id);
							}
						}}
					>
						Guruhdan olib tashlash
					</button>
				</div>
			)}

			{/* Transfer Modal */}
			{showTransferModal && transferStudent && (
				<>
					<div
						className="side-panel-backdrop"
						onClick={() => setShowTransferModal(false)}
					></div>
					<div className="side-panel" onClick={(e) => e.stopPropagation()}>
						<div className="panel-header">
							<div className="panel-title-section">
								<div>
									<h2>Guruhga o'tkazish</h2>
									<p className="panel-subtitle">
										{transferStudent.full_name} ni boshqa guruhga o'tkazing
									</p>
								</div>
							</div>
							<button
								className="close-button"
								onClick={() => setShowTransferModal(false)}
							>
								✕
							</button>
						</div>
						<div className="modal-form">
							<div className="form-group full-width">
								<label className="form-label">Yangi guruh tanlang</label>
								<select
									id="transfer-group-select"
									className="form-input"
									defaultValue=""
								>
									<option value="">-- Guruh tanlang --</option>
									{groups
										.filter((g) => g.id !== parseInt(id))
										.map((g) => (
											<option key={g.id} value={g.id}>
												{g.name}
											</option>
										))}
								</select>
							</div>
							<div className="panel-buttons">
								<button
									type="button"
									className="btn-cancel"
									onClick={() => setShowTransferModal(false)}
								>
									Bekor qilish
								</button>
								<button
									type="button"
									className="btn-submit"
									onClick={() => {
										const selectElement = document.getElementById(
											"transfer-group-select",
										);
										const selectedGroupId = selectElement.value;
										if (selectedGroupId) {
											handleTransferStudent(selectedGroupId);
										}
									}}
								>
									O'tkazish
								</button>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Payment Modal */}
			<PaymentModal
				isOpen={showPaymentModal}
				onClose={() => {
					setShowPaymentModal(false);
					setSelectedStudentForPayment(null);
				}}
				initialData={{
					student_id: selectedStudentForPayment?.id,
					group_id: id,
					paid_at: new Date().toISOString().split("T")[0],
				}}
				onSubmit={handlePaymentSubmit}
			/>

			{/* Click outside to close action menu */}
			{actionMenu.isOpen && (
				<div
					onClick={() => setActionMenu((s) => ({ ...s, isOpen: false }))}
					style={{ position: "fixed", inset: 0, zIndex: 999 }}
				/>
			)}
		</div>
	);
}
