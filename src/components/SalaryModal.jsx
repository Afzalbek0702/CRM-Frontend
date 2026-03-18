import { useEffect, useState } from "react";
import { FaPlus, FaMoneyBillWave, FaEdit } from "react-icons/fa";

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

export default function SalaryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    full_name: "",
    amount: "",
    method: "CASH",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || "",
        amount: initialData.amount || "",
        method: initialData.method || "CASH",
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
      method: "CASH",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Salary" : "New Salary"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="modal-inputs">
            <div>
              <Label>
                <FaMoneyBillWave /> Ism familiya
              </Label>
              <Input
                type="text"
                name="full_name"
                value={form.full_name}
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

            <div>
              <Label>Tavsif</Label>
              <Input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
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
