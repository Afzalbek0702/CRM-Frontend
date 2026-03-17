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
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import "./Archive.css";

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

	const [openTeacher, setOpenTeacher] = useState(false)
	const [openGroup, setOpenGroup] = useState(false)

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
		<div className="table-container">
			<Button className={"btn-default"} onClick={goBack}>← Ortga</Button>

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

					<div className="flex items-center gap-2 mb-6">
						<InputGroup>
							<InputGroupInput
								type="text"
								placeholder="Ismi orqali qidirish"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>

							<InputGroupAddon>
								<FaSearch className="text-sm" />
							</InputGroupAddon>
						</InputGroup>
					</div>


					<div className="flex items-center gap-5 mb-4">
						<Popover open={openTeacher} onOpenChange={setOpenTeacher}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									className="w-[220px] justify-between btn-default"
								>
									{selectedTeacher
										? teachers.find((t) => t.id === selectedTeacher)?.full_name
										: "Hamma O'qituvchilar"}
									<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-[220px] p-0">
								<Command>
									<CommandInput placeholder="Qidirish..." />
									<CommandEmpty>Topilmadi.</CommandEmpty>

									<CommandGroup>
										<CommandItem
											onSelect={() => {
												setSelectedTeacher("")
												setOpenTeacher(false)
											}}
										>
											Hamma O'qituvchilar
										</CommandItem>

										{teachers.map((t) => (
											<CommandItem
												key={t.id}
												value={t.full_name}
												onSelect={() => {
													setSelectedTeacher(t.id)
													setOpenTeacher(false)
												}}
											>
												{t.full_name}
												<Check
													className={`ml-auto h-4 w-4 ${selectedTeacher === t.id ? "opacity-100" : "opacity-0"
														}`}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>

						<Popover open={openGroup} onOpenChange={setOpenGroup}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									className="w-[220px] justify-between btn-default"
								>
									{selectedGroup
										? archivedGroups.find((g) => g.id === selectedGroup)?.name
										: "Hamma guruhlar"}
									<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-[220px] p-0">
								<Command>
									<CommandInput placeholder="Qidirish..." />
									<CommandEmpty>Topilmadi.</CommandEmpty>

									<CommandGroup>
										<CommandItem
											onSelect={() => {
												setSelectedGroup("")
												setOpenGroup(false)
											}}
										>
											Hamma guruhlar
										</CommandItem>

										{archivedGroups.map((g) => (
											<CommandItem
												key={g.id}
												value={g.name}
												onSelect={() => {
													setSelectedGroup(g.id)
													setOpenGroup(false)
												}}
											>
												{g.name}
												<Check
													className={`ml-auto h-4 w-4 ${selectedGroup === g.id ? "opacity-100" : "opacity-0"
														}`}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
					</div>


				</>
			)}

			<div>
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
							{students.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7}>
										O'quvchilar topilmadi.
									</TableCell>
								</TableRow>
							) : (
								students
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
									)))}
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
							{students.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6}>
										O'qituvchilar topilmadi.
									</TableCell>
								</TableRow>
							) : (
								teachers?.map((t) => (
									<TableRow key={t.id}>
										<TableCell>{t.full_name}</TableCell>
										<TableCell>{t.phone}</TableCell>
										<TableCell>{t.source}</TableCell>
									</TableRow>
								)))}
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
							{leads.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6}>
										Lidlar topilmadi.
									</TableCell>
								</TableRow>
							) : (
								leads?.map((l) => (
									<TableRow key={l.id}>
										<TableCell>{l.full_name}</TableCell>
										<TableCell>{l.phone}</TableCell>
										<TableCell>{l.source}</TableCell>
									</TableRow>
								)))}
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
							{payments.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6}>
										To'lovlar topilmadi.
									</TableCell>
								</TableRow>
							) : (
								payments?.map((p) => (
									<TableRow key={p.id}>
										<TableCell>{p.student_name}</TableCell>
										<TableCell>
											<span className="balance-badge">
												{p.amount?.toLocaleString() ?? 0}
											</span>
										</TableCell>
										<TableCell>{p.date?.split("T")[0]}</TableCell>
									</TableRow>
								)))}
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
							{archivedGroups.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6}>
										Guruhlar topilmadi.
									</TableCell>
								</TableRow>
							) : (
								archivedGroups.map((g) => (
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
								)))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
