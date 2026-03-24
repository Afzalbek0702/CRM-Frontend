import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaEllipsisV,
	FaThList,
	FaPlus,
	FaSearch,
	FaPhone,
	FaEdit,
	FaTrash,
} from "react-icons/fa";

// UI Components
import Loader from "../components/Loader";
import LeadModal from "../components/LeadModal";
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
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks & Utils
import { useLeads } from "../services/lead/useLeads";
import { useCourse } from "../services/course/useCourse";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import {
	ArrowLeft,
	BookOpen,
	Globe,
	MessageSquare,
	Phone,
	Plus,
	User,
	UserPlus,
} from "lucide-react";
import AddToGroupModal from "@/components/AddToGroupModal";
import PhoneUtils from "@/utils/phoneFormat";

export default function Leads() {
	const navigate = useNavigate();

	const { leads, isLoading, createLead, updateLead, deleteLead,convertLeadToGroup } = useLeads();
	const { courseData } = useCourse();

	const [searchTerm, setSearchTerm] = useState("");
	const [modal, setModal] = useState({ isOpen: false, data: null });
	const [deleteId, setDeleteId] = useState(null);
const [convertModal, setConvertModal] = useState({ isOpen: false, leadData: null });
	// Qidiruvni optimallashtirish
	const filteredLeads = useMemo(() => {
		return (leads || []).filter((l) =>
			l.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [leads, searchTerm]);

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteLead(deleteId);
			setDeleteId(null);
		}
	};
	const handleCopyPhone = (e, phone) => {
		e.stopPropagation();
		navigator.clipboard.writeText(phone);
   };
   const handleConvertToGroup = async (groupId) => {
      if (convertModal.leadData && groupId) {
         console.log(convertModal.leadData);
         console.log(groupId);
         
         await convertLeadToGroup({
						id: convertModal.leadData.id,
						group_id: groupId,
					});
         setConvertModal({ isOpen: false, leadData: null });
      }
   };

	if (isLoading) return <Loader />;

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			<Button onClick={() => navigate(-1)} className="btn-default">
				<ArrowLeft className="h-4 w-4" /> Ortga qaytish
			</Button>

			<h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 mt-3">
				<FaThList className="h-8 w-8 text-primary" /> Lidlar
			</h2>

			<div className="w-full items-center mb-6 flex justify-between gap-4 mt-4">
				<InputGroup className="max-w-md">
					<InputGroupInput
						placeholder="Lidlarni ismi bo'yicha qidirish..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<InputGroupAddon>
						<FaSearch />
					</InputGroupAddon>
				</InputGroup>

				<Button
					onClick={() => setModal({ isOpen: true, data: null })}
					className="bg-primary rounded-md hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-semibold"
				>
					<Plus className="h-4 w-4" /> Yangi lid qo'shish
				</Button>
			</div>

			<div className="rounded-md border shadow-sm overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-primary hover:bg-primary/95">
							<TableHead className="text-primary-foreground">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" /> Ism
								</div>
							</TableHead>

							<TableHead className="text-primary-foreground">
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4" /> Telefon
								</div>
							</TableHead>

							<TableHead className="text-primary-foreground">
								<div className="flex items-center gap-2">
									<Globe className="h-4 w-4" /> Manba
								</div>
							</TableHead>

							<TableHead className="text-primary-foreground">
								<div className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" /> Qiziqadigan Kurs
								</div>
							</TableHead>

							<TableHead className="text-primary-foreground">
								<div className="flex items-center gap-2">
									<MessageSquare className="h-4 w-4" /> Izoh
								</div>
							</TableHead>
							<TableHead className="w-12.5"></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{filteredLeads.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-10 text-gray-500"
								>
									Lidlar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							filteredLeads.map((l) => (
								<TableRow key={l.id} className="bg-card transition-colors">
									<TableCell className="font-medium">{l.full_name}</TableCell>
									<TableCell>
										<span
											onClick={(e) => handleCopyPhone(e, l.phone)}
											className="cursor-pointer hover:text-blue-600 transition-colors underline decoration-dotted"
										>
											{PhoneUtils.formatPhone(l.phone)}
										</span>
									</TableCell>
									<TableCell>{l.source}</TableCell>
									<TableCell>
										{courseData.find((c) => c.name === l.interested_course)
											?.name || "-"}
									</TableCell>
									<TableCell className="max-w-50 truncate" title={l.comment}>
										{l.comment}
									</TableCell>
									<TableCell className={"flex justify-end"}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<FaEllipsisV />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-44">
												<DropdownMenuItem
													onClick={() => setModal({ isOpen: true, data: l })}
													className="cursor-pointer"
												>
													<FaEdit className="mr-2 text-blue-500" /> Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() =>
														setConvertModal({ isOpen: true, leadData: l })
													}
													className="cursor-pointer"
												>
													<UserPlus className="mr-2 h-4 w-4 text-green-500" />{" "}
													Guruhga o'tkazish
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => setDeleteId(l.id)}
													className="cursor-pointer text-red-600 focus:text-red-600"
												>
													<FaTrash className="mr-2" /> O'chirish
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

			<LeadModal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false, data: null })}
				initialData={modal.data}
				onSubmit={async (data) => {
					modal.data
						? await updateLead({ id: modal.data.id, data })
						: await createLead(data);
					setModal({ isOpen: false, data: null });
				}}
			/>
			<ConfirmDeleteModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
			/>
			<AddToGroupModal
				isOpen={convertModal.isOpen}
				onClose={() => setConvertModal({ isOpen: false, leadData: null })}
				onConfirm={handleConvertToGroup}
				// Agar lidning qiziqqan kursi bo'yicha guruhlarni filter qilmoqchi bo'lsangiz:
				initialData={convertModal.leadData}
			/>
		</div>
	);
}
