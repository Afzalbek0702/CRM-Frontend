import { useState } from "react";
import Loader from "../components/Loader";
import SalaryModal from "../components/SalaryModal";
import { useSalary } from "../services/salary/useSalary";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
// Icons
import {
	FaEllipsisV,
	FaUserTie,
	FaMoneyBillWave,
	FaPlus,
	FaEdit,
	FaTrash,
} from "react-icons/fa";
import {
	CalendarDays,
	UserCheck,
	Wallet,
	Landmark,
	StickyNote,
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

export default function SalaryTable() {
	const { salary, isLoading, createSalary, updateSalary, deleteSalary } =
		useSalary();

	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);

	if (isLoading) return <Loader />;

	const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

	const totalSalaryPaid = (salary || []).reduce(
		(sum, s) => sum + (s.amount || 0),
		0,
	);

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteSalary(deleteId);
			setDeleteId(null);
		}
	};

	return (
		<div className="w-full h-auto text-white overflow-x-auto">
			{/* Yuqori qism: Tugma va Summary */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div className="p-4 rounded-md border border-gray-800 shadow-sm">
					<strong className="text-gray-400">Jami to'langan ish haqi:</strong>{" "}
					<span className="text-primary text-xl ml-2 font-bold">
						{totalSalaryPaid.toLocaleString()} so'm
					</span>
				</div>
				<Button
					className="btn-default bg-primary text-black hover:opacity-90 flex items-center gap-2"
					onClick={() => setModal({ isOpen: true, data: null })}
				>
					<FaPlus /> Yangi ish haqi
				</Button>
			</div>

			{/* Jadval */}
			<div className="rounded-md border overflow-hidden shadow-xs">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<CalendarDays className="h-4 w-4" /> Sana
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<UserCheck className="h-4 w-4" /> Xodim
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<Wallet className="h-4 w-4" /> Miqdor
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<Landmark className="h-4 w-4" /> To'lov turi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold">
								<div className="flex items-center gap-2">
									<StickyNote className="h-4 w-4" /> Izoh
								</div>
							</TableHead>

							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{(salary || []).length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-10 text-gray-500"
								>
									To'langan ish haqlari topilmadi.
								</TableCell>
							</TableRow>
						) : (
							salary.map((s) => (
								<TableRow
									key={s.id}
									className="bg-card border-b transition-colors duration-500"
								>
									<TableCell className="whitespace-nowrap">
										{formatDate(s.created_at)}
									</TableCell>
									<TableCell className="font-medium">
										{s.worker?.full_name}
									</TableCell>
									<TableCell className="text-primary font-semibold">
										{s.amount?.toLocaleString() ?? 0} so'm
									</TableCell>
									<TableCell>
										<span className="bg-gray-800 px-2.5 py-1 rounded-full text-xs">
											{s.method}
										</span>
									</TableCell>
									<TableCell
										className="max-w-50 truncate"
										title={s.description}
									>
										{s.description || "-"}
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
												className="w-32 bg-[#1F1F1F] border-gray-700 text-white"
											>
												<DropdownMenuItem
													className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
													onClick={() => setModal({ isOpen: true, data: g })}
												>
													<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
													onClick={() => setDeleteId(s.id)}
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

			{/* Modal */}
			<SalaryModal
				isOpen={modal.isOpen}
				initialData={modal.data}
				onClose={() => setModal({ isOpen: false, data: null })}
				onSubmit={(data) => {
					if (modal.data) {
						updateSalary(modal.data.id, data);
					} else {
						createSalary(data);
					}
					setModal({ isOpen: false, data: null });
				}}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
