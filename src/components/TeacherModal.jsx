import { useState, useEffect, useCallback } from "react";
import {
	FaUser,
	FaPhone,
	FaSave,
	FaPlus,
	FaDollarSign,
	FaBirthdayCake,
	FaLock,
	FaBriefcase,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetFooter,
} from "@/components/ui/sheet"; // Side panel uchun Sheet qulayroq
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import PhoneUtils from "@/utils/phoneFormat";

const INITIAL_STATE = {
	full_name: "",
	phone: "",
	password: "",
	birthday: "",
	salary: "",
	salary_type: "sum",
	position: "O'qituvchi",
};

export default function TeacherModal({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}) {
	const [formData, setFormData] = useState(INITIAL_STATE);

	const resetForm = useCallback(() => {
		if (initialData) {
			setFormData({
				...initialData,
				password: "", // Xavfsizlik uchun parolni bo'sh qoldiramiz
				birthday: initialData.birthday
					? String(initialData.birthday).split("T")[0]
					: "",
				salary: initialData.salary || "",
			});
		} else {
			setFormData(INITIAL_STATE);
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
	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			...formData,
         salary: Number(formData.salary || 0),
         phone: PhoneUtils.cleanPhone(formData.phone),
		};

		// Tahrirlashda parol yozilmagan bo'lsa, uni yubormaymiz
		if (initialData && !formData.password) {
			delete payload.password;
		}

		onSubmit(payload);
		onClose();
	};

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 text-white overflow-y-auto">
				<SheetHeader className="space-y-2">
					<SheetTitle className="text-2xl font-bold flex items-center gap-2">
						{initialData ? (
							<>
								<FaSave className="text-primary" /> Tahrirlash
							</>
						) : (
							<>
								<FaPlus className="text-green-500" /> Yangi o'qituvchi
							</>
						)}
					</SheetTitle>
					<SheetDescription className="text-zinc-400">
						{initialData
							? "O'qituvchi ma'lumotlarini yangilang."
							: "Tizimga yangi o'qituvchi qo'shing."}
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-6">
					<div className="grid gap-4">
						{/* Ism familiya */}
						<div className="grid gap-2">
							<Label className="flex items-center gap-2 text-zinc-300">
								<FaUser className="text-[10px]" /> To'liq ism familiya
							</Label>
							<Input
								name="full_name"
								required
								className="bg-zinc-900 border-zinc-800"
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>

						{/* Telefon va Tug'ilgan kun */}
						<div className="grid grid-cols-2 gap-3">
							<div className="grid gap-2">
								<Label className="flex items-center gap-2 text-zinc-300">
									<FaPhone className="text-[10px]" /> Telefon
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
							<div className="grid gap-2">
								<Label className="flex items-center gap-2 text-zinc-300">
									<FaBirthdayCake className="text-[10px]" /> Tug'ilgan kun
								</Label>
								<Input
									name="birthday"
									type="date"
									className="bg-zinc-900 border-zinc-800 text-zinc-400"
									value={formData.birthday}
									onChange={handleChange}
								/>
							</div>
						</div>

						{/* Parol */}
						<div className="grid gap-2">
							<Label className="flex items-center gap-2 text-zinc-300">
								<FaLock className="text-[10px]" /> Parol{" "}
								{!initialData && <span className="text-red-500">*</span>}
							</Label>
							<Input
								name="password"
								type="password"
								autoComplete="new-password"
								placeholder={
									initialData ? "O'zgartirish uchun yozing..." : "*******"
								}
								required={!initialData}
								className="bg-zinc-900 border-zinc-800"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						{/* Maosh va Turi */}
						<div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50">
							<div className="grid gap-2">
								<Label className="flex items-center gap-2 text-zinc-300">
									<FaDollarSign className="text-[10px]" /> Maosh
								</Label>
								<Input
									name="salary"
									type="number"
									className="bg-zinc-900 border-zinc-800 font-mono"
									value={formData.salary}
									onChange={handleChange}
								/>
							</div>
							<div className="grid gap-2">
								<Label className="text-zinc-300 text-[12px]">Turi</Label>
								<Select
									value={formData.salary_type}
									onValueChange={(val) =>
										setFormData((p) => ({ ...p, salary_type: val }))
									}
								>
									<SelectTrigger className="bg-zinc-900 border-zinc-800">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
										<SelectItem value="sum">So'm (fiks)</SelectItem>
										<SelectItem value="percent">Foiz (%)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Lavozim */}
						<div className="grid gap-2">
							<Label className="flex items-center gap-2 text-zinc-300">
								<FaBriefcase className="text-[10px]" /> Lavozim
							</Label>
							<Select
								value={formData.position}
								onValueChange={(val) =>
									setFormData((p) => ({ ...p, position: val }))
								}
							>
								<SelectTrigger className="bg-zinc-900 border-zinc-800">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800 text-white">
									<SelectItem value="O'qituvchi">O'qituvchi</SelectItem>
									<SelectItem value="Manager">Manager</SelectItem>
									<SelectItem value="Admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<SheetFooter className="flex-col sm:flex-row gap-2 pt-6">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="w-full border-zinc-800 text-zinc-400 hover:text-white"
						>
							Bekor qilish
						</Button>
						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
						>
							{initialData ? "Saqlash" : "Yaratish"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
