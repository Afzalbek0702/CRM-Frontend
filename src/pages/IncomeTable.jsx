import { useState } from "react";
import { usePayments } from "../services/payment/usePayments";
import Loader from "../components/Loader";
import PaymentModal from "../components/PaymentModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
// Icons
import {
	FaEllipsisV,
	FaUserGraduate,
	FaMoneyBillWave,
	FaUsers,
	FaEdit,
	FaTrash,
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";

// shadcn UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	UserCircle,
	Users,
	Banknote,
	CreditCard,
	MoreHorizontal,
} from "lucide-react";
export default function IncomeTable() {
	const { payments, isLoading, createPayment, updatePayment, deletePayment } =
		usePayments();

	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);

	if (isLoading) return <Loader />;

	const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

	const handleFormSubmit = async (formData) => {
		if (modal.data) {
			await updatePayment(modal.data.id, formData);
		} else {
			await createPayment(formData);
		}
		setModal({ isOpen: false, data: null });
	};

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deletePayment(deleteId);
			setDeleteId(null);
		}
	};

	return (
		<div className="w-full h-auto text-white overflow-x-auto">
			{/* Jadval qismi */}
			<div className="rounded-md border overflow-hidden shadow-lg">
				<Table>
					<TableHeader>
						<TableRow className="bg-primary hover:bg-primary/95 transition-colors">
							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" /> Sana
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<UserCircle className="h-4 w-4" /> O'quvchi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4" /> Guruh
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<Banknote className="h-4 w-4" /> Miqdor
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<CreditCard className="h-4 w-4" /> Tur
								</div>
							</TableHead>

							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{(payments || []).length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-10 text-gray-500"
								>
									To'lovlar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							payments.map((p) => (
								<TableRow key={p.id} className="bg-card">
									<TableCell>{formatDate(p.paid_at)}</TableCell>
									<TableCell className="font-medium">
										{p.student_name}
									</TableCell>
									<TableCell>{p.group_name}</TableCell>
									<TableCell className="text-primary font-semibold">
										{p.amount?.toLocaleString() ?? 0} so'm
									</TableCell>
									<TableCell>
										<span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">
											{p.method}
										</span>
									</TableCell>
									<TableCell className={"flex justify-end"}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 hover:bg-gray-700 text-white"
												>
													<FaEllipsisV />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-32 bg-card border-gray-700 text-white"
											>
												<DropdownMenuItem
													className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
													onClick={() => setModal({ isOpen: true, data: p })}
												>
													<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
													onClick={() => setDeleteId(p.id)}
												>
													<FaTrash className="mr-2 text-red-500" /> O'chirish
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Modal Komponenti */}
			<PaymentModal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false, data: null })}
				initialData={modal.data}
				onSubmit={handleFormSubmit}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
