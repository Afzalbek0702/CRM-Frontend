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
			<Button
				className="w-32.5 h-8.75 rounded-2xl border-none text-black flex justify-center items-center p-2.5 gap-1 z-10 hover:-translate-y-0.5 duration-100"
				onClick={goBack}
			>
				← Ortga
			</Button>
			<h2>
				Arxiv -
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
					<div className="flex items-center gap-5">
						<Select
							onChange={(e) => setSelectedTeacher(Number(e.target.value) || "")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Hamma O'qtuvchilar" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{teachers.map((t) => (
										<SelectItem key={t.id} value={t.id}>
											{t.full_name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Select
							onChange={(e) => setSelectedGroup(Number(e.target.value) || "")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Hamma guruhlar" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{archivedGroups.map((g) => (
										<SelectItem key={g.id} value={g.id}>
											{g.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Select
							onChange={(e) => setSelectedGroup(Number(e.target.value) || "")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Hamma guruhlar" />
							</SelectTrigger>
							<SelectContent>
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

					<div className="flex items-center ml-15 mb-5 rounded-3xl px-3 py-4 w-[320px] border duration-150 ">
						<FaSearch className="text-sm mr-2.5 " />
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
				{category === "students" && (
					<Table>
						<TableCaption>A list of your recent invoices.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-25">Ism</TableHead>
								<TableHead>Guruh</TableHead>
								<TableHead>Telefon Raqam</TableHead>
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
								.filter((s) =>
									s.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
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

				{category === "teachers" && (
					<Table>
						<TableCaption>A list of your recent invoices.</TableCaption>
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
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
				{category === "leads" && (
					<Table>
						<TableCaption>A list of your recent invoices.</TableCaption>
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

				{category === "payments" && (
					<table>
						<thead>
							<tr>
								<th>O'quvchi</th>
								<th>Miqdor</th>
								<th>Sana</th>
							</tr>
						</thead>
						<tbody>
							{payments?.map((p) => (
								<tr key={p.id}>
									<td>{p.student_name}</td>
									<td>
										<span className="balance-badge">
											{p.amount?.toLocaleString() ?? 0}
										</span>
									</td>
									<td>{p.date?.split("T")[0]}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				{category === "groups" && (
					<table>
						<thead>
							<tr>
								<th>Nomi</th>
								<th>Narx</th>
								<th>Dars vaqti</th>
								<th>Kurs turi</th>
								<th>O'qituvchi</th>
								<th>Dars kunlari</th>
							</tr>
						</thead>
						<tbody>
							{archivedGroups.map((g) => (
								<tr key={g.id}>
									<td>{g.name}</td>
									<td>
										<span className="balance-badge">{g.price} ming so'm</span>
									</td>
									<td>{g.lesson_time}</td>
									<td>{g.course_type}</td>
									<td className="teacher">{g.teacher}</td>
									<td>
										{Array.isArray(g.lesson_days) ? (
											g.lesson_days.map((day) => (
												<span key={day} className="day-pill">
													{day}
												</span>
											))
										) : (
											<span className="day-pill">{g.lesson_days}</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
