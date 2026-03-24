import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/GroupModal";
import { useGroups } from "../services/group/useGroups.js";
import { useStudent } from "../services/student/useStudent.js";
// shadcn UI
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

// Icons
import {
	FaEllipsisV,
	FaUsers,
	FaSearch,
	FaEdit,
	FaTrash,
} from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import {
	ArrowLeft,
	Plus,
	BookOpen,
	Banknote,
	Clock,
	GraduationCap,
	Presentation,
	CalendarRange,
	MoreHorizontal,
} from "lucide-react";
import { getUzDays } from "@/utils/weekday";
export default function Groups() {
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { groups, loading, createGroup, deleteGroup, updateGroup } =
		useGroups();
	const { students } = useStudent();

	const [searchTerm, setSearchTerm] = useState("");
	const [deleteId, setDeleteId] = useState(null);
	const [modal, setModal] = useState({ open: false, edit: false, data: null });

	// Studentlar sonini hisoblashni optimallashtirish
	const groupsWithCount = useMemo(() => {
		const countMap = students.reduce((acc, s) => {
			const gIds = Array.isArray(s.groups) ? s.groups : [s.groups];
			gIds.forEach((g) => {
				const id = g?.id ?? g;
				if (id != null) acc[id] = (acc[id] || 0) + 1;
			});
			return acc;
		}, {});

		return groups.map((g) => ({ ...g, studentCount: countMap[g.id] || 0 }));
	}, [groups, students]);

	const handleSubmit = (formData) => {
		modal.edit ? updateGroup(modal.data.id, formData) : createGroup(formData);
		setModal({ open: false, edit: false, data: null });
	};

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteGroup(deleteId);
			setDeleteId(null);
		}
	};
	console.log(getUzDays(groupsWithCount[0].lesson_days));

	if (loading) return <Loader />;

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			<Button onClick={() => navigate(-1)} className="btn-default">
				<ArrowLeft className="h-4 w-4" /> Ortga qaytish
			</Button>
			<h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 mt-3">
				<FaUsers className="h-8 w-8 text-primary" /> Guruhlar
			</h2>

			<div className="w-full items-center mb-6 flex justify-between gap-4 mt-4">
				<InputGroup className="max-w-md">
					<InputGroupInput
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Guruh nomi bo'yicha qidirish"
					/>
					<InputGroupAddon>
						<FaSearch />
					</InputGroupAddon>
				</InputGroup>
				<Button
					onClick={() => setModal({ open: true, edit: false, data: null })}
					className="bg-primary rounded-md hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-semibold"
				>
					<Plus className="h-4 w-4" /> Yangi guruh qo'shish
				</Button>
			</div>
			<div className="rounded-md border shadow-sm overflow-hidden">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" /> Nomi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Banknote className="h-4 w-4" /> Narx
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4" /> Dars vaqti
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<GraduationCap className="h-4 w-4" /> Kurs turi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<Presentation className="h-4 w-4" /> O'qituvchi
								</div>
							</TableHead>

							<TableHead className="text-black font-bold whitespace-nowrap">
								<div className="flex items-center gap-2">
									<CalendarRange className="h-4 w-4" /> Dars kunlari
								</div>
							</TableHead>

							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{groupsWithCount.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-10 text-gray-500"
								>
									Guruhlar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							groupsWithCount
								.filter((g) =>
									g.name?.toLowerCase().includes(searchTerm.toLowerCase()),
								)
								.map((g) => (
									<TableRow
										key={g.id}
										onClick={() => navigate(`/${tenant}/groups/${g.id}`)}
										className="cursor-pointer bg-card"
									>
										<TableCell>
											{g.name}{" "}
											<span id="studentCounter">[{g.studentCount}]</span>
										</TableCell>
										<TableCell>
											{g.price ? Number(g.price) / 1000 : 0} ming so'm
										</TableCell>
										<TableCell>{g.lesson_time}</TableCell>
										<TableCell>{g.course_type}</TableCell>
										<TableCell className="teacher">
											{g.teachers?.full_name}
										</TableCell>
										<TableCell>
											<div className="flex gap-1">
												{/* {Array.isArray(g.lesson_days) ? (
													g.lesson_days.map((day) => (
														<span
															key={day}
															className="day-pill px-2.5 py-0.75 rounded-[10px]"
														>
															{day}
														</span>
													))
												) : (
													<span className="day-pill">{g.lesson_days}</span>
												)} */}
												{getUzDays(g.lesson_days).map((day) => (
													<span
														key={day}
														className="day-pill px-2.5 py-0.5 rounded-[10px] bg-primary text-black"
													>
														{day}
													</span>
												))}
											</div>
										</TableCell>

										<TableCell
											onClick={(e) => e.stopPropagation()}
											className={"flex justify-end"}
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
													className="w-32 bg-card border-gray-700 text-white"
												>
													<DropdownMenuItem
														className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
														onClick={() =>
															setModal({ open: true, edit: true, data: g })
														}
													>
														<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
														onClick={() => setDeleteId(g.id)}
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

			<Modal
				isOpen={modal.open}
				onClose={() => setModal({ open: false, edit: false, data: null })}
				onSubmit={handleSubmit}
				title={modal.edit ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
				initialData={modal.data}
			/>

			<ConfirmDeleteModal
				isOpen={deleteId ? true : false}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
