import { useMemo } from "react";
import Loader from "../components/Loader";
import { usePayments } from "../services/payment/usePayments";
import { useStudent } from "../services/student/useStudent"; // adjust if needed

export default function DebtorsTable({ searchTerm = "" }) {
	const { payments, isLoading: paymentsLoading } = usePayments();
	const { students, isLoading: studentsLoading } = useStudent();

	const isLoading = paymentsLoading || studentsLoading;

	const debtorsData = useMemo(() => {
		if (!students || !payments) return [];

		return students
			.map((student) => {
				const studentPayments = payments.filter(
					(p) => p.student_id === student.id,
				);

				const totalPaid = studentPayments.reduce(
					(sum, p) => sum + (p.amount || 0),
					0,
				);

				const remaining = (student.course_price || 0) - totalPaid;

				return {
					id: student.id,
					student_name: student.full_name,
					group_name: student.group_name,
					course_price: student.course_price || 0,
					total_paid: totalPaid,
					remaining,
					last_payment: studentPayments.length
						? studentPayments[studentPayments.length - 1].paid_at
						: null,
				};
			})
			.filter((s) => s.remaining > 0);
	}, [students, payments]);

	const filtered = debtorsData.filter((d) =>
		d.student_name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const totalOutstandingDebt = filtered.reduce(
		(sum, d) => sum + d.remaining,
		0,
	);

	const numberOfDebtors = filtered.length;

	if (isLoading) return <Loader />;

	return (
		<div className="table-container">
			{/* Summary Section */}
			<div className="debt-summary">
				<div>
					<strong>Jami qarz:</strong>{" "}
					{totalOutstandingDebt.toLocaleString()} so'm
				</div>
				<div>
					<strong>Qarzdorlar soni:</strong> {numberOfDebtors}
				</div>
			</div>

			{/* Table */}
			<table>
				<thead>
					<tr>
						<th>O'quvchi</th>
						<th>Guruh</th>
						<th>Kurs narxi</th>
						<th>To'langan</th>
						<th>Qolgan</th>
						<th>Oxirgi to'lov</th>
					</tr>
				</thead>

				<tbody>
					{filtered.length === 0 ? (
						<tr>
							<td colSpan="6">Qarzdorlar topilmadi.</td>
						</tr>
					) : (
						filtered.map((d) => (
							<tr key={d.id}>
								<td>{d.student_name}</td>
								<td>{d.group_name}</td>
								<td>{d.course_price.toLocaleString()} so'm</td>
								<td>{d.total_paid.toLocaleString()} so'm</td>
								<td style={{ color: "red" }}>
									{d.remaining.toLocaleString()} so'm
								</td>
								<td>
									{d.last_payment
										? new Date(d.last_payment).toLocaleDateString()
										: "-"}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
