import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorker } from "../services/worker/useWorker";
import toast from "react-hot-toast";
// Shadcn UI komponentlari
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import {
	Search,
	Plus,
	MoreVertical,
	Edit2,
	Trash2,
	UserCheck,
	Phone,
	ArrowLeft,
	Shield,
   UserRound,
   PhoneCall,
   BriefcaseBusiness,
} from "lucide-react";

import Loader from "../components/Loader";
import WorkerModal from "../components/WorkerModal";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import PhoneUtils from "@/utils/phoneFormat";

export default function Workers() {
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { workerData, isLoading, createWorker, updateWorker, removeWorker } =
		useWorker();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingWorker, setEditingWorker] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("all");
   const [deleteId, setDeleteId] = useState(null);

	// O'chirish funksiyasi
	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteGroup(deleteId);
			setDeleteId(null);
		}
	};

   if (isLoading) return <Loader />;
   
	const filteredWorkers = (workerData || []).filter((w) => {
		const matchesSearch = w.full_name
			?.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesFilter =
			filter === "all" ||
			(filter === "teachers" && w.role === "TEACHER") ||
			(filter === "admins" && w.role === "ADMIN") ||
			(filter === "managers" && w.role === "MANAGER");
      console.log(w);
      
		return matchesSearch && matchesFilter;
	});

	

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			{/* Header qismi */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<Button onClick={() => navigate(-1)} className="btn-default mb-3">
						<ArrowLeft className="h-4 w-4" /> Ortga qaytish
					</Button>
					<h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
						<UserCheck className="h-8 w-8 text-primary" /> Xodimlar
					</h1>
				</div>
				<Button
					onClick={() => {
						setEditingWorker(null);
						setIsModalOpen(true);
					}}
					className="btn-default bg-primary rounded-md hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-semibold"
				>
					<Plus className="h-4 w-4" /> Xodim qo'shish
				</Button>
			</div>

			{/* Qidiruv va Filtrlar */}
			<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
				{/* <div className="relative w-full lg:max-w-sm border"> */}
				<InputGroup className="max-w-md">
					<InputGroupInput
						placeholder="Ism bo'yicha qidirish..."
						// className="pl-10 border-none bg-transparent focus-visible:ring-0"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
				</InputGroup>
				{/* </div> */}

				<Tabs
					value={filter}
					onValueChange={setFilter}
					className="w-full lg:w-auto"
				>
					<TabsList className="bg-card border">
						<TabsTrigger value="all">Barchasi</TabsTrigger>
						<TabsTrigger value="teachers">Ustozlar</TabsTrigger>
						<TabsTrigger value="admins">Adminlar</TabsTrigger>
						<TabsTrigger value="managers">Managerlar</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Jadval */}
			<div className="rounded-md border shadow-xl overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-primary hover:bg-primary/95 transition-colors">
							<TableHead className="text-black font-semibold">
								<div className="flex items-center gap-2">
									<UserRound className="h-4 w-4" /> Xodim ismi
								</div>
							</TableHead>

							<TableHead className="text-black font-semibold">
								<div className="flex items-center gap-2">
									<PhoneCall className="h-4 w-4" /> Telefon
								</div>
							</TableHead>

							<TableHead className="text-black font-semibold">
								<div className="flex items-center gap-2">
									<BriefcaseBusiness className="h-4 w-4" /> Lavozimi
								</div>
							</TableHead>

							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredWorkers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-32 text-center text-muted-foreground"
								>
									Xodimlar topilmadi.
								</TableCell>
							</TableRow>
						) : (
							filteredWorkers.map((w) => (
								<TableRow
									key={w.id}
									onClick={() => navigate(`/${tenant}/workers/${w.id}`)}
									className="cursor-pointer bg-card"
								>
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
												{w.full_name?.charAt(0).toUpperCase()}
											</div>
											{w.full_name}
										</div>
									</TableCell>
									<TableCell>
										<button
											onClick={(e) => {
												e.stopPropagation();
												navigator.clipboard.writeText(w.phone);
												toast.success("Raqam muvaffaqiyatli ko'chirildi!")
											}}
											className="underline decoration-dotted hover:text-primary cursor-pointer"
										>
											{PhoneUtils.formatPhone(w.phone)}
										</button>
									</TableCell>
									<TableCell>
										<Badge
											variant={w.role === "admin" ? "default" : "secondary"}
											className="gap-1"
										>
											{w.role === "admin" && <Shield className="h-3 w-3" />}
											{w.position || w.role}
										</Badge>
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
													className="h-8 w-8 hover:bg-muted"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-48 shadow-2xl"
											>
												<DropdownMenuLabel>Amallar</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => {
														setEditingWorker(w);
														setIsModalOpen(true);
													}}
												>
													<Edit2 className="mr-2 h-4 w-4 text-blue-500" />{" "}
													Tahrirlash
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
													onClick={() => setDeleteId(w.id)}
												>
													<Trash2 className="mr-2 h-4 w-4" /> O'chirish
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

			<WorkerModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingWorker}
				onSubmit={async (formData) => {
					if (editingWorker) {
						await updateWorker({ id: editingWorker.id, data: formData });
					} else {
						await createWorker(formData);
					}
					setIsModalOpen(false);
					setEditingWorker(null);
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
