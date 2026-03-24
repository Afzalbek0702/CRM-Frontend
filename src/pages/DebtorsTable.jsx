import { useMemo } from "react";
import Loader from "../components/Loader";
import { usePayments } from "../services/payment/usePayments";
import { useStudent } from "../services/student/useStudent";

// Icons
import {
	FaUserGraduate,
	FaUsers,
	FaMoneyCheckAlt,
	FaClock,
	FaExclamationTriangle,
} from "react-icons/fa";
import {
	GraduationCap,
	Users,
	Tag,
	CheckCircle2,
	AlertCircle,
	History,
} from "lucide-react";
// shadcn UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

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
		<div className="w-full space-y-6">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="bg-[#1F1F1F] p-5 rounded-lg border border-red-900/30 shadow-sm flex items-center gap-4">
					<div className="bg-red-500/10 p-3 rounded-full">
						<FaExclamationTriangle className="text-red-500 text-xl" />
					</div>
					<div>
						<p className="text-gray-400 text-sm">Jami qarz miqdori</p>
						<h3 className="text-primary text-2xl font-bold">
							{totalOutstandingDebt.toLocaleString()} so'm
						</h3>
					</div>
				</div>

				<div className="bg-[#1F1F1F] p-5 rounded-lg border border-gray-800 shadow-sm flex items-center gap-4">
					<div className="bg-blue-500/10 p-3 rounded-full">
						<FaUsers className="text-blue-500 text-xl" />
					</div>
					<div>
						<p className="text-gray-400 text-sm">Qarzdorlar soni</p>
						<h3 className="text-white text-2xl font-bold">
							{numberOfDebtors} ta o'quvchi
						</h3>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border overflow-hidden shadow-lg">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<GraduationCap className="h-4 w-4" /> O'quvchi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4" /> Guruh
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Tag className="h-4 w-4" /> Kurs narxi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4" /> To'langan
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<AlertCircle className="h-4 w-4" /> Qolgan qarz
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<History className="h-4 w-4" /> Oxirgi to'lov
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{filtered.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-10 text-gray-500"
								>
									Qarzdorlar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							filtered.map((d) => (
								<TableRow key={d.id} className="bg-card">
									<TableCell className="font-medium text-white">
										{d.student_name}
									</TableCell>
									<TableCell>{d.group_name}</TableCell>
									<TableCell>{d.course_price.toLocaleString()} so'm</TableCell>
									<TableCell className="text-green-500">
										{d.total_paid.toLocaleString()} so'm
									</TableCell>
									<TableCell className="text-red-500 font-bold">
										{d.remaining.toLocaleString()} so'm
									</TableCell>
									<TableCell className="text-gray-400">
										{d.last_payment
											? new Date(d.last_payment).toLocaleDateString()
											: "-"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
