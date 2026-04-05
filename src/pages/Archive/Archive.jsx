import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArchive } from "@/services/archive/useArchive.js";
import { useCourse } from "@/services/course/useCourse.js";
import Loader from "@/components/Loader.jsx";

// UI Components
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
// Icons
import { FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { ArchiveIcon, ArrowLeft, GraduationCap, Receipt, Users } from "lucide-react";
import { StudentFilters } from "./ComponentFilter.jsx";
import { LeadRow, PaymentRow, StudentRow, TeacherRow, GroupRow } from "./ComponentRows.jsx";
import { CATEGORY_CONFIG, copyPhone } from "./config.js";
import { EmptyState, StatsCard } from "./Components.jsx";


export default function Archive() {
	const { category } = useParams();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [copiedPhone, setCopiedPhone] = useState(null);
	const [openTeacher, setOpenTeacher] = useState(false);

	const {
		archivedGroups = [],
		useAllArchivedStudents,
		useAllArchivedLeads,
		useAllArchivedPayments,
		useAllArchivedTeachers,
	} = useArchive();
	const { courseData } = useCourse();
   const config = CATEGORY_CONFIG[category];
   const IconComponent = config.icon;
	const { students = [], isLoading: loadingStudents } =
		useAllArchivedStudents();
	const { leads = [], isLoading: loadingLeads } = useAllArchivedLeads();
	const { payments = [], isLoading: loadingPayments } =
		useAllArchivedPayments();
	const { teachers = [], isLoading: loadingTeachers } =
		useAllArchivedTeachers();

	// 📊 Stats
	const stats = useMemo(
		() => ({
			students: students?.length,
			teachers: teachers?.length,
			leads: leads?.length,
			payments: payments?.length,
			groups: archivedGroups?.length,
			totalPayments: payments?.reduce((acc, p) => acc + (p.amount || 0), 0),
		}),
		[students, teachers, leads, payments, archivedGroups],
	);

	// 🔍 Filter students
	const filteredStudents = useMemo(
		() =>
			(students || [])
				.filter((s) =>
					s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
				)
				.filter(
					(s) =>
						!selectedTeacher ||
						s.groups?.some(
							(gn) =>
								archivedGroups.find((g) => g.name === gn)?.teacher_id ===
								selectedTeacher,
						),
				)
				.filter(
					(s) =>
						!selectedGroup ||
						s.archivedGroups?.includes(
							archivedGroups.find((g) => g.id === selectedGroup)?.name,
						),
				),
		[students, searchTerm, selectedTeacher, selectedGroup, archivedGroups],
	);

	// Loading / Error states
	if (
		(category === "students" && loadingStudents) ||
		(category === "leads" && loadingLeads) ||
		(category === "payments" && loadingPayments) ||
		(category === "teachers" && loadingTeachers)
	)
		return <Loader />;
	if (
		!["students", "leads", "payments", "groups", "teachers"].includes(category)
	)
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="bg-red-500/10 border-red-500/30 p-6 max-w-md w-full">
					<div className="text-center">
						<ArchiveIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-white mb-2">
							Noto'g'ri kategoriya
						</h3>
						<Button
							onClick={() => navigate(-1)}
							variant="outline"
							className="w-full border-red-500/30 text-red-400"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Ortga
						</Button>
					</div>
				</Card>
			</div>
		);

	return (
		<div className="relative min-h-screen bg-background p-4">
			{/* Simplified background */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>

			<div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
					<div className="flex items-center gap-4">
						<Button
							onClick={() => navigate(-1)}
							variant="ghost"
							className="text-gray-400 hover:text-white"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="ml-2 hidden sm:inline">Ortga</span>
						</Button>
						<div className="flex items-center gap-3">
							<IconComponent className={`h-8 w-8 ${config.iconClass}`} />
							<h1 className="text-2xl md:text-3xl font-bold text-white">
								{config.title}
							</h1>
						</div>
					</div>
					<Badge
						variant="outline"
						className="border-amber-400/50 text-amber-400 bg-amber-400/10"
					>
						<ArchiveIcon className="mr-1.5 h-3 w-3" />
						Arxiv
					</Badge>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
					<StatsCard
						icon={<GraduationCap className="w-5 h-5" />}
						label="O'quvchilar"
						value={stats.students}
						color="amber"
					/>
					<StatsCard
						icon={<FaChalkboardTeacher className="w-5 h-5" />}
						label="O'qituvchilar"
						value={stats.teachers}
						color="emerald"
					/>
					<StatsCard
						icon={<Users className="w-5 h-5" />}
						label="Lidlar"
						value={stats.leads}
						color="blue"
					/>
					<StatsCard
						icon={<Receipt className="w-5 h-5" />}
						label="To'lovlar"
						value={stats.payments}
						color="purple"
					/>
					<StatsCard
						icon={<FaBook className="w-5 h-5" />}
						label="Guruhlar"
						value={stats.groups}
						color="amber"
					/>
				</div>

				{/* Student Filters */}
				{category === "students" && (
					<StudentFilters
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						selectedTeacher={selectedTeacher}
						setSelectedTeacher={setSelectedTeacher}
						openTeacher={openTeacher}
						setOpenTeacher={setOpenTeacher}
						archivedGroups={archivedGroups}
						resultCount={filteredStudents.length}
					/>
				)}

				{/* Table */}
				<Card className="bg-card/80 backdrop-blur-xl overflow-hidden p-0">
					{/* <CardContent className="p-0"> */}
						{category === "students" && (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400 w-12" />
										<TableHead className="text-gray-400">Ism</TableHead>
										<TableHead className="text-gray-400">Guruh</TableHead>
										<TableHead className="text-gray-400">Telefon</TableHead>
										<TableHead className="text-gray-400">
											Tug'ilgan kun
										</TableHead>
										<TableHead className="text-gray-400">Ota-ona</TableHead>
										<TableHead className="text-gray-400 text-right">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredStudents.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className="py-16">
												<EmptyState config={config} hasSearch={!!searchTerm} />
											</TableCell>
										</TableRow>
									) : (
										filteredStudents.map((s) => (
											<StudentRow
												key={s.id}
												s={s}
												onCopy={(p) => copyPhone(p, setCopiedPhone)}
												copied={copiedPhone}
											/>
										))
									)}
								</TableBody>
							</Table>
						)}

						{category === "teachers" && (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400 w-12" />
										<TableHead className="text-gray-400">Ism</TableHead>
										<TableHead className="text-gray-400">Telefon</TableHead>
										<TableHead className="text-gray-400">Manba</TableHead>
										<TableHead className="text-gray-400 text-right">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{teachers.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="py-16">
												<EmptyState config={config} />
											</TableCell>
										</TableRow>
									) : (
										teachers.map((t) => (
											<TeacherRow
												key={t.id}
												t={t}
												onCopy={(p) => copyPhone(p, setCopiedPhone)}
												copied={copiedPhone}
											/>
										))
									)}
								</TableBody>
							</Table>
						)}

						{category === "leads" && (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400 w-12" />
										<TableHead className="text-gray-400">Ism</TableHead>
										<TableHead className="text-gray-400">Telefon</TableHead>
										<TableHead className="text-gray-400">Manba</TableHead>
										<TableHead className="text-gray-400">Kurs</TableHead>
										<TableHead className="text-gray-400 max-w-32">
											Izoh
										</TableHead>
										<TableHead className="text-gray-400 text-right">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{leads.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className="py-16">
												<EmptyState config={config} />
											</TableCell>
										</TableRow>
									) : (
										leads.map((l) => (
											<LeadRow
												key={l.id}
												l={l}
												courseData={courseData}
												onCopy={(p) => copyPhone(p, setCopiedPhone)}
												copied={copiedPhone}
											/>
										))
									)}
								</TableBody>
							</Table>
						)}

						{category === "payments" && (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400">Sana</TableHead>
										<TableHead className="text-gray-400">O'quvchi</TableHead>
										<TableHead className="text-gray-400">Guruh</TableHead>
										<TableHead className="text-gray-400 text-right">
											Miqdor
										</TableHead>
										<TableHead className="text-gray-400">Tur</TableHead>
										<TableHead className="text-gray-400 text-right">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{payments.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="py-16">
												<EmptyState config={config} />
											</TableCell>
										</TableRow>
									) : (
										payments.map((p) => <PaymentRow key={p.id} p={p} />)
									)}
								</TableBody>
							</Table>
						)}

						{category === "groups" && (
							<Table>
								<TableHeader>
									<TableRow className="bg-black/40 border-white/10">
										<TableHead className="text-gray-400 w-12" />
										<TableHead className="text-gray-400">Nomi</TableHead>
										<TableHead className="text-gray-400">Narx</TableHead>
										<TableHead className="text-gray-400">Dars vaqti</TableHead>
										<TableHead className="text-gray-400">Kurs turi</TableHead>
										<TableHead className="text-gray-400">O'qituvchi</TableHead>
										<TableHead className="text-gray-400">Kunlar</TableHead>
										<TableHead className="text-gray-400 text-right">
											Amallar
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{archivedGroups.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8} className="py-16">
												<EmptyState config={config} />
											</TableCell>
										</TableRow>
									) : (
										archivedGroups.map((g) => (
											<GroupRow key={g.id} g={g} navigate={navigate} />
										))
									)}
								</TableBody>
							</Table>
						)}
					{/* </CardContent> */}
				</Card>
			</div>
		</div>
	);
}
