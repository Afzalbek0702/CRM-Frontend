import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import toast from "react-hot-toast";

export function PasswordChangeModal({ isOpen, onClose }) {
	const [password, setPassword] = useState({ old: "", new: "" });
	const { changePassword } = useAuth();

	const Submit = async e => {
		e.preventDefault(); // Sahifa yangilanib ketishini to'xtatish

		// 1. Validatsiya: Yangi parol uzunligini tekshirish
		// Eslatma: 'new' o'rniga 'newPass' kabi nom ishlatish tavsiya etiladi
		if (password.new.length < 6) {
			return toast.error(
				"Parol uzunligi kamida 6 ta belgidan iborat bo'lishi kerak",
			);
		}

		// 2. Validatsiya: Eski va yangi parol bir xil emasligini tekshirish (ixtiyoriy lekin foydali)
		if (password.old === password.new) {
			return toast.error("Yangi parol eski paroldan farq qilishi kerak");
		}

		try {
			// So'rov yuborish davrida tugmani bloklab qo'yish (loading holati) tavsiya etiladi
			await changePassword({
				oldPassword: password.old,
				newPassword: password.new,
			});

			// Muvaffaqiyatli yakunlanganda
			toast.success("Parol muvaffaqiyatli o'zgartirildi");
			onClose(); // Modalni yopish
		} catch (error) {
			// Backend'dan kelayotgan aniq xabarni ko'rsatish (agar mavjud bo'lsa)
			const message =
				error.response?.data?.message || "Parolni o'zgartirib bo'lmadi";
			toast.error(message);
			console.error("Change password error:", error);
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Parolni Almashtirish</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<form className="space-y-6 py-2" onSubmit={Submit}>
					<div>
						<Label htmlFor="pass-1" className={"mb-2"}>
							Eski Parol
						</Label>
						<Input
							id="pass-1"
							name="oldPassword"
							onChange={e =>
								setPassword({
									...password,
									old: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<Label htmlFor="pass-1" className={"mb-2"}>
							Yangi Parol
						</Label>
						<Input
							id="pass-1"
							name="newPassword"
							onChange={e =>
								setPassword({
									...password,
									new: e.target.value,
								})
							}
						/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Bekor qilish</Button>
						</DialogClose>
						<Button type="submit">Saqlash</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
