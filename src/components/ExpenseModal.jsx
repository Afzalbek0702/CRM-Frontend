import { useEffect, useState, useCallback } from "react";
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

// Formaning boshlang'ich holati
const INITIAL_STATE = {
	description: "",
	amount: "",
	method: "CASH",
};

export default function ExpenseModal({
	isOpen,
	onClose,
	onSubmit,
	initialData = null,
}) {
	const { user } = useAuth();
	const [form, setForm] = useState(INITIAL_STATE);

	// Formani tozalash funksiyasi
	const resetForm = useCallback(() => {
		setForm(INITIAL_STATE);
	}, []);

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setForm({
					description: initialData.description || "",
					amount: initialData.amount || "",
					method: initialData.method || "CASH",
				});
			} else {
				resetForm();
			}
		}
	}, [initialData, isOpen, resetForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validatsiya
		const amountNum = Number(form.amount);
		if (!form.description.trim() || isNaN(amountNum) || amountNum <= 0) return;

		onSubmit({
			...form,
			amount: amountNum,
			created_by: user?.id,
		});

		onClose(); // Muvaffaqiyatli yuborilgach yopish
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-106.25 bg-zinc-950 border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						{initialData ? (
							<>
								<FaEdit className="text-primary" /> Xarajatni tahrirlash
							</>
						) : (
							<>
								<FaPlus className="text-green-500" /> Yangi xarajat
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					<div className="space-y-4">
						{/* Tavsif */}
						<div className="grid gap-2">
							<Label
								htmlFor="description"
								className="flex items-center gap-2 text-zinc-400"
							>
								<FaMoneyBillWave className="text-xs" /> Tavsif
							</Label>
							<Input
								id="description"
								name="description"
								placeholder="Masalan: Ijara to'lovi"
								value={form.description}
								onChange={handleChange}
								className="bg-zinc-900 border-zinc-800 focus:border-primary text-white"
								required
							/>
						</div>

						{/* Miqdor */}
						<div className="grid gap-2">
							<Label htmlFor="amount" className="text-zinc-400">
								Miqdor (so'mda)
							</Label>
							<Input
								id="amount"
								type="number"
								name="amount"
								placeholder="0.00"
								value={form.amount}
								onChange={handleChange}
								className="bg-zinc-900 border-zinc-800 focus:border-primary text-white font-mono"
								required
							/>
						</div>

						{/* To'lov turi */}
						<div className="grid gap-2">
							<Label className="text-zinc-400">To'lov turi</Label>
							<Select
								value={form.method}
								onValueChange={(val) => setForm((p) => ({ ...p, method: val }))}
							>
								<SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white">
									<SelectValue placeholder="Turini tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									<SelectItem value="CASH">Naqd pul</SelectItem>
									<SelectItem value="CARD">Plastik karta</SelectItem>
									<SelectItem value="TRANSFER">
										O'tkazma (Perexislat)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter className="pt-4 border-t border-zinc-800 gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							className="text-zinc-400 hover:text-white hover:bg-zinc-900"
						>
							Bekor qilish
						</Button>

						<Button
							type="submit"
							className="bg-primary hover:bg-primary/90 text-black font-semibold min-w-30"
						>
							{initialData ? "Saqlash" : "Yaratish"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
