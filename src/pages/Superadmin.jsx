import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/services/api/apiClient";

export default function AddTenant() {
	const [formData, setFormData] = useState({
		name: "",
		subdomain: "",
		adminPhone: "",
		adminPassword: "",
	});

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async e => {
		e.preventDefault();

		// Asosiy admin auth ma'lumotlari (kodingizdagi mantiq bo'yicha)
		const payload = {
			...formData,
			phone: "998905423747",
			password: "admin3747",
		};

		const res = await api.post("/superadmin", payload);

		if (res.ok) {
			alert("Tenant muvaffaqiyatli yaratildi!");
		} else {
			alert("Xatolik yuz berdi");
		}
	};

	return (
		<div className="flex justify-center p-10 bg-gray-50 min-h-screen">
			<Card className="w-full max-w-md shadow-md border-t-4 border-t-blue-600">
				<CardHeader>
					<CardTitle className="text-xl font-bold">
						Yangi Tashkilot Qo'shish
					</CardTitle>
					<p className="text-sm text-gray-500">
						Tashkilot va uning rahbarini ro'yxatga olish
					</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Tashkilot nomi</label>
							<Input
								name="name"
								onChange={handleChange}
								placeholder="Masalan: IT Academy"
								required
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Subdomain (slug)</label>
							<Input
								name="subdomain"
								onChange={handleChange}
								placeholder="it-academy"
								required
							/>
						</div>

						<div className="border-t my-4 pt-4">
							<h4 className="text-sm font-semibold mb-3 text-blue-700">
								Admin (CEO) ma'lumotlari
							</h4>
							<div className="space-y-2">
								<label className="text-sm font-medium">Admin ismi</label>
								<Input
									name="adminname"
									onChange={handleChange}
									placeholder="Ali valiyev"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Admin telefoni</label>
								<Input
									name="adminPhone"
									onChange={handleChange}
									placeholder="998901234567"
									required
								/>
							</div>
							<div className="space-y-2 mt-2">
								<label className="text-sm font-medium">Admin paroli</label>
								<Input
									type="password"
									name="adminPassword"
									onChange={handleChange}
									placeholder="******"
									required
								/>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white"
						>
							Yaratish va Saqlash
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
