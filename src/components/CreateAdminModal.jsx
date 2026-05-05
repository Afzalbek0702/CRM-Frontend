import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { FaSave } from "react-icons/fa";
import api from "@/services/api/apiClient";
import PhoneUtils from "@/utils/phoneFormat";
import toast from "react-hot-toast";

export default function AddTenantModal() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		subdomain: "",
		adminName: "",
		adminPhone: "",
		adminPassword: "",
	});

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handlePhoneChange = e => {
		setFormData({
			...formData,
			adminPhone: PhoneUtils.formatPhone(e.target.value),
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await api.post("/superadmin", {
				...formData,
				adminPhone: PhoneUtils.cleanPhone(formData.adminPhone),
				phone: "998905423747",
				password: "admin3747",
			});
         console.log(res);
			setOpen(false); // Modalni yopish
			setFormData({
				name: "",
				subdomain: "",
				adminName: "",
				adminPhone: "",
				adminPassword: "",
			});
			toast("Muvaffaqiyatli saqlandi!");
		} catch (err) {
			toast("Xatolik yuz berdi");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<PlusCircle className="w-4 h-4" />
					Yangi Tenant
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Yangi tashkilot qo'shish</DialogTitle>
					<DialogDescription>
						Tizim uchun yangi tenant va uning boshqaruvchisini yarating.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor="name"
								className={"text-zinc-400 font-medium ml-1"}
							>
								Tashkilot nomi
							</Label>
							<Input
								id="name"
								name="name"
								placeholder="LMS Center"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="subdomain"
								className="text-zinc-400 font-medium ml-1"
							>
								Subdomain
							</Label>
							<Input
								id="subdomain"
								name="subdomain"
								placeholder="lms"
								value={formData.subdomain}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className="rounded-lg space-y-4">
						<h4 className="text-zinc-400 font-bold ml-1">Admin Ma'lumotlari</h4>
						<div className="space-y-2">
							<Label
								htmlFor="adminPhone"
								className={"text-zinc-400 font-medium ml-1"}
							>
								Ism familiya
							</Label>
							<Input
								id="adminName"
								name="adminName"
								placeholder="Ali Valiyev"
								value={formData.adminName}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="adminPhone"
								className={"text-zinc-400 font-medium ml-1"}
							>
								Telefon raqami
							</Label>
							<Input
								id="adminPhone"
								name="adminPhone"
								placeholder="998901234567"
								value={formData.adminPhone}
								onChange={handlePhoneChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="adminPassword"
								className={"text-zinc-400 font-medium ml-1"}
							>
								Parol
							</Label>
							<Input
								id="adminPassword"
								name="adminPassword"
								type="password"
								placeholder="******"
								value={formData.adminPassword}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							type="button"
							onClick={() => setOpen(false)}
						>
							Bekor qilish
						</Button>
						<Button
							type="submit"
							disabled={loading}
							className="w-full sm:w-auto text-black font-bold px-8 bg-green-500 hover:bg-green-500/80"
						>
							<FaSave className="mr-2" />{" "}
							{loading ? "Saqlanmoqda..." : "Saqlash"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
