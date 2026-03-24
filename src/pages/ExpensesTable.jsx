import { useState } from "react";
import Loader from "../components/Loader";
import ExpenseModal from "../components/ExpenseModal";
import { useExpenses } from "../services/expense/useExpense";
// Icons
import {
	FaEllipsisV,
	FaMoneyBillWave,
	FaUser,
	FaPlus,
	FaEdit,
	FaTrash,
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";
import {
	Calendar,
	FileText,
	Banknote,
	CreditCard,
	UserPlus,
	MoreHorizontal,
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ExpensesTable() {
	const { expenses, isLoading, createExpense, updateExpense, deleteExpense } =
		useExpenses();

	const [modal, setModal] = useState({ isOpen: false, data: null });

	if (isLoading) return <Loader />;

	const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

	const totalExpenses = (expenses || []).reduce(
		(sum, e) => sum + (e.amount || 0),
		0,
	);

	return (
		<div className="w-full h-auto text-white overflow-x-auto">
			{/* Summary Card */}
			<div className="flex justify-between items-end mb-4">
				<div className="bg-[#1F1F1F] p-4 rounded-md mb-6 border inline-block">
					<strong className="text-gray-400">Jami harajatlar:</strong>{" "}
					<span className="text-[var(--primary)] text-xl ml-2 font-bold">
						{totalExpenses.toLocaleString()} so'm
					</span>
				</div>

				{/* Actions */}
				<div className="flex justify-between items-center mb-7.5 gap-5">
					<Button
						className="bg-[var(--primary)] text-black hover:opacity-90 flex gap-2 items-center"
						onClick={() => setModal({ isOpen: true, data: null })}
					>
						<FaPlus /> Xarajat qo'shish
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" /> Sana
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4" /> Tavsif
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<Banknote className="h-4 w-4" /> Miqdor
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<CreditCard className="h-4 w-4" /> To'lov turi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<UserPlus className="h-4 w-4" /> Kiritgan
								</div>
							</TableHead>

							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{(expenses || []).length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-10 text-gray-500"
								>
									Xarajatlar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							expenses.map((e) => (
								<TableRow key={e.id} className="bg-card">
									<TableCell>{formatDate(e.created_at)}</TableCell>
									<TableCell>{e.description}</TableCell>
									<TableCell className="font-semibold text-primary">
										{e.amount?.toLocaleString() ?? 0} so'm
									</TableCell>
									<TableCell>
										<span className="bg-gray-800 px-2 py-1 rounded text-xs">
											{e.method}
										</span>
									</TableCell>
									<TableCell>{e.created_by}</TableCell>
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
													onClick={() => setModal({ isOpen: true, data: e })}
												>
													<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
													onClick={() => setDeleteId(e.id)}
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

			<ExpenseModal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false, data: null })}
				initialData={modal.data}
				onSubmit={(formData) => {
					if (modal.data) {
						updateExpense(modal.data.id, formData);
					} else {
						createExpense(formData);
					}
					setModal({ isOpen: false, data: null });
				}}
			/>
		</div>
	);
}
