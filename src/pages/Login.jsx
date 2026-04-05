import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Loader2,
	LockKeyhole,
	Eye,
	EyeOff,
	Phone,
	ShieldCheck,
	Sparkles,
	ArrowRight,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";
import PhoneUtils from "../utils/phoneFormat";
import { Separator } from "@/components/ui/separator";

export default function Login() {
	const [form, setForm] = useState({ password: "", phone: "+(998) " });
	const [showPwd, setShowPwd] = useState(false);
	const [errors, setErrors] = useState({});
	const { login, loading, error: authError } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (errors.phone || errors.password) setErrors({});
	}, [form.phone, form.password]);
	useEffect(() => {
		if (authError)
			toast.error(authError, {
				icon: <AlertCircle className="text-red-400" />,
				duration: 4000,
			});
	}, [authError]);

	const validate = () => {
		const e = {};
		if (PhoneUtils.cleanPhone(form.phone).length < 12)
			e.phone = "To'g'ri telefon raqam kiriting";
		if (form.password.length < 4)
			e.password = "Parol kamida 4 ta belgidan iborat bo'lishi kerak";
		setErrors(e);
		return !Object.keys(e).length;
	};

	const submit = async (e) => {
		e.preventDefault();
		if (!validate())
			return toast.error("Ma'lumotlarni to'g'ri to'ldiring", {
				icon: <AlertCircle className="text-amber-400" />,
			});
		try {
			const data = await login({
				phone: PhoneUtils.cleanPhone(form.phone),
				password: form.password,
			});
			if (data?.tenant) {
				toast.success("Xush kelibsiz! 🎉", {
					icon: <CheckCircle2 className="text-emerald-400" />,
				});
				navigate(
					`/${data.tenant}/${data?.user?.role === "TEACHER" ? "groups" : "dashboard"}`,
				);
			}
		} catch (err) {
			console.error("Login hatoligi:", err);
		}
	};

	const phoneValid = PhoneUtils.cleanPhone(form.phone).length >= 12;
	const pwdValid = form.password.length >= 4;

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-background p-4">
			{/* Simplified background */}
			<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>

			<div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
				<Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-[#1f1f1f]/95 to-[#161616]/95 backdrop-blur-xl shadow-2xl">
					<CardHeader className="space-y-4 text-center pb-6">
						<div className="relative mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 to-blue-400/20 p-4 border border-white/10">
							<LockKeyhole className="h-8 w-8 text-amber-400" />
						</div>
						<div>
							<CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
								Data Space
							</CardTitle>
							<CardDescription className="text-gray-400">
								Tizimga kirish uchun ma'lumotlaringizni kiriting
							</CardDescription>
						</div>
						<div className="flex justify-center gap-4">
							<div className="flex items-center gap-1 text-xs text-gray-400">
								<ShieldCheck className="w-3 h-3 text-emerald-400" />
								Xavfsiz
							</div>
							<div className="flex items-center gap-1 text-xs text-gray-400">
								<Sparkles className="w-3 h-3 text-amber-400" />
								Tezkor
							</div>
						</div>
					</CardHeader>

					<CardContent className="pt-2">
						<form onSubmit={submit} className="grid gap-5">
							{/* Phone */}
							<div className="grid gap-2">
								<Label
									htmlFor="phone"
									className="text-sm text-gray-300 flex items-center gap-2"
								>
									<Phone className="w-4 h-4 text-amber-400/70" />
									Telefon raqam
								</Label>
								<div className="relative">
									<Input
										id="phone"
										type="tel"
										value={form.phone}
										onChange={(e) =>
											setForm({
												...form,
												phone: PhoneUtils.formatPhone(e.target.value),
											})
										}
										onKeyDown={(e) => {
											if (e.key === "Backspace" && e.target.value.length <= 4)
												e.preventDefault();
										}}
										placeholder="+998 __ ___ __ __"
										className={`pl-11 bg-white/5 border-white/10 text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 ${errors.phone ? "border-red-400/50" : ""}`}
									/>
									<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
									{form.phone.length > 4 &&
										(phoneValid ? (
											<CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
										) : (
											<div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500" />
										))}
								</div>
								{errors.phone && (
									<p className="text-xs text-red-400 flex items-center gap-1">
										<AlertCircle className="w-3 h-3" />
										{errors.phone}
									</p>
								)}
							</div>

							{/* Password */}
							<div className="grid gap-2">
								<Label
									htmlFor="password"
									className="text-sm text-gray-300 flex items-center gap-2"
								>
									<LockKeyhole className="w-4 h-4 text-amber-400/70" />
									Parol
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPwd ? "text" : "password"}
										value={form.password}
										onChange={(e) =>
											setForm({ ...form, password: e.target.value })
										}
										placeholder="••••••••"
										className={`pl-11 pr-11 bg-white/5 border-white/10 text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 ${errors.password ? "border-red-400/50" : ""}`}
									/>
									<LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => setShowPwd(!showPwd)}
										className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-amber-400"
									>
										{showPwd ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</Button>
									{form.password.length > 0 &&
										(pwdValid ? (
											<CheckCircle2 className="absolute right-11 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
										) : (
											<div className="absolute right-11 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500" />
										))}
								</div>
								{errors.password && (
									<p className="text-xs text-red-400 flex items-center gap-1">
										<AlertCircle className="w-3 h-3" />
										{errors.password}
									</p>
								)}
							</div>

							<div className="text-right">
								<button
									type="button"
									className="text-xs text-amber-400 hover:text-amber-300"
									onClick={() =>
										toast.info("Parolni tiklash tez orada qo'shiladi!")
									}
								>
									Parolni unutdingizmi?
								</button>
							</div>

							<Button
								type="submit"
								disabled={loading || !phoneValid || !pwdValid}
								className="w-full h-12 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black font-semibold shadow-lg shadow-amber-500/25 disabled:opacity-50"
							>
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Kirilmoqda...
									</>
								) : (
									<>
										<span className="flex items-center gap-2">
											Tizimga kirish
											<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
										</span>
									</>
								)}
							</Button>
						</form>
					</CardContent>

					<CardFooter className="flex flex-col gap-4 pb-6 pt-2">
						<Separator className="bg-white/10" />
						<p className="text-xs text-center text-gray-500">
							Tizimga kirish orqali siz{" "}
							<button className="text-amber-400 hover:text-amber-300 underline">
								Maxfiylik siyosati
							</button>{" "}
							bilan tanishgan bo'lasiz
						</p>
						<p className="text-xs text-center text-gray-500">
							Demo hisob:{" "}
							<code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-400 font-mono">
								+998 90 123 45 67
							</code>
						</p>
					</CardFooter>
				</Card>
				<p className="text-center text-xs text-gray-500 mt-6">
					© {new Date().getFullYear()} Data Space • Barcha huquqlar himoyalangan
				</p>
			</div>
		</div>
	);
}
