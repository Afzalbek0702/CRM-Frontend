import Loader from "../components/Loader";
import { usePayments } from "../hooks/usePayments";
import { useParams } from "react-router-dom";
import {
	FaEllipsisV,
	FaUserGraduate,
	FaMoneyBillWave,
	FaSearch,
	FaUsers,
} from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import ActionMenu from "../components/ActionMenu";

export default function Payments() {
	const { category: rawCategory } = useParams();
	const category = rawCategory ?? "payments";


	const {
		payments,
		isLoading,
		error,
		createPayment,
		updatePayment,
		deletePayment,
	} = usePayments();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPayment, setEditingPayment] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		payment: null,
	});

	if (isLoading) return <Loader />;

	console.log("category:", category);




	const validCategories = ["payments", "income", "salary", "debtors", "expenses"];
	if (!validCategories.includes(category)) {
		return <p>Invalid category</p>;
	}

	return (
		<div className="payments-container">
			<h2>
				<FaMoneyBillWave /> {category}
			</h2>

			{(category === "payments" || category === "debtors") && (
				<div className="payments-search-box">
					<FaSearch />
					<input
						type="text"
						placeholder="Search by student name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			)}

			<div className="payments-table-container">
				{category === "payments" && (
					<div className="table-container">
						<div className="payments-header">
							<h2>
								<FaMoneyBillWave /> To'lovlar
							</h2>
						</div>

						<div className="table-actions">
							<div className="search-box">
								<FaSearch />
								<input
									type="text"
									placeholder="To'lovlarni o'quvchi bo'yicha qidirish..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>

						<table>
							<thead>
								<tr>
									<th>
										<BsCalendar2DateFill /> Sana
									</th>
									<th>
										<FaUserGraduate /> O'quvchi
									</th>
									<th>
										<FaUsers /> Guruh
									</th>
									<th>
										<FaMoneyBillWave /> Miqdor
									</th>
									<th>
										<BsCreditCard2BackFill /> Tur
									</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{(payments || []).map((p) => {
									const formatDate = (d) =>
										d ? new Date(d).toLocaleDateString() : "";

									return (
										<tr key={p.id}>
											<td>{formatDate(p.paid_at)}</td>
											<td>{p.student_name}</td>
											<td>{p.group_name}</td>
											<td>{p.amount?.toLocaleString() ?? 0} so'm</td>
											<td>{p.method}</td>
											<td style={{ width: "10px" }}>
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
															payment: p,
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
							entityLabel="Payment"
							onEdit={() => {
								const p = actionMenu.payment;
								setEditingPayment(p);
								setIsModalOpen(true);
								setActionMenu((m) => ({ ...m, isOpen: false }));
							}}
							onDelete={async () => {
								const p = actionMenu.payment;
								if (!p) return;
								await deletePayment(p.id);
								setActionMenu((m) => ({ ...m, isOpen: false }));
							}}
						/>

						<PaymentModal
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							initialData={editingPayment}
							onSubmit={async (formData) => {
								if (editingPayment) {
									await updatePayment(editingPayment.id, formData);
								} else {
									await createPayment(formData);
								}
								setIsModalOpen(false);
								setEditingPayment(null);
							}}
						/>
					</div>
				)}

				{/* {category === "salary" && (
					<table>
						<thead>
							<tr>
								<th>Teacher</th>
								<th>Amount</th>
								<th>Month</th>
							</tr>
						</thead>
						<tbody>
							{salaries?.map(s => (
								<tr key={s.id}>
									<td>{s.teacher_name}</td>
									<td>{s.amount?.toLocaleString()} so'm</td>
									<td>{s.month}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				{category === "debtors" && (
					<table>
						<thead>
							<tr>
								<th>Student</th>
								<th>Debt</th>
							</tr>
						</thead>
						<tbody>
							{debtors
								?.filter(d =>
									d.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
								)
								.map(d => (
									<tr key={d.id}>
										<td>{d.student_name}</td>
										<td className="debt">
											{d.debt?.toLocaleString()} so'm
										</td>
									</tr>
								))}
						</tbody>
					</table>
				)}

				{category === "expenses" && (
					<table>
						<thead>
							<tr>
								<th>Title</th>
								<th>Amount</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{expenses?.map(e => (
								<tr key={e.id}>
									<td>{e.title}</td>
									<td>{e.amount?.toLocaleString()} so'm</td>
									<td>{e.date?.split("T")[0]}</td>
								</tr>
							))}
						</tbody>
					</table>
				)} */}
			</div>
		</div>
	);
}
