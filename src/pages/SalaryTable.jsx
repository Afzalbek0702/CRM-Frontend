import { useState } from "react";
import Loader from "../components/Loader";
import ActionMenu from "../components/ActionMenu";
import { useSalary } from "../services/salary/useSalary";
import SalaryModal from "../components/SalaryModal";

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

      <div className="table-actions">
        <div style={{ marginBottom: "16px" }}>
          <button
            className="btn1"
            onClick={() => {
              setEditingSalary(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus /> Yangi ish haqi
          </button>
        </div>
      </div>

      <div className="salary-summary">
        <strong>Jami to'langan ish haqi:</strong>{" "}
        {totalSalaryPaid.toLocaleString()} so'm
      </div>

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
          {(salary || []).length === 0 ? (
            <tr>
              <td colSpan="6">To'langan ish haqlari topilmadi.</td>
            </tr>
          ) : (
            (salary || []).map((s) => (
              <tr key={s.id}>
                <td>{formatDate(s.created_at)}</td>
                <td>{s.worker.full_name}</td>
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