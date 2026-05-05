import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";

// Shadcn UI komponentlari
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	LogOut,
	User,
	Phone,
	Globe,
	Calendar,
	KeyRound,
	ArrowLeft,
} from "lucide-react";
import PhoneUtils from "@/utils/phoneFormat";
import { useState } from "react";
import { PasswordChangeModal } from "@/components/PasswordChangeModal";

export default function Profile() {
	const { user, logout, changePassword } = useAuth();
	const { tenant } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	if (!user) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<div className="animate-pulse text-muted-foreground text-lg">
					Yuklanmoqda...
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl w-full mx-auto space-y-6 bg-background min-h-99 animate-in fade-in duration-200">
			{/* Ortga qaytish tugmasi */}
			<Button
				onClick={() => navigate(-1)}
				variant="ghost"
				className="group text-gray-400 hover:text-white hover:bg-white/10 transition-all"
			>
				<ArrowLeft className="group-hover:-translate-x-1 transition-transform h-4 w-4" />
				<span className="ml-2 hidden sm:inline">Ortga</span>
			</Button>

			<Card className="border-border/50 bg-card/50 backdrop-blur-xs">
				<CardHeader className="pb-8">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						{/* Avatar qismi */}
						<Avatar className="h-24 w-24 border-2 border-primary/20 shadow-xl">
							<AvatarImage src={user?.avatar_url} />
							<AvatarFallback className="bg-primary text-black text-3xl font-bold">
								{user.username?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>

						{/* Foydalanuvchi ismi va roli */}
						<div className="text-center sm:text-left space-y-1.5">
							<CardTitle className="text-3xl font-bold tracking-tight">
								{user.username}
							</CardTitle>
							<div className="flex flex-wrap justify-center sm:justify-start gap-2">
								<Badge
									variant="secondary"
									className="px-3 py-1 text-xs uppercase tracking-wider font-semibold"
								>
									{user.role}
								</Badge>
								<Badge
									variant="outline"
									className="text-xs text-muted-foreground font-normal"
								>
									ID: {user.id?.toString().slice(-6)}
								</Badge>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-8">
					{/* Account Information */}
					<div className="grid gap-6">
						<SectionTitle
							icon={<User className="h-4 w-4" />}
							title="Hisob ma'lumotlari"
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-6">
							<ProfileField
								label="Telefon"
								// value={PhoneUtils.formatPhone(user.phone) && undefined ? "Kiritilmagan" : "Kiritilmagan"}
								value={PhoneUtils.formatPhone(user.phone) || "Kiritilmagan"}
								icon={<Phone className="h-4 w-4" />}
							/>
							<ProfileField label="Roli" value={user.role ?? "Kiritilmagan"} />
						</div>
					</div>

					<Separator className="bg-border/50" />

					{/* Tenant Information */}
					<div className="grid gap-6">
						<SectionTitle
							icon={<Globe className="h-4 w-4" />}
							title="Tashkilot (Tenant)"
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-6">
							<ProfileField label="Tenant nomi" value={tenant || "—"} />
							<ProfileField
								label="Ro'yxatdan o'tgan sana"
								value={new Date(user.created_at).toLocaleDateString()}
								icon={<Calendar className="h-4 w-4" />}
							/>
						</div>
					</div>

					{/* Logout tugmasi */}
					<div className="flex justify-between">
						<div className="pt-4">
							<Button
								className="bg-linear-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black shadow-lg shadow-amber-500/25 gap-2 font-semibold"
								onClick={() => setIsModalOpen(true)}
							>
								<KeyRound className="h-4 w-4" /> Parolni almashtirish
							</Button>
						</div>
						<div className="pt-4">
							<Button
								variant="destructive"
								className="w-full sm:w-auto gap-2 shadow-lg shadow-destructive/20"
								onClick={handleLogout}
							>
								<LogOut className="h-4 w-4" /> Tizimdan chiqish
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			<PasswordChangeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				// onSubmit={async data => {
				// 	await changePassword(data);
				// }}
			/>
		</div>
	);
}

// Yordamchi komponentlar (Kichik bo'limlar uchun)
function SectionTitle({ icon, title }) {
	return (
		<div className="flex items-center gap-2 text-primary font-semibold">
			{icon}
			<span className="text-sm uppercase tracking-widest">{title}</span>
		</div>
	);
}

function ProfileField({ label, value, icon }) {
	return (
		<div className="space-y-1.5 group">
			<span className="text-xs text-muted-foreground block font-medium uppercase tracking-tighter">
				{label}
			</span>
			<div className="flex items-center gap-2 text-foreground font-medium bg-muted/30 p-2 rounded-md border border-transparent group-hover:border-border/50 transition-all">
				{icon && <span className="text-muted-foreground">{icon}</span>}
				<span>{value}</span>
			</div>
		</div>
	);
}
