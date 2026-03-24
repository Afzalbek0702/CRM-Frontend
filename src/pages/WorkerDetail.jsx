import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import Loader from "../components/Loader";
import { useWorker } from "../services/worker/useWorker";

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

// Icons
import {
	ArrowLeft,
	Briefcase,
	Phone,
	Banknote,
	Users,
	Calendar,
	Layers,
} from "lucide-react";
import PhoneUtils from "@/utils/phoneFormat";

export default function WorkerDetail() {
   const navigate = useNavigate();
	const { id } = useParams();
	const { workerData, isLoading, error } = useWorker();

	const worker = useMemo(() => {
		if (!id || !Array.isArray(workerData)) return null;
		return workerData.find((w) => String(w.id) === String(id));
	}, [id, workerData]);

	if (isLoading) return <Loader />;
	if (error)
		return (
			<div className="p-10 text-center text-destructive">{String(error)}</div>
		);
	if (!worker) return <div className="p-10 text-center">Ishchi topilmadi</div>;

	return (
		<div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
			{/* Top Navigation */}
			<div className="flex items-center justify-between">
				<Button onClick={() => navigate(-1)} className="gap-2 text-black">
					<ArrowLeft className="h-4 w-4" /> Ortga qaytish
				</Button>
				<Badge
					variant="outline"
					className="px-3 py-1 border-primary/20 text-primary"
				>
					ID: {worker.id}
				</Badge>
			</div>

			{/* Profil Sarlavhasi */}
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-extrabold tracking-tight capitalize text-foreground">
					{worker.full_name}
				</h1>
				<div className="flex items-center gap-4 text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<Briefcase className="h-4 w-4 text-primary" /> {worker.position}
					</span>
					<Separator orientation="vertical" className="h-4" />
					<span className="flex items-center gap-1.5">
						<Phone className="h-4 w-4 text-primary" />{" "}
						{PhoneUtils.formatPhone(worker.phone)}
					</span>
				</div>
			</div>

			{/* Asosiy Ma'lumotlar Kartalari */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-card/50 backdrop-blur-sm border-primary/5 shadow-md">
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-2">
							<Banknote className="h-4 w-4" /> Moliyaviy ma'lumot
						</CardDescription>
						<CardTitle className="text-2xl">
							{Number(worker.salary).toLocaleString()}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								{worker.salary_type}
							</span>
						</CardTitle>
					</CardHeader>
				</Card>

				<Card className="bg-card/50 backdrop-blur-sm border-primary/5 shadow-md">
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-2">
							<Layers className="h-4 w-4" /> Guruhlar soni
						</CardDescription>
						<CardTitle className="text-2xl">
							{worker.groups?.length || 0} ta faol guruh
						</CardTitle>
					</CardHeader>
				</Card>

				<Card className="bg-card/50 backdrop-blur-sm border-primary/5 shadow-md">
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-2">
							<Calendar className="h-4 w-4" /> Ish tartibi
						</CardDescription>
						<CardTitle className="text-2xl font-medium text-base">
							Full-time (Standart)
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			{/* Guruhlar Jadvali */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 px-1">
					<Users className="h-5 w-5 text-primary" />
					<h2 className="text-xl font-bold">Biriktirilgan guruhlar</h2>
				</div>

				<Card className="overflow-hidden border-primary/5 shadow-xl">
					{worker.groups && worker.groups.length > 0 ? (
						<Table>
							<TableHeader className="bg-primary">
								<TableRow>
									<TableHead>Guruh nomi</TableHead>
									<TableHead>Kurs yo'nalishi</TableHead>
									<TableHead>Narxi (oylik)</TableHead>
									<TableHead className="text-right">Dars jadvali</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{worker.groups.map((group) => (
									<TableRow
										key={group.id}
										className="bg-card transition-colors"
									>
										<TableCell className="font-semibold">
											{group.name}
										</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className="font-normal uppercase text-[10px]"
											>
												{group.course_type}
											</Badge>
										</TableCell>
										<TableCell>
											{Number(group.price).toLocaleString()} so'm
										</TableCell>
										<TableCell className="text-right font-mono text-xs text-muted-foreground italic">
											{group.lesson_time}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="p-12 text-center text-muted-foreground bg-muted/10">
							<Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
							Hozircha bu ishchiga guruhlar biriktirilmagan.
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
