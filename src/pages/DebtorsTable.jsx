import { useMemo } from "react";
import Loader from "../components/Loader";
import { usePayments } from "../services/payment/usePayments";
import { useStudent } from "../services/student/useStudent"; // adjust if needed
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button";
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
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>O'quvchi</TableHead>
						<TableHead>Guruh</TableHead>
						<TableHead>Kurs narxi</TableHead>
						<TableHead>To'langan</TableHead>
						<TableHead>Qolgan</TableHead>
						<TableHead>Oxirgi to'lov</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{filtered.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6}>
								Qarzdorlar topilmadi.
							</TableCell>
						</TableRow>
					) : (
						filtered.map((d) => (
							<TableRow key={d.id}>
								<TableCell>{d.student_name}</TableCell>

								<TableCell>{d.group_name}</TableCell>

								<TableCell>
									{d.course_price.toLocaleString()} so'm
								</TableCell>

								<TableCell>
									{d.total_paid.toLocaleString()} so'm
								</TableCell>

								<TableCell style={{ color: "red" }}>
									{d.remaining.toLocaleString()} so'm
								</TableCell>

								<TableCell>
									{d.last_payment
										? new Date(
											d.last_payment
										).toLocaleDateString()
										: "-"}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
