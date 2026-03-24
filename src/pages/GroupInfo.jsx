import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PaymentModal from "../components/PaymentModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

// Hooks & Services
import { useGroups } from "../services/group/useGroups";
import { useAttendance } from "../services/attendance/useAttendance";
import { useStudent } from "../services/student/useStudent";
import { usePayments } from "../services/payment/usePayments";
import { useTeachers } from "../services/teacher/useTeachers";
import { useNavigate } from "react-router-dom";

// Icons
import {
	FaEllipsisV,
	FaSearch,
	FaArrowLeft,
	FaMoneyCheckAlt,
	FaExchangeAlt,
	FaUserMinus,
} from "react-icons/fa";

// shadcn UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "@/components/ui/input-group";
import { getUzDays } from "@/utils/weekday";

export default function GuruhlarInfo() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { loading, error, fetchById } = useGroups();
	const { removeFromGroup } = useStudent();
	const { createPayment } = usePayments();
	const { teachers } = useTeachers();

	const [group, setGroup] = useState(null);
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

	// Modal states
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [deleteId, setDeleteId] = useState(null);

	const {
		attendance,
		updateLocalAttendance,
		saveAttendance,
		isSaving,
		isDirty,
	} = useAttendance({ group_id: id, month });

	useEffect(() => {
		fetchById(id).then((data) => {
			setGroup(data);
			setStudents(data.students || []);
		});
	}, [id]);

	if (loading || !group) return <Loader />;
	if (error) return <p className="text-red-500 p-6">{error}</p>;

	const months = Array.from({ length: 12 }, (_, i) => {
		const date = new Date(new Date().getFullYear(), i, 1);
		return {
			value: date.toISOString().slice(0, 7),
			label: date.toLocaleString("uz-UZ", { month: "long", year: "numeric" }),
		};
	});

	const filteredStudents = students.filter((s) =>
		s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleRemoveStudent = async () => {
		if (deleteId) {
			await removeFromGroup(deleteId, id);
			setStudents((prev) => prev.filter((s) => s.id !== deleteId));
			setDeleteId(null);
		}
	};

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			{/* Back Button */}
			<Button onClick={() => navigate(-1)} className="btn-default">
				<FaArrowLeft /> Ortga qaytish
			</Button>

			<div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
				{/* LEFT PANEL: Group Info & Students */}
				<div className="xl:col-span-4 space-y-6">
					<Card className="bg-[#1f1f1f] border-[#ffffff1a] text-white">
						<CardHeader className="border-b border-[#ffffff1a]">
							<CardTitle className="text-[#fcd34d] text-2xl font-bold">
								{group.name}
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 gap-4 pt-6 text-sm">
							<div>
								<p className="text-gray-500">Kurs turi</p>
								<p className="font-semibold text-white">{group.course_type}</p>
							</div>
							<div className="text-right">
								<p className="text-gray-500">Narx</p>
								<p className="font-semibold text-[#fcd34d]">{group.price}</p>
							</div>
							<div>
								<p className="text-gray-500">Dars vaqti</p>
								<p className="font-semibold text-white">{group.lesson_time}</p>
							</div>
							<div className="text-right">
								<p className="text-gray-500">O'qituvchi</p>
								<p className="font-semibold text-white">
									{teachers.find((t) => t.id === group.teacher_id)?.full_name ||
										"Noma'lum"}
								</p>
							</div>
							<div className="col-span-2 pt-2">
								<p className="text-gray-500 mb-2">Dars kunlari</p>
								<div className="flex flex-wrap gap-2">
									{getUzDays(group.lesson_days).map((day) => (
										<span
											key={day}
											className="day-pill px-2.5 py-0.5 rounded-[10px] bg-primary text-black"
										>
											{day}
										</span>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Student List Section */}
					<div className="bg-[#1f1f1f] p-5 rounded-lg border border-[#ffffff1a] flex flex-col h-125">
						<h3 className="text-lg font-bold mb-4">
							O'quvchilar ({filteredStudents.length})
						</h3>
						<InputGroup className="bg-black/40 border-[#ffffff26] mb-4">
							<InputGroupInput
								placeholder="Ism bo'yicha qidirish..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="text-white"
							/>
							<InputGroupAddon>
								<FaSearch className="text-gray-500" />
							</InputGroupAddon>
						</InputGroup>

						<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
							<Table>
								<TableBody>
									{filteredStudents.map((student) => (
										<TableRow
											key={student.id}
											className="border-[#ffffff1a] hover:bg-white/5"
										>
											<TableCell className="py-4 font-medium text-gray-200">
												{student.full_name}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="text-gray-500 hover:text-[#fcd34d]"
														>
															<FaEllipsisV />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="bg-[#1f1f1f] border-[#ffffff1a] text-white w-44"
													>
														<DropdownMenuItem
															onClick={() => {
																setSelectedStudent(student);
																setShowPaymentModal(true);
															}}
														>
															<FaMoneyCheckAlt className="mr-2 text-[#fcd34d]" />{" "}
															To'lov qilish
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => setDeleteId(student.id)}
															className="text-red-500 focus:text-red-500"
														>
															<FaUserMinus className="mr-2" /> Guruhdan
															o'chirish
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>

				{/* RIGHT PANEL: Attendance */}
				<div className="xl:col-span-8 bg-[#1f1f1f] p-6 rounded-lg border border-[#ffffff1a]">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-bold">Davomat</h3>
						<div className="flex gap-4">
							<Select value={month} onValueChange={setMonth}>
								<SelectTrigger className="w-48 bg-black/40 border-[#ffffff26] text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-[#1f1f1f] border-[#ffffff1a] text-white">
									{months.map((m) => (
										<SelectItem key={m.value} value={m.value}>
											{m.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								onClick={saveAttendance}
								disabled={isSaving || !isDirty}
								className={`${isDirty ? "bg-yellow-500 hover:bg-yellow-600 text-black animate-pulse" : "bg-green-600"}`}
							>
								{isSaving
									? "Saqlanmoqda..."
									: isDirty
										? "O'zgarishlarni saqlash *"
										: "Saqlangan"}
							</Button>
						</div>
					</div>

					<div className="relative overflow-x-auto rounded-md border border-[#ffffff1a]">
						<Table>
							<TableHeader className="bg-black/60">
								<TableRow className="border-[#ffffff1a] hover:bg-transparent">
									<TableHead className="w-48 sticky left-0 bg-[#161616] z-10 border-r border-[#ffffff1a] text-gray-400">
										O'quvchi
									</TableHead>
									{attendance[0]?.days.map((day, idx) => (
										<TableHead
											key={idx}
											className="text-center min-w-12.5 px-1 text-[10px] md:text-xs"
										>
											<div className="flex flex-col items-center">
												<span className="text-white font-bold">
													{new Date(day.date).getDate()}
												</span>
												<span className="text-gray-500 uppercase">
													{new Date(day.date).toLocaleDateString("uz-UZ", {
														weekday: "short",
													})}
												</span>
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{attendance.map((s) => (
									<TableRow key={s.student_id} className="border-zinc-800">
										<TableCell className="sticky left-0 bg-[#1f1f1f] border-r border-zinc-800 whitespace-nowrap font-medium text-white">
											{s.full_name}
										</TableCell>
										{s.days.map((day, idx) => (
											<TableCell key={idx} className="p-0 text-center">
												<div className="flex items-center justify-center py-3">
													<Checkbox
														checked={!!day.status}
														onCheckedChange={(val) =>
															updateLocalAttendance(s.student_id, day.date, val)
														}
														className="border-zinc-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
													/>
												</div>
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>

			{/* Modals */}
			<PaymentModal
				isOpen={showPaymentModal}
				onClose={() => {
					setShowPaymentModal(false);
					setSelectedStudent(null);
				}}
				initialData={{
					student_id: selectedStudent?.id,
					group_id: id,
					paid_at: new Date().toISOString().split("T")[0],
				}}
				onSubmit={async (data) => {
					await createPayment({
						...data,
						student_id: selectedStudent.id,
						group_id: Number(id),
					});
					setShowPaymentModal(false);
				}}
				student={selectedStudent}
			/>

			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleRemoveStudent}
				title="Guruhdan olib tashlash"
				description="Haqiqatdan ham ushbu o'quvchini guruhdan olib tashlamoqchimisiz?"
			/>
		</div>
	);
}
