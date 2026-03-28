import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import { useTeachers } from "../services/teacher/useTeachers.js";
import toast from "react-hot-toast";

// Shadcn UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";

// Ikonkalar
import {
	Search,
	Plus,
	ArrowLeft,
	Phone,
	Calendar,
	Wallet,
	Check,
	ChevronsUpDown,
	GraduationCap,
	Users,
	Settings,
} from "lucide-react";

import Loader from "../components/Loader.jsx";
import StudentModal from "../components/StudentModal.jsx";
import AddToGroupModal from "../components/AddToGroupModal.jsx";
import { FaEdit, FaEllipsisV, FaPlus, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.jsx";
import PhoneUtils from "@/utils/phoneFormat.js";

export default function Students() {
	const navigate = useNavigate();
	const { tenant } = useParams();

	const {
		students = [],
		loading,
		error,
		createStudent,
		updateStudent,
		deleteStudent,
		addToGroup,
	} = useStudent();

	const { groups = [] } = useGroups();
	const { teachers = [] } = useTeachers();

	// State-lar
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);
	const [addToGroupStudent, setAddToGroupStudent] = useState(null);

	const [openGroup, setOpenGroup] = useState(false);
	const [openTeacher, setOpenTeacher] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	// Filtrlash mantiqi
	const filteredStudents = useMemo(() => {
		return students
			.filter((s) =>
				s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
			)
			.filter((s) => {
				if (!selectedTeacher) return true;
				const groupObj = groups.find(
					(g) => g.id === (s.groups?.id || s.group_id),
				);
				return groupObj?.teacher_id === selectedTeacher;
			})
			.filter((s) => {
				if (!selectedGroup) return true;
				return (s.groups?.id || s.group_id) === selectedGroup;
			});
	}, [students, searchTerm, selectedTeacher, selectedGroup, groups]);

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteStudent(deleteId);
			setDeleteId(null);
		}
	};

	if (loading) return <Loader />;
	if (error)
		return (
			<div className="p-10 text-center text-destructive">
				Xatolik yuz berdi...
			</div>
		);

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<Button onClick={() => navigate(-1)} className="btn-default">
						<ArrowLeft className="h-4 w-4" /> Ortga qaytish
					</Button>
					<h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 mt-3">
						<GraduationCap className="h-8 w-8 text-primary" /> O'quvchilar
					</h2>
				</div>
				<Button
					onClick={() => {
						setEditingStudent(null);
						setIsModalOpen(true);
					}}
					className="btn-default bg-primary rounded-md hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-semibold"
				>
					<Plus className="h-4 w-4" /> O'quvchi qo'shish
				</Button>
			</div>

			{/* Qidiruv va Filtrlar */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Ism bo'yicha qidirish..."
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* O'qituvchi filtri */}
				{/* <Popover open={openTeacher} onOpenChange={setOpenTeacher}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="justify-between w-full font-normal"
						>
							{selectedTeacher
								? teachers.find((t) => t.id === selectedTeacher)?.full_name
								: "Hamma o'qituvchilar"}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
						<Command>
							<CommandInput placeholder="O'qituvchini qidirish..." />
							<CommandEmpty>Topilmadi.</CommandEmpty>
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setSelectedTeacher("");
										setOpenTeacher(false);
									}}
								>
									<Check
										className={`mr-2 h-4 w-4 ${!selectedTeacher ? "opacity-100" : "opacity-0"}`}
									/>
									Hamma o'qituvchilar
								</CommandItem>
								{teachers.map((t) => (
									<CommandItem
										key={t.id}
										onSelect={() => {
											setSelectedTeacher(t.id);
											setOpenTeacher(false);
										}}
									>
										<Check
											className={`mr-2 h-4 w-4 ${selectedTeacher === t.id ? "opacity-100" : "opacity-0"}`}
										/>
										{t.full_name}
									</CommandItem>
								))}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover> */}

				{/* Guruh filtri */}
				<Popover open={openGroup} onOpenChange={setOpenGroup}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="justify-between w-full font-normal"
						>
							{selectedGroup
								? groups.find((g) => g.id === selectedGroup)?.name
								: "Hamma guruhlar"}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
						<Command>
							<CommandInput placeholder="Guruhni qidirish..." />
							<CommandEmpty>Topilmadi.</CommandEmpty>
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setSelectedGroup("");
										setOpenGroup(false);
									}}
								>
									<Check
										className={`mr-2 h-4 w-4 ${!selectedGroup ? "opacity-100" : "opacity-0"}`}
									/>
									Hamma guruhlar
								</CommandItem>
								{groups.map((g) => (
									<CommandItem
										key={g.id}
										onSelect={() => {
											setSelectedGroup(g.id);
											setOpenGroup(false);
										}}
									>
										<Check
											className={`mr-2 h-4 w-4 ${selectedGroup === g.id ? "opacity-100" : "opacity-0"}`}
										/>
										{g.name}
									</CommandItem>
								))}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>
			</div>

			{/* Jadval */}
			<div className="rounded-md border shadow-sm overflow-hidden">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow className="hover:bg-primary/95">
							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<GraduationCap className="h-4 w-4" /> Ism
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4" /> Guruh
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4" /> Telefon
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" /> Tug'ilgan kun
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Wallet className="h-4 w-4" /> Balans
								</div>
							</TableHead>

							<TableHead className=""></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredStudents.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center text-muted-foreground"
								>
									O'quvchilar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							filteredStudents.map((s) => (
								<TableRow
									key={s.id}
									onClick={() => navigate(`/${tenant}/students/${s.id}`)}
									className="cursor-pointer bg-card transition-colors"
								>
									<TableCell className="font-semibold">{s.full_name}</TableCell>
									<TableCell>
										{s.groups?.name ||
											(Array.isArray(s.groups)
												? s.groups[0]?.name
												: "Guruhsiz")}
									</TableCell>
									<TableCell className="font-mono text-sm">
										<button
											onClick={(e) => {
												e.stopPropagation();
												navigator.clipboard.writeText(s.phone);
												toast.success("Raqam muvaffaqiyatli ko'chirildi!")
											}}
											className="underline decoration-dotted hover:text-primary cursor-pointer"
										>
											{PhoneUtils.formatPhone(s.phone)}
										</button>
									</TableCell>
									<TableCell>
										{s.birthday ? s.birthday.split("T")[0] : "-"}
									</TableCell>
									<TableCell>
										<span
											className={
												s.monthly_paid < 0
													? "text-destructive"
													: s.monthly_paid === 0
														? "text-white"
														: "text-green-600"
											}
										>
											{s.monthly_paid?.toLocaleString()} so'm
										</span>
									</TableCell>
									<TableCell
										className={"flex justify-end"}
										onClick={(e) => e.stopPropagation()}
									>
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
												className="w-44 bg-card border-gray-700 text-white"
											>
												<DropdownMenuItem
													className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
													onClick={() => {
														setEditingStudent(s);
														setIsModalOpen(true);
													}}
												>
													<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
													onClick={() => {
														(setAddToGroupOpen(true), setAddToGroupStudent(s));
													}}
												>
													<FaPlus className="mr-2 text-green-400" /> Guruhga
													qo'shish
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

			{/* Modallar */}
			<StudentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingStudent}
				onSubmit={async (formData) => {
					if (editingStudent) {
						await updateStudent(editingStudent.id, formData);
					} else {
						await createStudent(formData);
					}
					setIsModalOpen(false);
				}}
			/>

			<AddToGroupModal
				isOpen={addToGroupOpen}
				onClose={() => setAddToGroupOpen(false)}
				initialGroupId={addToGroupStudent?.group_id}
				onConfirm={async (groupId) => {
					await addToGroup(addToGroupStudent.id, Number(groupId));
					setAddToGroupOpen(false);
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
