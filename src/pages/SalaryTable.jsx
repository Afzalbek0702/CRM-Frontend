import { useState } from "react";
import Loader from "../components/Loader";
import ActionMenu from "../components/ActionMenu";
import SalaryModal from "../components/SalaryModal";
import { useSalary } from "../services/salary/useSalary";

import {
  FaEllipsisV,
  FaUserTie,
  FaMoneyBillWave,
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";

export default function SalaryTable() {
  const {
    salaries,
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

  const totalSalaryPaid = (salaries || []).reduce(
    (sum, s) => sum + (s.amount || 0),
    0
  );

  return (
    <div className="table-container">

      {/* Summary */}
      <div className="salary-summary">
        <strong>Total Salary Paid:</strong>{" "}
        {totalSalaryPaid.toLocaleString()} so'm
      </div>

      <button
        onClick={() => {
          setEditingSalary(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "15px" }}
      >
        Add Salary
      </button>

      <table>
        <thead>
          <tr>
            <th><BsCalendar2DateFill /> Sana</th>
            <th><FaUserTie /> Xodim</th>
            <th><FaMoneyBillWave /> Miqdor</th>
            <th><BsCreditCard2BackFill /> To'lov turi</th>
            <th>Izoh</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {(salaries || []).length === 0 ? (
            <tr>
              <td colSpan="6">No salary records found.</td>
            </tr>
          ) : (
            (salaries || []).map((s) => (
              <tr key={s.id}>
                <td>{formatDate(s.created_at)}</td>
                <td>{s.full_name}</td>
                <td>
                  {s.amount?.toLocaleString() ?? 0} so'm
                </td>
                <td>{s.method}</td>
                <td>{s.description}</td>

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
                        salary: s,
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingSalary(null);
        }}
        initialData={editingSalary}
        onSubmit={async (formData) => {
          if (editingSalary) {
            await updateSalary(editingSalary.id, formData);
          } else {
            await createSalary(formData);
          }

          setIsModalOpen(false);
          setEditingSalary(null);
        }}
      />
    </div>
  );
}