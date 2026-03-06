import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../context/authContext";

export default function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
	const { user } = useAuth();
   
  const [form, setForm] = useState({
    description: "",
    amount: "",
    method: "cash",
    created_by: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description || "",
        amount: initialData.amount || "",
        method: initialData.method || "cash",
        created_by: user.id,
      });
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  function resetForm() {
    setForm({
      description: "",
      amount: "",
      method: "cash",
      created_by: "",
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

   function handleSubmit(e) {
    e.preventDefault();

    if (!form.description || !form.amount) return;

    onSubmit({
      ...form,
       amount: Number(form.amount),
      created_by: user.id,
    });

    resetForm();
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="side-panel-backdrop" onClick={onClose}></div>

      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div className="panel-title-section">
            <div className="panel-icon">
              {initialData ? <FaEdit /> : <FaPlus />}
            </div>
            <div>
              <h2>{initialData ? "Edit Expense" : "New Expense"}</h2>
              <p className="panel-subtitle">
                {initialData
                  ? "Update expense details"
                  : "Record a new expense"}
              </p>
            </div>
          </div>

          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">
                <FaMoneyBillWave className="field-icon" /> Tavsif
              </label>
              <input
                type="text"
                name="description"
                className="form-input"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Miqdor
              </label>
              <input
                type="number"
                name="amount"
                className="form-input"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Turi
              </label>
              <select
                name="method"
                className="form-input"
                value={form.method}
                onChange={handleChange}
              >
                <option value="CASH">Naqd pul</option>
                <option value="CARD">Carta</option>
                <option value="TRANSFER">Xisob raqam</option>
              </select>
            </div>
          </div>

          <div className="panel-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              <FaTimes /> Bekor qilish
            </button>

            <button type="submit" className="btn-submit">
              {initialData ? (
                <>
                  <FaEdit /> Saqlash
                </>
              ) : (
                <>
                  <FaPlus /> Yaratish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}