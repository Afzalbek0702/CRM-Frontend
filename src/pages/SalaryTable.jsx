import { useState } from "react";
import Loader from "../components/Loader";
import ActionMenu from "../components/ActionMenu";
import { useSalary } from "../services/salary/useSalary";
import SalaryModal from "../components/SalaryModal";
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
import { Button } from "@/components/ui/button";
import {
  FaEllipsisV,
  FaUserTie,
  FaMoneyBillWave,
  FaPlus
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill, } from "react-icons/bs";

export default function SalaryTable() {
  const {
    salary,
    isLoading,
    createSalary,
    updateSalary,
    deleteSalary,
  } = useSalary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);

  const [actionMenu, setActionMenu] = useState({
    isOpen: false,
    position: { top: 0, left: 0 },
    salary: null,
  });

  if (isLoading) return <Loader />;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "";

  const totalSalaryPaid = (salary || []).reduce(
    (sum, s) => sum + (s.amount || 0),
    0
  );

  return (
    <div className="table-container">
	<div className="table-actions mb-[30px]">
		<div style={{ marginBottom: "16px" }}>
			<Button
				className="btn btn-default bg-primary  text-nowrap"
				onClick={() => {
					setEditingSalary(null);
					setIsModalOpen(true);
				}}
			>
				<FaPlus /> Yangi ish haqi
			</Button>
		</div>
	</div>

	<div className="salary-summary">
		<strong>Jami to'langan ish haqi:</strong>{" "}
		{totalSalaryPaid.toLocaleString()} so'm
	</div>

	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>
					<BsCalendar2DateFill /> Sana
				</TableHead>

				<TableHead>
					<FaUserTie /> Xodim
				</TableHead>

				<TableHead>
					<FaMoneyBillWave /> Miqdor
				</TableHead>

				<TableHead>
					<BsCreditCard2BackFill /> To'lov turi
				</TableHead>

				<TableHead>Izoh</TableHead>

				<TableHead></TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			{(salary || []).length === 0 ? (
				<TableRow>
					<TableCell colSpan={6}>
						To'langan ish haqlari topilmadi.
					</TableCell>
				</TableRow>
			) : (
				(salary || []).map((s) => (
					<TableRow key={s.id}>
						<TableCell>{formatDate(s.created_at)}</TableCell>

						<TableCell>{s.worker.full_name}</TableCell>

						<TableCell>
							{s.amount?.toLocaleString() ?? 0} so'm
						</TableCell>

						<TableCell>{s.method}</TableCell>

						<TableCell>{s.description}</TableCell>

						<TableCell style={{ width: "10px" }}>
							<Button
								className="icon-button"
								onClick={(ev) => {
									const rect =
										ev.currentTarget.getBoundingClientRect();

									setActionMenu({
										isOpen: true,
										position: {
											top:
												rect.bottom +
												window.scrollY +
												8 +
												"px",
											left:
												rect.right +
												window.scrollX -
												150 +
												"px",
										},
										salary: s,
									});
								}}
							>
								<FaEllipsisV />
							</Button>
						</TableCell>
					</TableRow>
				))
			)}
		</TableBody>
	</Table>

	<ActionMenu
		isOpen={actionMenu.isOpen}
		position={actionMenu.position}
		onClose={() =>
			setActionMenu((s) => ({
				...s,
				isOpen: false,
			}))
		}
		entityLabel="Salary"
		onEdit={() => {
			const s = actionMenu.salary;
			setEditingSalary(s);
			setIsModalOpen(true);
			setActionMenu((m) => ({
				...m,
				isOpen: false,
			}));
		}}
		onDelete={async () => {
			const s = actionMenu.salary;
			if (!s) return;
			await deleteSalary(s.id);
			setActionMenu((m) => ({
				...m,
				isOpen: false,
			}));
		}}
	/>

	<SalaryModal
		isOpen={isModalOpen}
		initialData={editingSalary}
		onClose={() => {
			setIsModalOpen(false);
			setEditingSalary(null);
		}}
		onSubmit={async (data) => {
			if (editingSalary) {
				await updateSalary(editingSalary.id, data);
			} else {
				await createSalary(data);
			}

			setIsModalOpen(false);
			setEditingSalary(null);
		}}
	/>
</div>
  );
}