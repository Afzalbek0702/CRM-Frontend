import { useEffect, useState, useCallback } from "react";
import {
	FaPlus,
	FaMoneyBillWave,
	FaEdit,
	FaWallet,
	FaAlignLeft,
	FaUserTie,
	FaCalendarAlt,
} from "react-icons/fa";
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
import { useWorker } from "@/services/worker/useWorker";

const INITIAL_FORM_STATE = {
	worker_id: "",
	amount: "",
	method: "CASH",
	description: "",
	month: new Date().toISOString().slice(0, 7), // Hozirgi oyni default qilib olamiz (YYYY-MM)
};

export default function SalaryModal({
	isOpen,
	onClose,
	onSubmit,
	initialData = null,
}) {
	const [form, setForm] = useState(INITIAL_FORM_STATE);
	const { workerData, isLoading } = useWorker();

	const resetForm = useCallback(() => {
		if (initialData) {
			setForm({
				...initialData,
				worker_id: String(initialData.worker_id),
				amount: String(initialData.amount),
				// Agar bazadan kelgan sana ISO bo'lsa, uni YYYY-MM formatiga keltiramiz
				month: initialData.month || new Date().toISOString().slice(0, 7),
			});
		} else {
			setForm(INITIAL_FORM_STATE);
		}
	}, [initialData]);

	useEffect(() => {
		if (isOpen) resetForm();
	}, [isOpen, resetForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.worker_id || !form.amount || !form.month) return;

		onSubmit({
			...form,
			worker_id: Number(form.worker_id),
			amount: Number(form.amount),
			// month o'zi "2024-05" formatida bo'ladi
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold flex items-center gap-2">
						{initialData ? (
							<>
								<FaEdit className="text-primary" /> Ish haqini tahrirlash
							</>
						) : (
							<>
								<FaPlus className="text-green-500" /> Yangi ish haqi
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					<div className="grid grid-cols-1 gap-4">
						{/* Xodimni tanlash */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaUserTie className="text-xs" /> Xodim
							</Label>
							<Select
								value={form.worker_id}
								onValueChange={val => setForm(p => ({ ...p, worker_id: val }))}
								disabled={isLoading || !!initialData}
							>
								<SelectTrigger className="w-full bg-zinc-900 border-zinc-800 focus:ring-primary">
									<SelectValue placeholder="Xodimni tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									{workerData?.map(worker => (
										<SelectItem key={worker.id} value={String(worker.id)}>
											{worker.full_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Qaysi oy uchun (MONTH INPUT) */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2 text-zinc-400">
									<FaCalendarAlt className="text-xs" /> Qaysi oy uchun
								</Label>
								<Input
									type="month" // Brauzerning standart Month pickeri
									name="month"
									value={form.month}
									onChange={handleChange}
									required
									className="bg-zinc-900 border-zinc-800 focus:border-primary appearance-none"
								/>
							</div>

							{/* Miqdor */}
							<div className="space-y-2">
								<Label className="text-zinc-400">Miqdori (so'm)</Label>
								<Input
									type="number"
									name="amount"
									placeholder="0"
									value={form.amount}
									onChange={handleChange}
									required
									className="bg-zinc-900 border-zinc-800 font-mono focus:border-primary"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4">
							{/* To'lov usuli */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2 text-zinc-400">
									<FaWallet className="text-xs" /> To'lov turi
								</Label>
								<Select
									value={form.method}
									onValueChange={val => setForm(p => ({ ...p, method: val }))}
								>
									<SelectTrigger className="w-full bg-zinc-900 border-zinc-800 focus:ring-yellow-600">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
										<SelectItem value="CASH">Naqd pul</SelectItem>
										<SelectItem value="CARD">Karta (P2P)</SelectItem>
										<SelectItem value="TRANSFER">Hisob raqam</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Tavsif */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2 text-zinc-400">
									<FaAlignLeft className="text-xs" /> Tavsif
								</Label>
								<Input
									name="description"
									placeholder="Izoh yozing..."
									value={form.description || ""}
									onChange={handleChange}
									className="bg-zinc-900 border-zinc-800 focus:border-primary"
								/>
							</div>
						</div>
					</div>

					<DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-zinc-800">
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
							className="bg-primary hover:bg-primary/90 text-black font-bold px-8"
						>
							{initialData ? "Saqlash" : "Tasdiqlash"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
