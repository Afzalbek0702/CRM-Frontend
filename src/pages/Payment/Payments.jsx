import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
					<Button onClick={() => navigate(-1)} className="btn-default">
						<ArrowLeft className="h-4 w-4" /> Ortga qaytish
					</Button>
				</div>
			</div>
		);
	}

	return (
		// <div className="space-y-6 bg-background animate-in fade-in duration-200">
		<>{activeConfig.component}</>
		// </div>
	);
}
