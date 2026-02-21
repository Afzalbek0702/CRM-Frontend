import { useEffect, useState } from "react";

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
    <div className="modal-overlay">
      <div className="modal">
        <h3>
          {initialData ? "Edit Salary" : "Add Salary"}
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">
              {initialData ? "Update" : "Create"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}