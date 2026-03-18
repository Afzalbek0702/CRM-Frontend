import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaMoneyBillWave, FaSearch } from "react-icons/fa";
import IncomeTable from "./IncomeTable";
import SalaryTable from "./SalaryTable";
import ExpensesTable from "./ExpensesTable";
import DebtorsTable from "./DebtorsTable";
import { goBack } from "../utils/navigate.js";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"
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
		<div className="space-y-4 table-container">
			<Button variant="default" className={"btn-default"} onClick={goBack}>
				← Ortga
			</Button>

			<h2 className="text-xl font-semibold">
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
				<div className=" table-actions flex items-center gap-2 mb-6">
					<InputGroup>
						<InputGroupInput
							type="text"
							placeholder="O'quvchilarni ismi bo'yicha qidirish..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<InputGroupAddon>
							<FaSearch className="text-sm" />
						</InputGroupAddon>
					</InputGroup>
				</div>
			)}

			<div className="overflow-x-auto">
				{renderContent()}
			</div>
		</div>
	);
}
