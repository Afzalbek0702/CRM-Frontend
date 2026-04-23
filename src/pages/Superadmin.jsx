import { useState } from "react";
import { useNavigate } from "react-router-dom";
import phoneFormat from "../utils/phoneFormat";
import api from "../services/api/apiClient";

// Shadcn UI komponentlari
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, ShieldCheck, Globe } from "lucide-react";
import toast from "react-hot-toast";

function Superadmin() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		password: "",
		phone: "+(998)",
		name: "",
		subdomain: "",
		adminPhone: "+(998)",
		adminPassword: "",
	});

	const handleInputChange = e => {
		const { id, value } = e.target;
		setFormData(prev => ({
			...prev,
			[id]: id === "subdomain" ? value.toLowerCase() : value,
		}));
	};

	const handlePhoneChange = (e, field) => {
		setFormData(prev => ({
			...prev,
			[field]: phoneFormat.formatPhone(e.target.value),
		}));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const payload = {
				...formData,
				phone: phoneFormat.cleanPhone(formData.phone),
				adminPhone: phoneFormat.cleanPhone(formData.adminPhone),
			};
			await api.post("/superadmin", payload);
			toast.success("Muvaffaqiyatli yaratildi!");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-200 flex flex-col items-center justify-center">
			{/* Orqaga qaytish tugmasi */}
			<div className="w-full max-w-lg mb-4">
				<Button onClick={() => navigate(-1)} className="btn-default">
					<ArrowLeft className="h-4 w-4" /> Ortga qaytish
				</Button>
			</div>

			<Card className="w-full max-w-lg shadow-2xl border-primary/10 bg-card/50 backdrop-blur-xs">
				<CardHeader className="text-center space-y-1">
					<div className="flex justify-center mb-2">
						<img
							className="h-12 w-12 rounded-full border-2 border-primary"
							src="/logo.jpg"
							alt="Logo"
						/>
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight text-foreground">
						Data Space
					</CardTitle>
					<CardDescription>
						Yangi o'quv markazini tizimga qo'shish
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Markaziy Ma'lumotlar */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-semibold text-primary">
								<Building2 className="h-4 w-4" /> Markaziy sozlamalar
							</div>
							<div className="grid grid-cols-1 gap-4">
								<div className="space-y-2">
									<Label htmlFor="phone">Markaz telefon raqami</Label>
									<Input
										id="phone"
										value={formData.phone}
										onChange={e => handlePhoneChange(e, "phone")}
										className="bg-background/50 focus-visible:ring-primary"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Tizimga kirish paroli</Label>
									<Input
										id="password"
										type="password"
										value={formData.password}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						<Separator className="bg-border/40" />

						{/* Admin Ma'lumotlari */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-semibold text-primary">
								<ShieldCheck className="h-4 w-4" /> Admin hisobi
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2 col-span-2 sm:col-span-1">
									<Label htmlFor="adminPhone">Admin telefoni</Label>
									<Input
										id="adminPhone"
										value={formData.adminPhone}
										onChange={e => handlePhoneChange(e, "adminPhone")}
									/>
								</div>
								<div className="space-y-2 col-span-2 sm:col-span-1">
									<Label htmlFor="adminPassword">Admin paroli</Label>
									<Input
										id="adminPassword"
										type="password"
										value={formData.adminPassword}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						<Separator className="bg-border/40" />

						{/* Brending */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm font-semibold text-primary">
								<Globe className="h-4 w-4" /> Identifikatsiya
							</div>
							<div className="space-y-2">
								<Label htmlFor="name">O'quv markaz nomi</Label>
								<Input
									id="name"
									placeholder="Alpha Education"
									value={formData.name}
									onChange={handleInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="subdomain">Subdomain</Label>
								<div className="flex items-center gap-2">
									<Input
										id="subdomain"
										placeholder="alpha"
										value={formData.subdomain}
										onChange={handleInputChange}
									/>
									<span className="text-muted-foreground font-medium">
										.dataspace.uz
									</span>
								</div>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg shadow-lg shadow-primary/20"
						>
							O'quv markazni yaratish
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default Superadmin;
