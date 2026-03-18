import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
	FaDollarSign,
	FaCreditCard,
	FaSave,
	FaPlus,
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
		paid_at: "",
	});

	useEffect(() => {
		if (initialData) {
			const paidDate = initialData.paid_at
				? String(initialData.paid_at).split("T")[0]
				: "";

			setFormData({
				amount: initialData.amount || "",
				method: initialData.method || "CASH",
				paid_at: paidDate,
			});
		} else {
			const today = new Date().toISOString().split("T")[0];
			setFormData({
				amount: "",
				method: "CASH",
				paid_at: today,
			});
		}
	}, [initialData, isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			toast.error("To'lov miqdori 0 dan katta bo'lishi kerak");
			return;
		}

		const payload = {
			...formData,
			amount: Number(formData.amount),
			student_id: student?.id,
		};

		onSubmit(payload);

		setFormData({
			amount: "",
			method: "CASH",
			paid_at: new Date().toISOString().split("T")[0],
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{initialData ? "Edit Payment" : "New Payment"}
					</DialogTitle>
					<DialogDescription>
						{initialData
							? "Update payment details"
							: "Record a new payment"}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="modal-inputs">
						<div>
							<Label>
								<FaDollarSign /> Miqdor
							</Label>
							<Input
								name="amount"
								type="number"
								required
								value={formData.amount}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label>
								<FaCreditCard /> Turi
							</Label>
							<Select
								value={formData.method}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, method: value }))
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
							<Label>Oy uchun to'lov</Label>
							<Input
								name="paid_at"
								type="month"
								required
								value={formData.paid_at}
								onChange={handleChange}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Bekor qilish
						</Button>

						<Button type="submit">
							{initialData ? (
								<>
									<FaSave /> Saqlash
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
