import { useState, useEffect, useCallback } from "react";
import {
	FaUser,
	FaPhone,
	FaBirthdayCake,
	FaUsers,
	FaSave,
	FaPlus,
	FaWallet,
} from "react-icons/fa";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import PhoneUtils from "@/utils/phoneFormat";

const INITIAL_STUDENT = {
	full_name: "",
	phone: "",
	birthday: "",
	parents_name: "",
	parents_phone: "",
	balance: "",
};

export default function StudentModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}) {
	const [formData, setFormData] = useState(INITIAL_STUDENT);
	const [date, setDate] = useState();

	const resetForm = useCallback(() => {
		if (initialData) {
			const bday = initialData.birthday
				? String(initialData.birthday).split("T")[0]
				: "";
			setFormData({
				...initialData,
				birthday: bday,
				balance: initialData.balance ?? "",
			});
			setDate(bday ? new Date(bday) : undefined);
		} else {
			setFormData(INITIAL_STUDENT);
			setDate(undefined);
		}
	}, [initialData]);

	useEffect(() => {
		if (isOpen) resetForm();
	}, [isOpen, resetForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
	};
	const handlePhoneChange = (e) => {
		const formatted = PhoneUtils.formatPhone(e.target.value);
		setFormData({ ...formData, phone: formatted });
	};
	const handleKeyDown = (e) => {
		// Agar foydalanuvchi "+(998) " qismini o'chirmoqchi bo'lsa, to'xtatib qolamiz
		if (e.key === "Backspace" && e.target.value.length <= 7) {
			e.preventDefault();
		}
	};
	const handleSelect = (selectedDate) => {
		setDate(selectedDate);
		setFormData((prev) => ({
			...prev,
			birthday: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			...formData,
			balance: Number(formData.balance || 0),
			phone: PhoneUtils.cleanPhone(formData.phone),
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] sm:max-w-xl bg-zinc-950 border-zinc-800 text-white overflow-y-auto max-h-[95vh]">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold flex items-center gap-2">
						{initialData ? (
							<FaSave className="text-primary" />
						) : (
							<FaPlus className="text-green-500" />
						)}
						{initialData
							? "Talaba ma'lumotlarini tahrirlash"
							: "Yangi talaba qo'shish"}
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Talaba va uning ota-onasi haqidagi asosiy ma'lumotlarni kiriting.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* Talaba ismi */}
						<div className="sm:col-span-2 space-y-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaUser className="text-[10px]" /> To'liq ism familiyasi
							</Label>
							<Input
								name="full_name"
								required
								placeholder="Ali Valiyev"
								className="bg-zinc-900 border-zinc-800 focus:border-primary"
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>

						{/* Telefon va Tug'ilgan kun */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaPhone className="text-[10px]" /> Telefon raqami
							</Label>
							<Input
								name="phone"
								required
								placeholder="+998 90 123 45 67"
								className="bg-zinc-900 border-zinc-800"
								value={formData.phone}
								onChange={handlePhoneChange}
								onKeyDown={handleKeyDown}
							/>
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaBirthdayCake className="text-[10px]" /> Tug'ilgan kuni
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white",
											!date && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4 text-primary" />
										{date ? format(date, "dd-MM-yyyy") : "Sanani tanlang"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
									<Calendar
										mode="single"
										selected={date}
										onSelect={handleSelect}
										initialFocus
										fromYear={1990}
										toYear={new Date().getFullYear()}
										captionLayout="dropdown-buttons"
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Ota-ona ma'lumotlari - Ajratilgan blok */}
						<div className="sm:col-span-2 mt-2">
							<div className="flex items-center gap-2 mb-4">
								<div className="h-[1px] flex-1 bg-zinc-800"></div>
								<span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
									Ota-ona ma'lumotlari
								</span>
								<div className="h-[1px] flex-1 bg-zinc-800"></div>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaUsers className="text-[10px]" /> Ota-onasi ismi
							</Label>
							<Input
								name="parents_name"
								placeholder="Ismi va sharifi"
								className="bg-zinc-900 border-zinc-800"
								value={formData.parents_name}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaPhone className="text-[10px]" /> Ota-onasi raqami
							</Label>
							<Input
								name="parents_phone"
								placeholder="+998 99 888 77 66"
								className="bg-zinc-900 border-zinc-800"
								value={formData.parents_phone}
								onChange={handlePhoneChange}
								onKeyDown={handleKeyDown}
							/>
						</div>

						{/* Balans - Alohida urg'u bilan */}
						<div className="sm:col-span-2 space-y-2 pt-2">
							<Label className="flex items-center gap-2 text-zinc-400">
								<FaWallet className="text-[10px]" /> Dastlabki balans (so'm)
							</Label>
							<Input
								name="balance"
								type="number"
								placeholder="0"
								className="bg-zinc-900 border-zinc-800 font-mono text-primary"
								value={formData.balance}
								onChange={handleChange}
							/>
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
							{initialData ? "Saqlash" : "Ro'yxatga olish"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
