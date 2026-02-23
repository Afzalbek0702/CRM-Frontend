import { useEffect, useState } from "react";

export default function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    method: "cash",
    created_by: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description || "",
        amount: initialData.amount || "",
        method: initialData.method || "cash",
        created_by: initialData.created_by || "",
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.description || !form.amount) return;

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
          {initialData ? "Edit Expense" : "Add Expense"}
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
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
            <label>Method</label>
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