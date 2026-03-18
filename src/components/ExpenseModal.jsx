import { useEffect, useState } from "react";
import { FaPlus, FaMoneyBillWave, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/authContext";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    method: "CASH",
    created_by: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description || "",
        amount: initialData.amount || "",
        method: initialData.method || "CASH",
        created_by: user?.id || "",
      });
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  function resetForm() {
    setForm({
      description: "",
      amount: "",
      method: "CASH",
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
      created_by: user?.id,
    });

    resetForm();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Expense" : "New Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="modal-inputs">
            <div>
              <Label>
                <FaMoneyBillWave /> Tavsif
              </Label>
              <Input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Miqdor</Label>
              <Input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Turi</Label>
              <Select
                value={form.method}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, method: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Naqd pul</SelectItem>
                  <SelectItem value="CARD">Carta</SelectItem>
                  <SelectItem value="TRANSFER">Xisob raqam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className={"btn-cancel"}>
              Bekor qilish
            </Button>

            <Button type="submit" className={"btn-default"}>
              {initialData ? (
                <>
                  <FaEdit /> Saqlash
                </>
              ) : (
                <>
                  <FaPlus /> Yaratish
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
