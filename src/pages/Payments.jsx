import Loader from "../components/Loader";
import { usePayments } from "../hooks/usePayments";
import { FaEllipsisV,FaUserGraduate, FaMoneyBillWave, FaSearch, FaUsers } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import ActionMenu from "../components/ActionMenu";

export default function Payments() {
	const { payments, isLoading: loading, createPayment, updatePayment, deletePayment } = usePayments();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPayment, setEditingPayment] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [actionMenu, setActionMenu] = useState({ isOpen: false, position: { top: 0, left: 0 }, payment: null });

	if (loading) return <Loader />;

	return (
		<div className="table-container">
			<h2>
				<FaMoneyBillWave /> To'lovlar
			</h2>

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
					{(payments || [])
						.filter(
							(p) =>
								p.student_name &&
								p.student_name.toLowerCase().includes(searchTerm.toLowerCase()),
						)
						.map((p) => {
							const formatDate = (d) => {
								if (!d) return "";
								return new Date(d).toLocaleDateString();
							};

							return (
								<tr key={p.id}>
									<td>{formatDate(p.paid_at)}</td>
									<td>{p.student_name}</td>
									<td>{p.group_name}</td>
									<td>{p.amount.toLocaleString()} so'm</td>
									<td>{p.method}</td>
									<td style={{width:"10px"}}>
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
	);
}