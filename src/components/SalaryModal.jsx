import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaMoneyBillWave, FaEdit } from "react-icons/fa";

export default function SalaryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    full_name: "",
    amount: "",
    method: "cash",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || "",
        amount: initialData.amount || "",
        method: initialData.method || "cash",
        description: initialData.description || "",
      });
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  function resetForm() {
    setForm({
      full_name: "",
      amount: "",
      method: "cash",
      description: "",
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.full_name || !form.amount) return;

    await onSubmit({
      ...form,
      amount: Number(form.amount),
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
              <h2>{initialData ? "Edit Salary" : "New Salary"}</h2>
              <p className="panel-subtitle">
                {initialData
                  ? "Update salary details"
                  : "Record a new salary payment"}
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
                <FaMoneyBillWave className="field-icon" /> Ism familiya
              </label>
              <input
                type="text"
                name="full_name"
                className="form-input"
                value={form.full_name}
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

            <div className="form-group full-width">
              <label className="form-label">
                Tavsif
              </label>
              <input
                type="text"
                name="description"
                className="form-input"
                value={form.description}
                onChange={handleChange}
              />
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