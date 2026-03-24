import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";

// Tables
import IncomeTable from "./IncomeTable";
import SalaryTable from "./SalaryTable";
import ExpensesTable from "./ExpensesTable";
import DebtorsTable from "./DebtorsTable";

export default function Payments() {
   const { category: rawCategory } = useParams();
   const navigate = useNavigate();   
	const category = rawCategory ?? "income";
	const [searchTerm, setSearchTerm] = useState("");

	const config = {
		income: { title: "To'lovlar", component: <IncomeTable /> },
		salary: { title: "Ish haqlari", component: <SalaryTable /> },
		expenses: { title: "Xarajatlar", component: <ExpensesTable /> },
		debtors: {
			title: "Qarzdorlar",
			component: <DebtorsTable searchTerm={searchTerm} />,
		},
	};

	const activeConfig = config[category];

	if (!activeConfig) {
		return (
			<div className="p-10 text-center">
				<h2 className="text-destructive font-bold">
					Xatolik: Bunday bo'lim mavjud emas.
				</h2>
				<div>
					<Button onClick={()=>navigate(-1)} className="btn-default">
						<ArrowLeft className="h-4 w-4" /> Ortga qaytish
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div>
						<Button onClick={() => navigate(-1)} className="btn-default">
							<ArrowLeft className="h-4 w-4" /> Ortga qaytish
						</Button>
						<h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 mt-3">
							{activeConfig.title}
						</h2>
					</div>
				</div>

				{category === "debtors" && (
					<div className="relative w-full sm:w-72">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Ism bo'yicha qidirish..."
							className="pl-9 bg-muted/50 focus:bg-background"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				)}
			</div>

			{/* Jadval qismi */}
			<div className="rounded-xl ">
				<div className="overflow-x-auto">{activeConfig.component}</div>
			</div>
		</div>
	);
}
