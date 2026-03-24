import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
	FaDollarSign,
	FaCreditCard,
	FaSave,
	FaPlus,
	FaCalendarDay,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
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

export default function PaymentModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	student,
}) {
	const [formData, setFormData] = useState({
		amount: "",
		method: "CASH",
		paid_month: "",
	});

	// Formani reset qilish
	const resetToDefault = useCallback(() => {
		const today = new Date().toISOString().substring(0, 7); // "YYYY-MM" formati
		setFormData({
			amount: "",
			method: "CASH",
			paid_month: today,
		});
	}, []);

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setFormData({
					amount: initialData.amount || "",
					method: initialData.method || "CASH",
					paid_month: initialData.paid_month
						? initialData.paid_month.substring(0, 7)
						: "",
				});
			} else {
				resetToDefault();
			}
		}
	}, [initialData, isOpen, resetToDefault]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const amountNum = parseFloat(formData.amount);
		if (!formData.amount || amountNum <= 0) {
			toast.error("To'lov miqdori 0 dan katta bo'lishi kerak");
			return;
		}

		const payload = {
			...formData,
			amount: amountNum,
			student_id: student?.id,
			// Backend kutilayotgan formatga qarab "2026-03" ni "2026-03-01" ga aylantirish mumkin:
			paid_month: `${formData.paid_month}-01`,
		};

		onSubmit(payload);
		onClose();
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(onOpenChange) => !onOpenChange && onClose()}
		>
			<DialogContent className="sm:max-w-106.25 bg-zinc-950 border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl font-bold">
						{initialData ? (
							<>
								<FaSave className="text-primary" /> To'lovni tahrirlash
							</>
						) : (
							<>
								<FaPlus className="text-green-500" /> Yangi to'lov
							</>
						)}
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						{student?.full_name} uchun to'lov ma'lumotlarini kiriting.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					<div className="grid gap-4">
						{/* Miqdor */}
						<div className="grid gap-2">
							<Label
								htmlFor="amount"
								className="flex items-center gap-2 text-zinc-300"
							>
								<FaDollarSign className="text-xs text-zinc-500" /> Miqdor (so'm)
							</Label>
							<Input
								id="amount"
								name="amount"
								type="number"
								placeholder="Masalan: 500,000"
								className="bg-zinc-900 border-zinc-800 focus:border-primary font-mono text-lg"
								required
								value={formData.amount}
								onChange={handleChange}
							/>
						</div>

						{/* To'lov turi */}
						<div className="grid gap-2">
							<Label className="flex items-center gap-2 text-zinc-300">
								<FaCreditCard className="text-xs text-zinc-500" /> To'lov usuli
							</Label>
							<Select
								value={formData.method}
								onValueChange={(val) =>
									setFormData((p) => ({ ...p, method: val }))
								}
							>
								<SelectTrigger className="bg-zinc-900 border-zinc-800">
									<SelectValue placeholder="Tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									<SelectItem value="CASH">Naqd pul</SelectItem>
									<SelectItem value="CARD">Plastik karta</SelectItem>
									<SelectItem value="TRANSFER">Bank o'tkazmasi</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Qaysi oy uchun */}
						<div className="grid gap-2">
							<Label className="flex items-center gap-2 text-zinc-300">
								<FaCalendarDay className="text-xs text-zinc-500" /> Qaysi oy
								uchun?
							</Label>
							<Input
								name="paid_month"
								type="month"
								required
								className="bg-zinc-900 border-zinc-800 focus:ring-primary"
								value={formData.paid_month}
								onChange={handleChange}
							/>
						</div>
					</div>

					<DialogFooter className="pt-4 border-t border-zinc-800 gap-2 sm:gap-0">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							className="text-zinc-400 hover:text-white"
						>
							Bekor qilish
						</Button>
						<Button
							type="submit"
							className="bg-primary hover:bg-primary/90 text-black font-bold px-6"
						>
							{initialData ? "Saqlash" : "To'lovni qabul qilish"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
