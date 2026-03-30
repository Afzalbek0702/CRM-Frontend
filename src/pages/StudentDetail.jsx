import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useStudent } from "../services/student/useStudent";
import { useGroups } from "../services/group/useGroups";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Ikonkalar
import {
	ChevronLeft,
	User,
	Phone,
	Calendar,
	Users,
	Wallet,
	Info,
	ArrowLeft,
} from "lucide-react";
import PhoneUtils from "@/utils/phoneFormat";

export default function StudentDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchById, loading, error } = useStudent();
	const [student, setStudent] = useState(null);
	const { groups } = useGroups();
	const [fullGroups, setFullGroups] = useState([]);

	useEffect(() => {
		const loadStudent = async () => {
			const data = await fetchById(id);
			setStudent(data);

			if (data?.group && groups) {
				const mapped = groups.filter((g) => g.id === data.group.id);
				setFullGroups(mapped);
			}
		};
		loadStudent();
	}, [id]);

	if (loading || !student) return <Loader />;
	if (error)
		return (
			<div className="p-10 text-destructive text-center">
				Xatolik yuz berdi: {error}
			</div>
		);

	const formatDate = (d) => (d ? String(d).split("T")[0] : "Kiritilmagan");

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			{/* Yuqori Header */}
			<div className="flex items-center justify-between bg-background/95 backdrop-blur py-2">
				<div className="flex items-center gap-4">
					<Button onClick={() => navigate(-1)} className="btn-default">
						<ArrowLeft className="h-4 w-4" /> Ortga qaytish
					</Button>
					<h2 className="text-2xl font-bold tracking-tight">
						{student.full_name}
					</h2>
					<Badge
						variant={student.balance >= 0 ? "success" : "destructive"}
						className="ml-2"
					>
						{student.balance >= 0 ? "Faol" : "Qarzdor"}
					</Badge>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Chap taraf: Asosiy Ma'lumotlar */}
				<Card className="md:col-span-2 shadow-sm">
					<CardHeader className="flex flex-row items-center gap-2 space-y-0">
						<Info className="h-5 w-5 text-primary" />
						<CardTitle>Shaxsiy ma'lumotlar</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<DetailItem
								icon={<Phone />}
								label="Telefon raqam"
								value={PhoneUtils.formatPhone(student.phone)}
							/>
							<DetailItem
								icon={<Calendar />}
								label="Tug'ilgan kun"
								value={formatDate(student.birthday)}
							/>
							<DetailItem
								icon={<User />}
								label="Ota-ona ismi"
								value={student.parents_name || "—"}
							/>
							<DetailItem
								icon={<Wallet />}
								label="Balans"
								value={`${student.balance?.toLocaleString() ?? 0} so'm`}
								valueClass={
									student.balance < 0
										? "text-destructive"
										: student.balance === 0
											? "text-white"
											: "text-green-600"
								}

								// ishlamadiyuuu bu neytral rang. nimaga???
							/>
						</div>
					</CardContent>
				</Card>

				{/* O'ng taraf: Kichik statistika yoki holat */}
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-sm font-medium">
							Status va Metadata
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">ID:</span>
							<span className="font-mono font-medium">
								#{id.slice(-6).toUpperCase()}
							</span>
						</div>
						<Separator />
						<p className="text-xs text-muted-foreground leading-relaxed">
							Ushbu talaba tizimda {formatDate(student.created_at)} sanasidan
							buyon mavjud.
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Pastki qism: Guruhlar jadvali */}
			<div className="space-y-4">
				<h3 className="flex items-center gap-2 text-xl font-semibold">
					<Users className="h-5 w-5 text-primary" /> Biriktirilgan guruhlar
				</h3>

				<div className="rounded-xl border shadow-sm">
					{fullGroups.length > 0 ? (
						<Table>
							<TableHeader className="bg-primary">
								<TableRow>
									<TableHead>Guruh nomi</TableHead>
									<TableHead>Kurs turi</TableHead>
									<TableHead>Narxi</TableHead>
									<TableHead>Dars vaqti</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{fullGroups.map((group) => (
									<TableRow
										key={group.id}
										className="bg-card transition-colors"
									>
										<TableCell className="font-medium">{group.name}</TableCell>
										<TableCell>
											<Badge variant="outline">{group.course_type}</Badge>
										</TableCell>
										<TableCell className="font-semibold">
											{group.price?.toLocaleString()} so'm
										</TableCell>
										<TableCell className="text-muted-foreground">
											{group.lesson_time}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="p-8 text-center text-muted-foreground">
							Talaba hozircha hech qanday guruhga biriktirilmagan.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Yordamchi komponent
function DetailItem({ icon, label, value, valueClass = "" }) {
	return (
		<div className="space-y-1">
			<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
				{icon && <span className="text-primary/70">{icon}</span>}
				{label}
			</div>
			<div className={`text-base font-medium ${valueClass}`}>{value}</div>
		</div>
	);
}
