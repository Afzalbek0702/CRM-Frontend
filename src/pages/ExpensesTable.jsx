import { useState } from "react";
import Loader from "../components/Loader";
import ActionMenu from "../components/ActionMenu";
import ExpenseModal from "../components/ExpenseModal";
import { useExpense } from "../services/expense/useExpense";

import {
    FaEllipsisV,
    FaMoneyBillWave,
    FaUser,
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";

export default function ExpensesTable() {
    const {
        expenses,
        isLoading,
        createExpense,
        updateExpense,
        deleteExpense,
    } = useExpense();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        position: { top: 0, left: 0 },
        expense: null,
    });

    if (isLoading) return <Loader />;

    console.log(useExpense);
    

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
                <strong>Total Expenses:</strong>{" "}
                {totalExpenses.toLocaleString()} so'm
            </div>

            <button onClick={() => setIsModalOpen(true)}>
                Add Expense
            </button>

            <table>
                <thead>
                    <tr>
                        <th><BsCalendar2DateFill /> Sana</th>
                        <th><FaMoneyBillWave /> Tavsif</th>
                        <th><FaMoneyBillWave /> Miqdor</th>
                        <th><BsCreditCard2BackFill /> To'lov turi</th>
                        <th><FaUser /> Kiritgan</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {(expenses || []).length === 0 ? (
                        <tr>
                            <td colSpan="6">No expenses found.</td>
                        </tr>
                    ) : (
                        (expenses || []).map((e) => (
                            <tr key={e.id}>
                                <td>{formatDate(e.created_at)}</td>
                                <td>{e.description}</td>
                                <td>
                                    {e.amount?.toLocaleString() ?? 0} so'm
                                </td>
                                <td>{e.method}</td>
                                <td>{e.created_by}</td>

                                <td style={{ width: "10px" }}>
                                    <button
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
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

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
                onDelete={async () => {
                    const e = actionMenu.expense;
                    if (!e) return;
                    await deleteExpense(e.id);
                    setActionMenu((m) => ({
                        ...m,
                        isOpen: false,
                    }));
                }}
            />

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
                initialData={editingExpense}
                onSubmit={async (formData) => {
                    if (editingExpense) {
                        await updateExpense(
                            editingExpense.id,
                            formData
                        );
                    } else {
                        await createExpense(formData);
                    }

                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
            />
        </div>
    );
}