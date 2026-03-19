import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useGroups } from "../services/group/useGroups";
import { useAttendance } from "../services/attendance/useAttendance";
import { useStudent } from "../services/student/useStudent";
import { usePayments } from "../services/payment/usePayments";
import { useTeachers } from "../services/teacher/useTeachers";
import { goBack } from "../utils/navigate";
import PaymentModal from "../components/PaymentModal";
import { FaEllipsisV, FaSearch } from "react-icons/fa";

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
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "@/components/ui/input-group";

export default function GuruhlarInfo() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { loading, error, fetchById, groups } = useGroups();
	const { transferToGroup, removeFromGroup } = useStudent();
	const { createPayment } = usePayments();
	const { teachers } = useTeachers();

	const [group, setGroup] = useState(null);
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		student: null,
	});

	const months = Array.from({ length: 12 }, (_, i) => {
		const date = new Date(new Date().getFullYear(), i, 1);
		return {
			value: date.toISOString().slice(0, 7),
			label: date.toLocaleString("uz-UZ", {
				month: "long",
				year: "numeric",
			}),
		};
	});

	const [transferStudent, setTransferStudent] = useState(null);
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedStudentForPayment, setSelectedStudentForPayment] =
		useState(null);
	const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

	const { attendance, setAttendance } = useAttendance({
		group_id: id,
		month,
	});

	useEffect(() => {
		fetchById(id).then((data) => {
			setGroup(data);
			setStudents(data.students || []);
		});
	}, []);

	if (loading || !group) return <Loader />;
	if (error) return <p>{error}</p>;

	const handleToggle = (studentId, date, newStatus) => {
		setAttendance({
			student_id: studentId,
			group_id: id,
			lesson_date: date,
			status: newStatus,
		});
	};

	const filteredStudents = students.filter(
		(s) =>
			s.full_name &&
			s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleActionMenu = (e, student) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();

		setActionMenu({
			isOpen: true,
			position: {
				top: rect.bottom + window.scrollY + 8,
				left: rect.right + window.scrollX - 150,
			},
			student,
		});
	};

	const handleRemoveFromGroup = async (studentId) => {
		await removeFromGroup(studentId, id);
		setStudents((prev) => prev.filter((s) => s.id !== studentId));
		setActionMenu((s) => ({ ...s, isOpen: false }));
	};

	const handleTransferStudent = async (targetGroupId) => {
		await transferToGroup({
			student_id: transferStudent.id,
			from_group_id: id,
			to_group_id: Number(targetGroupId),
		});

		setStudents((prev) =>
			prev.filter((s) => s.id !== transferStudent.id)
		);

		setShowTransferModal(false);
		setTransferStudent(null);
	};

	const handlePaymentSubmit = async (formData) => {
		await createPayment({
			student_id: selectedStudentForPayment.id,
			group_id: Number(id),
			amount: formData.amount,
			method: formData.method,
			paid_month: formData.paid_at + "-01",
		});

		setShowPaymentModal(false);
		setSelectedStudentForPayment(null);
	};

	return (
		<div className="table-container">
			<Button variant="outline" onClick={goBack} className={"btn-default mb-7.5"}>
				← Ortga
			</Button>

			<div className="flex gap-6 flex-1 min-h-0">
				{/* LEFT PANEL */}
				<div className="flex flex-col w-125 min-h-0 gap-4">
					<Card>
						<CardHeader>
							<CardTitle>{group.name}</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p>Kurs turi</p>
								<p>{group.course_type}</p>
							</div>

							<div>
								<p>Narx</p>
								<p>{group.price}</p>
							</div>

							<div>
								<p>Dars vaqti</p>
								<p>{group.lesson_time}</p>
							</div>

							<div>
								<p>O'qituvchi</p>
								<p>
									{teachers.find((t) => t.id === group.teacher_id)?.full_name ||
										"Noma'lum"}
								</p>
							</div>

							<div className="col-span-2">
								<p>Dars kunlari</p>
								<div className="flex flex-wrap gap-2">
									{Array.isArray(group.lesson_days)
										? group.lesson_days.map((day) => (
											<span className="btn-default py-1 px-2.5" key={day}>{day}</span>
										))
										: group.lesson_days}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* STUDENTS */}
					<div className="flex flex-col flex-1 min-h-0 gap-2">
						<h3>O'quvchilar ({filteredStudents.length})</h3>

						<InputGroup>
							<InputGroupAddon>
								<FaSearch />
							</InputGroupAddon>
							<InputGroupInput
								placeholder="Qidirish..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</InputGroup>

						<div className="flex-1 overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Ism</TableHead>
										<TableHead />
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredStudents.map((student) => (
										<TableRow key={student.id}>
											<TableCell>{student.full_name}</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													onClick={(e) => handleActionMenu(e, student)}
												>
													<FaEllipsisV />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>

				{/* RIGHT PANEL */}
				<div className="flex-1 overflow-auto">
					<div className="flex items-center justify-between mb-2">
						<h3>Davomat</h3>

						<Select value={month} onValueChange={setMonth}>
							<SelectTrigger className="w-50">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{months.map((m) => (
									<SelectItem key={m.value} value={m.value}>
										{m.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>O'quvchi</TableHead>
								{attendance[0]?.days.map((day, idx) => (
									<TableHead key={idx}>
										{new Date(day.date).getDate()}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>

						<TableBody>
							{attendance.map((student) => (
								<TableRow key={student.student_id}>
									<TableCell>{student.full_name}</TableCell>

									{student.days.map((day, idx) => (
										<TableCell key={idx} className="text-center">
											<Checkbox
												checked={day.status}
												onCheckedChange={() =>
													handleToggle(
														student.student_id,
														day.date,
														!day.status
													)
												}
											/>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

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
				student={selectedStudentForPayment}
			/>
		</div>
	);
}
