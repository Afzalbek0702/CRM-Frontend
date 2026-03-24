import { useState } from "react";
import { useNavigate } from "react-router-dom";
import phoneFormat from "../utils/phoneFormat";
import { useAuth } from "../context/authContext";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LockKeyhole } from "lucide-react";
import PhoneUtils from "../utils/phoneFormat";

const Login = () => {
	const [formData, setFormData] = useState({ password: "", phone: "+(998)" });
	const { login, loading } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await login({
				phone: PhoneUtils.cleanPhone(formData.phone),
				password: formData.password,
			});
			if (data?.tenant) {
				navigate(`/${data.tenant}/dashboard`);
			}
		} catch (err) {
			console.error("Login hatoligi:", err);
		}
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

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4 space-y-6 animate-in fade-in duration-500">
			<Card className="w-full max-w-md border-border/60 shadow-lg">
				<CardHeader className="space-y-2 text-center">
					<div className="flex justify-center mb-2">
						<div className="rounded-full bg-primary/10 p-3">
							<LockKeyhole className="h-6 w-6 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight">
						Data Space
					</CardTitle>
					<CardDescription>
						Tizimga kirish uchun ma'lumotlaringizni kiriting
					</CardDescription>
				</CardHeader>

				<CardContent className={"mt-3"}>
					<form onSubmit={handleSubmit} className="grid gap-6">
						<div className="grid gap-4">
							{/* Telefon raqam */}
							<div className="grid gap-2">
								<Label htmlFor="phone">Telefon raqam</Label>
								<Input
									id="phone"
									type="tel"
									value={formData.phone}
									onChange={handlePhoneChange}
									onKeyDown={handleKeyDown}
									placeholder="+998 __-___-__-__"
									className="bg-muted/50 focus:bg-background transition-colors"
									required
								/>
							</div>

							{/* Parol */}
							<div className="grid gap-2 mt-3">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Parol</Label>
								</div>
								<Input
									id="password"
									type="password"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									placeholder="********"
									className="bg-muted/50 focus:bg-background transition-colors"
									required
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="btn-default w-full font-semibold shadow-md active:scale-[0.98] transition-transform"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Kirilmoqda...
								</>
							) : (
								"Tizimga kirish"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
