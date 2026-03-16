import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaMoneyBillWave, FaSearch } from "react-icons/fa";
import IncomeTable from "./IncomeTable";
import SalaryTable from "./SalaryTable";
import ExpensesTable from "./ExpensesTable";
import DebtorsTable from "./DebtorsTable";
import { goBack } from "../utils/navigate.js";

export default function Payments() {
	const { category: rawCategory } = useParams();
	const category = rawCategory ?? "income";

	const [searchTerm, setSearchTerm] = useState("");

	function renderContent() {
		switch (category) {
			case "income":
				return <IncomeTable />;
			case "salary":
				return <SalaryTable />;
			case "expenses":
				return <ExpensesTable />;
			case "debtors":
				return <DebtorsTable searchTerm={searchTerm} />;
			default:
				return <p>Invalid category</p>;
		}
	}

	const validCategories = ["income", "salary", "debtors", "expenses"];
	if (!validCategories.includes(category)) {
		return <p>Invalid category</p>;
	}

	return (
		<div className="space-y-4">
			<Button variant="default" onClick={goBack}>
				← Ortga
			</Button>

			<h2 className="text-xl font-semibold uppercase">
				{category === "income"
					? "To'lovlar"
					: category === "salary"
						? "Ish haqlari"
						: category === "expenses"
							? "Harajatlar"
							: category === "debtors"
								? "Qarzdorlar"
								: ""}
			</h2>

			{category === "debtors" && (
				<div className="flex items-center gap-2 mb-6">
					<Input
						type="text"
						placeholder="O'quvchilarni ismi bo'yicha qidirish..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						icon={<FaSearch className="text-sm" />}
					/>
				</div>
			)}

			<div className="overflow-x-auto">
				{category === "income" && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>O'quvchi</TableHead>
								<TableHead>Miqdor</TableHead>
								<TableHead>Sana</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payments?.map((p) => (
								<TableRow key={p.id}>
									<TableCell>{p.student_name}</TableCell>
									<TableCell>{p.amount?.toLocaleString() ?? 0} so'm</TableCell>
									<TableCell>{p.date?.split("T")[0]}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}

				{renderContent()}
			</div>
		</div>
	);
}
