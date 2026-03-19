import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Loader from "../components/Loader";
import { useWorker } from "../services/worker/useWorker";
import { FaUsers } from "react-icons/fa";
import { goBack } from "../utils/navigate.js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function WorkerDetail() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { workerData, isLoading, error } = useWorker();

	const worker = useMemo(() => {
		if (!id || !Array.isArray(workerData)) return null;
		return workerData.find((w) => String(w.id) === String(id));
	}, [id, workerData]);

	if (isLoading) return <Loader />;
	if (error) return <p>{String(error)}</p>;
	if (!worker) return <p>Ishchi topilmadi</p>;

	return (
		<div className="table-container">
			<Button variant="outline" onClick={goBack} className={"btn-default"}>
				← Ortga
			</Button>

			<h2 className="text-xl font-semibold capitalize">{worker.full_name}</h2>

			<Card>
				<CardHeader>
					<CardTitle>Ma'lumotlar</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p>
						<strong>Pozitsiya:</strong> {worker.position}
					</p>
					<p>
						<strong>Telefon raqami:</strong> {worker.phone}
					</p>
					<p>
						<strong>Oylik maoshi:</strong> {worker.salary} {worker.salary_type}
					</p>
				</CardContent>
			</Card>

			<h2>
				<FaUsers /> Guruhlari
			</h2>

			{worker.groups && worker.groups.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nomi</TableHead>
							<TableHead>Kurs turi</TableHead>
							<TableHead>Narx</TableHead>
							<TableHead>Dars vaqti</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{worker.groups.map((group) => (
							<TableRow key={group.id}>
								<TableCell>{group.name}</TableCell>
								<TableCell>{group.course_type}</TableCell>
								<TableCell>{group.price}</TableCell>
								<TableCell>{group.lesson_time}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p className="text-sm text-muted-foreground">Guruhlar topilmadi</p>
			)}
		</div>
	);
}
