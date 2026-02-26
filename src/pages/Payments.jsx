import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaMoneyBillWave, FaSearch } from "react-icons/fa";
import IncomeTable from "./IncomeTable";
import SalaryTable from "./SalaryTable";
import ExpensesTable from "./ExpensesTable";
import DebtorsTable from "./DebtorsTable";
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

	const validCategories = [ "income", "salary", "debtors", "expenses"];
	if (!validCategories.includes(category)) {
		return <p>Invalid category</p>;
	}

	return (
		<div className="table-container">
			<h2 className="upperCaseHeader">
				{category}
			</h2>

			{category === "debtors" && (
				<div className="table-actions">
					<div className="search-box">
						<FaSearch />
						<input
							type="text"
							placeholder="Search by student name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			)}

			<div className="payments-table-container">
				{renderContent()}
			</div>
		</div>
	);
}
