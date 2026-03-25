import { useState, useEffect, useCallback } from "react";
import {
	FaUser,
	FaPhone,
	FaSave,
	FaDollarSign,
	FaBriefcase,
	FaBirthdayCake,
	FaLock,
	FaShieldAlt,
} from "react-icons/fa";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import PhoneUtils from "@/utils/phoneFormat";

const INITIAL_WORKER = {
	full_name: "",
	phone: "",
	password: "",
	salary: "",
	birthday: "",
	position: "",
	role: "",
	salary_type: "CASH",
};

export default function WorkerModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}) {
	const [formData, setFormData] = useState(INITIAL_WORKER);
	const [date, setDate] = useState();

	const resetForm = useCallback(() => {
		if (initialData) {
			const bday = initialData.birthday
				? String(initialData.birthday).split("T")[0]
				: "";
			setFormData({
				...initialData,
				password: "",
				birthday: bday,
			});
			setDate(bday ? new Date(bday) : undefined);
		} else {
			setFormData(INITIAL_WORKER);
			setDate(undefined);
		}
	}, [initialData]);

	useEffect(() => {
		if (isOpen) resetForm();
	}, [isOpen, resetForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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
	const handleSubmit = async (e) => {
		e.preventDefault();
		const payload = {
			...formData,
			role: formData.role.toUpperCase(),
			salary_type: formData.salary_type.toUpperCase(),
         salary: Number(formData.salary || 0),
         phone: PhoneUtils.cleanPhone(formData.phone),
		};

		// Edit paytida parol kiritilmagan bo'lsa payload'dan olib tashlaymiz
		if (initialData && !formData.password) delete payload.password;

		await onSubmit(payload);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-[95vw] sm:max-w-2xl bg-zinc-950 border-zinc-800 text-white overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold flex items-center gap-2">
						<div className="p-2 bg-yellow-600/20 rounded-lg text-primary text-sm">
							{initialData ? <FaSave /> : <FaBriefcase />}
						</div>
						{initialData ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* Asosiy ma'lumotlar */}
						<div className="sm:col-span-2 space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaUser className="text-[10px]" /> To'liq ism familiyasi
							</Label>
							<Input
								name="full_name"
								required
								className="bg-zinc-900 border-zinc-800"
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaPhone className="text-[10px]" /> Telefon raqami
							</Label>
							<Input
								name="phone"
								required
								className="bg-zinc-900 border-zinc-800"
								value={formData.phone}
								onChange={handlePhoneChange}
								onKeyDown={handleKeyDown}
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaBirthdayCake className="text-[10px]" /> Tug'ilgan sana
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800",
											!date && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4 text-primary" />
										{date ? format(date, "dd-MM-yyyy") : "Sanani tanlang"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800 text-white">
									<Calendar
										mode="single"
										selected={date}
										onSelect={(d) => {
											setDate(d);
											setFormData((p) => ({
												...p,
												birthday: d ? format(d, "yyyy-MM-dd") : "",
											}));
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Ish ma'lumotlari bo'limi */}
						<div className="sm:col-span-2 h-px bg-zinc-800 my-2" />

						<div className="space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaBriefcase className="text-[10px]" /> Lavozimi (Position)
							</Label>
							<Input
								name="position"
								placeholder="Masalan: Frontend Developer"
								className="bg-zinc-900 border-zinc-800"
								value={formData.position}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaShieldAlt className="text-[10px]" /> Tizimdagi roli (Role)
							</Label>
							<Select
								value={formData.role}
								onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}
							>
								<SelectTrigger className="bg-zinc-900 border-zinc-800">
									<SelectValue placeholder="Tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									<SelectItem value="ADMIN">Administrator</SelectItem>
									<SelectItem value="MANAGER">Manager</SelectItem>
									<SelectItem value="TEACHER">O'qituvchi</SelectItem>
									<SelectItem value="CEO">CEO</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaDollarSign className="text-[10px]" /> Maosh miqdori
							</Label>
							<Input
								type="number"
								name="salary"
								className="bg-zinc-900 border-zinc-800 font-mono text-primary"
								value={formData.salary}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-zinc-400 text-[12px]">To'lov turi</Label>
							<Select
								value={formData.salary_type}
								onValueChange={(v) =>
									setFormData((p) => ({ ...p, salary_type: v }))
								}
							>
								<SelectTrigger className="bg-zinc-900 border-zinc-800">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									<SelectItem value="CASH">Naqd pul</SelectItem>
									<SelectItem value="BANK_TRANSFER">Bank o'tkazmasi</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Parol (Faqat yangi xodim uchun yoki ixtiyoriy tahrirlash uchun) */}
						<div className="sm:col-span-2 space-y-2">
							<Label className="text-zinc-400 flex items-center gap-2">
								<FaLock className="text-[10px]" /> Tizim paroli
								{initialData && (
									<span className="text-[10px] text-zinc-500">
										(faqat o'zgartirish uchun yozing)
									</span>
								)}
							</Label>
							<Input
								type="password"
								name="password"
								autoComplete="new-password"
								placeholder="*******"
								required={!initialData}
								className="bg-zinc-900 border-zinc-800"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-0 border-t border-zinc-800 pt-6">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							className="text-zinc-400"
						>
							Bekor qilish
						</Button>
						<Button
							type="submit"
							className="bg-primary hover:bg-primary/90 text-black font-bold px-10"
						>
							{initialData ? "Saqlash" : "Yaratish"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
