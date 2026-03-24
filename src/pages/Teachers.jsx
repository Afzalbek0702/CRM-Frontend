import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeachers } from "../services/teacher/useTeachers";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Icons
import {
	Search,
	Plus,
	MoreVertical,
	Edit2,
	Trash2,
	UserCircle,
	Phone,
	ArrowLeft,
	ClipboardCheck,
} from "lucide-react";

import Loader from "../components/Loader";
import TeacherModal from "../components/TeacherModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import PhoneUtils from "@/utils/phoneFormat";

export default function Teachers() {
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { teachers, isLoading, createTeacher, updateTeacher, deleteTeacher } =
		useTeachers();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTeacher, setEditingTeacher] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [copiedId, setCopiedId] = useState(null);
   const [deleteId, setDeleteId] = useState(null);

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteTeacher(deleteId);
			setDeleteId(null);
		}
	};

	const handleCopyPhone = (e, phone, id) => {
		e.stopPropagation();
		navigator.clipboard.writeText(phone);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	if (isLoading) return <Loader />;

	const filteredTeachers = (teachers || []).filter((t) =>
		t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			{/* Header Qismi */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-1">
					<Button
						onClick={() => navigate(-1)}
						className="mb-2 -ml-2 h-8 gap-1 text-muted-foreground"
					>
						<ArrowLeft className="h-4 w-4" /> Ortga qaytish
					</Button>
					<h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
						<UserCircle className="text-primary h-8 w-8" /> O'qituvchilar
					</h1>
					<p className="text-muted-foreground text-sm">
						O'quv markazining barcha o'qituvchilari ro'yxati
					</p>
				</div>

				<Button
					onClick={() => {
						setEditingWorker(null);
						setIsModalOpen(true);
					}}
					className="bg-primary rounded-md hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-semibold"
				>
					<Plus className="h-4 w-4" /> Xodim qo'shish
				</Button>
			</div>

			{/* Qidiruv va Filtrlash */}
			<div className="relative max-w-sm">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Ism bo'yicha qidirish..."
					className="pl-10 bg-card"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Jadval Qismi */}
			<div className="rounded-xl border bg-card shadow-sm overflow-hidden">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="w-75">Ism va Familiya</TableHead>
							<TableHead>Telefon raqami</TableHead>
							<TableHead className="text-right">Amallar</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTeachers.length > 0 ? (
							filteredTeachers.map((t) => (
								<TableRow
									key={t.id}
									className="bg-card cursor-pointer transition-colors"
									onClick={() => navigate(`/${tenant}/teachers/${t.id}`)}
								>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
												{t.full_name?.charAt(0)}
											</div>
											{t.full_name}
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className="cursor-pointer hover:bg-primary hover:text-white transition-all gap-1 font-mono py-1"
											onClick={(e) => handleCopyPhone(e, t.phone, t.id)}
										>
											{copiedId === t.id ? (
												<ClipboardCheck className="h-3 w-3" />
											) : (
												<Phone className="h-3 w-3" />
											)}
											{PhoneUtils.formatPhone(t.phone)}
										</Badge>
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
													onClick={() => setModal({ isOpen: true, data: t })}
												>
													<FaEdit className="mr-2 text-blue-400" /> Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
													onClick={() => setDeleteId(t.id)}
												>
													<FaTrash className="mr-2 text-red-500" /> O'chirish
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={3}
									className="h-32 text-center text-muted-foreground"
								>
									O'qituvchilar topilmadi.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<TeacherModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingTeacher}
				onSubmit={async (formData) => {
					if (editingTeacher) {
						await updateTeacher(editingTeacher.id, formData);
					} else {
						await createTeacher(formData);
					}
					setIsModalOpen(false);
					setEditingTeacher(null);
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
