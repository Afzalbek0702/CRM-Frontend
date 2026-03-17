import { useState } from "react";
import Loader from "../components/Loader";
import ActionMenu from "../components/ActionMenu";
import ExpenseModal from "../components/ExpenseModal";
import { useExpenses } from "../services/expense/useExpense";
import { useConfirm } from "../components/ConfirmProvider";
import { withConfirm } from "../helpers/withConfirm";
import {
    FaEllipsisV,
    FaMoneyBillWave,
    FaUser,
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";
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


export default function ExpensesTable() {
    const confirm = useConfirm();
    const {
        expenses,
        isLoading,
        createExpense,
        updateExpense,
        deleteExpense,
    } = useExpenses();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        position: { top: 0, left: 0 },
        expense: null,
    });
    const handleDeleteExpense = withConfirm(
        confirm,
        "Are you sure you want to delete this expense?",
        async (expense) => {
            await deleteExpense(expense.id);
            setActionMenu((m) => ({ ...m, isOpen: false }));
        }
    );

    if (isLoading) return <Loader />;


    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString() : "";

    const totalExpenses = (expenses || []).reduce(
        (sum, e) => sum + (e.amount || 0),
        0
    );

    return (
        <div className="table-container">
            {/* Summary */}
            <div className="expense-summary">
                <strong>Jami harajatlar:</strong>{" "}
                {totalExpenses.toLocaleString()} so'm
            </div>

            <div className="table-actions mb-[30px]">
                <Button className="btn1" onClick={() => setIsModalOpen(true)}>
                    Xarajat qo'shish
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div><BsCalendar2DateFill /> Sana</div>
                        </TableHead>

                        <TableHead>
                            <div><FaMoneyBillWave /> Tavsif</div>
                        </TableHead>

                        <TableHead>
                            <div><FaMoneyBillWave /> Miqdor</div>
                        </TableHead>

                        <TableHead>
                            <div><BsCreditCard2BackFill /> To'lov turi</div>
                        </TableHead>

                        <TableHead>
                            <div><FaUser /> Kiritgan</div>
                        </TableHead>

                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {(expenses || []).length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6}>
                                Xarajatlar topilmadi.
                            </TableCell>
                        </TableRow>
                    ) : (
                        (expenses || []).map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{formatDate(e.created_at)}</TableCell>
                                <TableCell>{e.description}</TableCell>
                                <TableCell>
                                    {e.amount?.toLocaleString() ?? 0} so'm
                                </TableCell>
                                <TableCell>{e.method}</TableCell>
                                <TableCell>{e.created_by}</TableCell>
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
                                                expense: e,
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
                entityLabel="Expense"
                onEdit={() => {
                    const e = actionMenu.expense;
                    setEditingExpense(e);
                    setIsModalOpen(true);
                    setActionMenu((m) => ({
                        ...m,
                        isOpen: false,
                    }));
                }}
                onDelete={() => handleDeleteExpense(actionMenu.expense)}
            />

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
                initialData={editingExpense}
                onSubmit={(formData) => {
                    if (editingExpense) {
                        updateExpense(editingExpense.id, formData);
                    } else {
                        createExpense(formData);
                    }
                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
            />
        </div>
    );
}