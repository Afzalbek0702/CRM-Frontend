import { useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useArchive } from "../services/archive/useArchive.js";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { goBack } from "../utils/navigate.js";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import "./Archive.css";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function Archive() {
	const { category } = useParams();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const {
		archivedGroups = [],
		useAllArchivedStudents,
		useAllArchivedLeads,
		useAllArchivedPayments,
		useAllArchivedTeachers,
	} = useArchive();

	const {
		data: students = [],
		isLoading: loadingStudents,
		error: errorStudents,
	} = useAllArchivedStudents();
	const {
		data: leads = [],
		isLoading: loadingLeads,
		error: errorLeads,
	} = useAllArchivedLeads();
	const {
		data: payments = [],
		isLoading: loadingPayments,
		error: errorPayments,
	} = useAllArchivedPayments();
	const {
		data: teachers = [],
		isLoading: loadingTeachers,
		error: errorTeachers,
	} = useAllArchivedTeachers();

	if (
		(category === "students" && loadingStudents) ||
		(category === "leads" && loadingLeads) ||
		(category === "payments" && loadingPayments) ||
		(category === "teachers" && loadingTeachers)
	)
		return <Loader />;

	if (
		!["students", "leads", "payments", "groups", "teachers"].includes(category)
	) {
		return (
			<div className="text-center p-10 text-[#e74c3c] bg-[rgba(231, 76, 60, 0.1)] rounded-3xl mx-5 my-15">
				Invalid category
			</div>
		);
	}

	return (
		<div className="archive-container">
			<Button onClick={goBack}>← Ortga</Button>

			<h2>
				Arxiv -{" "}
				<span>
					{category === "students"
						? "O'quvchilar"
						: category === "teachers"
							? "O'qituvchilar"
							: category === "payments"
								? "To'lovlar"
								: category === "groups"
									? "Guruhlar"
									: category === "leads"
										? "Lidlar"
										: ""}
				</span>
			</h2>

			{category === "students" && (
				<>
					<div className="flex items-center gap-5 mb-4">
						<Select onValueChange={(value) => setSelectedTeacher(Number(value) || "")}>
							<SelectTrigger>
								<SelectValue placeholder="Hamma O'qtuvchilar" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
									{teachers.map((t) => (
										<SelectItem key={t.id} value={t.id}>
											{t.full_name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Select onValueChange={(value) => setSelectedGroup(Number(value) || "")}>
							<SelectTrigger>
								<SelectValue placeholder="Hamma guruhlar" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
									{archivedGroups.map((g) => (
										<SelectItem key={g.id} value={g.id}>
											{g.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center ml-15 mb-5 rounded-3xl px-3 py-4 w-[320px] border duration-150">
						<FaSearch className="text-sm mr-2.5" />
						<Input
							type="text"
							placeholder="Ismi orqali qidirish"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</>
			)}

			<div className="ml-15 mr-5 rounded-3xl overflow-x-auto overflow-y-visible">
				{/* Students Table */}
				{category === "students" && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ism</TableHead>
								<TableHead>Guruh</TableHead>
								<TableHead>Telefon</TableHead>
								<TableHead>Tug'ilgan Kun</TableHead>
								<TableHead>Ota-Ona Ismi</TableHead>
								<TableHead>Ota-Ona Raqami</TableHead>
								<TableHead>Balance</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{students
								?.filter((s) =>
									s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
								)
								.filter(
									(s) =>
										!selectedTeacher ||
										s.groups?.some((studentGroupName) => {
											const groupObj = archivedGroups.find(
												(g) => g.name === studentGroupName,
											);
											return groupObj?.teacher_id === selectedTeacher;
										}),
								)
								.filter(
									(s) =>
										!selectedGroup ||
										s.archivedGroups?.includes(
											archivedGroups.find((g) => g.id === selectedGroup)?.name,
										),
								)
								.map((s) => (
									<TableRow key={s.id}>
										<TableCell>{s.full_name}</TableCell>
										<TableCell>{s.groups?.[0] || "No Group"}</TableCell>
										<TableCell>{s.phone}</TableCell>
										<TableCell>{s.birthday?.split("T")[0]}</TableCell>
										<TableCell>{s.parents_name}</TableCell>
										<TableCell>{s.parents_phone}</TableCell>
										<TableCell>
											<span className="balance-badge">
												{s.monthly_paid?.toLocaleString() ?? 0} so'm
											</span>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				)}

				{/* Teachers Table */}
				{category === "teachers" && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ism</TableHead>
								<TableHead>Telefon</TableHead>
								<TableHead>Manba</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{teachers?.map((t) => (
								<TableRow key={t.id}>
									<TableCell>{t.full_name}</TableCell>
									<TableCell>{t.phone}</TableCell>
									<TableCell>{t.source}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				{/* Leads Table */}
				{category === "leads" && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ism</TableHead>
								<TableHead>Telefon Raqam</TableHead>
								<TableHead>Manba</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{leads?.map((l) => (
								<TableRow key={l.id}>
									<TableCell>{l.full_name}</TableCell>
									<TableCell>{l.phone}</TableCell>
									<TableCell>{l.source}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				{/* Payments Table */}
				{category === "payments" && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>O'quvchi</TableHead>
								<TableHead>Miqdor</TableHead>
								<TableHead>Sana</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payments?.map((p) => (
								<TableRow key={p.id}>
									<TableCell>{p.student_name}</TableCell>
									<TableCell>
										<span className="balance-badge">
											{p.amount?.toLocaleString() ?? 0}
										</span>
									</TableCell>
									<TableCell>{p.date?.split("T")[0]}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				{/* Groups Table */}
				{category === "groups" && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nomi</TableHead>
								<TableHead>Narx</TableHead>
								<TableHead>Dars vaqti</TableHead>
								<TableHead>Kurs turi</TableHead>
								<TableHead>O'qituvchi</TableHead>
								<TableHead>Dars kunlari</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{archivedGroups.map((g) => (
								<TableRow key={g.id}>
									<TableCell>{g.name}</TableCell>
									<TableCell>
										<span className="balance-badge">{g.price} ming so'm</span>
									</TableCell>
									<TableCell>{g.lesson_time}</TableCell>
									<TableCell>{g.course_type}</TableCell>
									<TableCell className="teacher">{g.teacher}</TableCell>
									<TableCell>
										{Array.isArray(g.lesson_days)
											? g.lesson_days.map((day) => (
												<span key={day} className="day-pill">
													{day}
												</span>
											))
											: g.lesson_days}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
