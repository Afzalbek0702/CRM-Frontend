import { useState, useEffect, useCallback } from "react";
import { FaUser, FaPhone, FaComment, FaSave, FaPlus } from "react-icons/fa";
import { useCourse } from "../services/course/useCourse";

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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import PhoneUtils from "@/utils/phoneFormat";

const INITIAL_LEAD = {
	full_name: "",
	phone: "",
	source: "",
	interested_course: "",
	comment: "",
};

export default function LeadModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState(INITIAL_LEAD);
	const { courseData = [] } = useCourse();

	// Formani reset qilish mantiqi
	const resetForm = useCallback(() => {
		setFormData(initialData ? { ...initialData } : INITIAL_LEAD);
	}, [initialData]);

	useEffect(() => {
		if (isOpen) {
			resetForm();
		}
	}, [isOpen, resetForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	const handlePhoneChange = (e) => {
		const formatted = PhoneUtils.formatPhone(e.target.value);
		setFormData((prev) => ({ ...prev, phone: formatted }));
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

		// Telefon raqam validatsiyasi yoki boshqa tekshiruvlar shu yerda
		if (!formData.full_name.trim()) return;

		onSubmit({...formData,phone:PhoneUtils.cleanPhone(formData.phone)});
		onClose(); // Yuborilgandan so'ng modalni yopish
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-125 bg-zinc-950 border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold flex items-center gap-2">
						{initialData ? (
							<>
								<FaSave className="text-primary" /> Lidni tahrirlash
							</>
						) : (
							<>
								<FaPlus className="text-green-500" /> Yangi Lid qo'shish
							</>
						)}
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Mijoz ma'lumotlarini kiriting. Bu ma'lumotlar savdo bo'limi uchun
						muhim.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Ism familiya */}
						<div className="grid gap-2 col-span-2 md:col-span-1">
							<Label htmlFor="full_name" className="flex items-center gap-2">
								<FaUser className="text-[10px] text-zinc-500" /> Ism familiya
							</Label>
							<Input
								id="full_name"
								name="full_name"
								required
								placeholder="Ali Valiyev"
								className="bg-zinc-900 border-zinc-800 focus:border-primary"
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>

						{/* Telefon */}
						<div className="grid gap-2 col-span-2 md:col-span-1">
							<Label htmlFor="phone" className="flex items-center gap-2">
								<FaPhone className="text-[10px] text-zinc-500" /> Telefon
							</Label>
							<Input
								id="phone"
								name="phone"
								placeholder="+998 90 123 45 67"
								className="bg-zinc-900 border-zinc-800"
								value={formData.phone}
								onChange={handlePhoneChange}
								onKeyDown={handleKeyDown}
							/>
						</div>

						{/* Manba */}
						<div className="grid gap-2 col-span-2 md:col-span-1">
							<Label className="text-zinc-400 text-xs">Kelish manbasi</Label>
							<Input
								name="source"
								placeholder="Instagram, Telegram..."
								className="bg-zinc-900 border-zinc-800"
								value={formData.source}
								onChange={handleChange}
							/>
						</div>

						{/* Kurs */}
						<div className="grid gap-2 col-span-2 md:col-span-1">
							<Label className="text-zinc-400 text-xs">Qiziqgan kursi</Label>
							<Select
								value={formData.interested_course}
								onValueChange={(val) =>
									setFormData((p) => ({ ...p, interested_course: val }))
								}
							>
								<SelectTrigger className="w-full bg-zinc-900 border-zinc-800">
									<SelectValue placeholder="Kursni tanlang" />
								</SelectTrigger>
								<SelectContent className="bg-zinc-900 border-zinc-800">
									{courseData.map((course) => (
										<SelectItem key={course.id} value={String(course.name)}>
											{course.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Izoh */}
						<div className="grid gap-2 col-span-2">
							<Label className="flex items-center gap-2">
								<FaComment className="text-[10px] text-zinc-500" /> Qo'shimcha
								izoh
							</Label>
							<Textarea
								name="comment"
								placeholder="Mijoz haqida batafsil..."
								className="bg-zinc-900 border-zinc-800 min-h-25"
								value={formData.comment}
								onChange={handleChange}
							/>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-0 border-t border-zinc-800 pt-4">
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
							className="bg-primary hover:bg-primary text-black font-bold px-8"
						>
							{initialData ? "Saqlash" : "Yaratish"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
