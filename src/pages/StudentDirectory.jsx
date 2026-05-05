import { useState } from "react";
import {
	Search,
	Filter,
	Download,
	UserCheck,
	MoreHorizontal,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Davomat uchun
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudentDirectory() {
	const [searchTerm, setSearchTerm] = useState("");

	// Namuna ma'lumotlar (Bularni API'dan keladi deb tasavvur qilamiz)
	const students = [
		{ id: "ST-001", name: "Ali Valiyev", status: "active", attendance: 85 },
		{
			id: "ST-002",
			name: "Olima Toshpo'latova",
			status: "inactive",
			attendance: 45,
		},
		{
			id: "ST-003",
			name: "Javohir Ergashev",
			status: "active",
			attendance: 92,
		},
	];

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-200">
			{/* Header & Actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						O'quvchilar katalogi
					</h2>
					<p className="text-sm text-muted-foreground">
						Barcha o'quvchilar ro'yxati va ularning statistikasi
					</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative w-full md:w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="ID yoki ism bo'yicha..."
							className="pl-9 h-10"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>

					<Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
						<Filter className="h-4 w-4" />
					</Button>

					<Button variant="default" className="gap-2 h-10">
						<Download className="h-4 w-4" />
						<span className="hidden sm:inline">Yuklab olish</span>
					</Button>
				</div>
			</div>

			{/* Table Section */}
			<div className="rounded-md border bg-background">
				<Table>
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="w-37.5">ID raqami</TableHead>
							<TableHead>F.I.SH</TableHead>
							<TableHead>Holati</TableHead>
							<TableHead className="w-50">Davomat</TableHead>
							<TableHead className="w-12.5"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students.length > 0 ? (
							students.map(student => (
								<TableRow
									key={student.id}
									className="group bg-card transition-colors"
								>
									<TableCell className="font-mono text-xs font-medium">
										{student.id}
									</TableCell>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
												{student.name.charAt(0)}
											</div>
											{student.name}
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												student.status === "active" ? "success" : "secondary"
											}
											className="capitalize"
										>
											{student.status === "active" ? "Faol" : "Nofaol"}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-3">
											<Progress
												value={student.attendance}
												className={`h-2 flex-1 ${student.attendance < 50 ? "[&>div]:bg-destructive" : ""}`}
											/>
											<span className="text-xs font-semibold w-8 text-right">
												{student.attendance}%
											</span>
										</div>
									</TableCell>
									<TableCell className={"flex justify-end"}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem className="cursor-pointer gap-2">
													<UserCheck className="h-4 w-4" /> Profilni ko'rish
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
													O'chirish
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center text-muted-foreground"
								>
									O'quvchilar topilmadi.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
