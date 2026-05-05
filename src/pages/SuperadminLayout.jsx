import { Link, Outlet, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Building2,
	Users,
	Settings,
	LogOut,
	Search,
	Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
	{ icon: LayoutDashboard, label: "Dashboard", path: "/superadmin" },
	{ icon: Building2, label: "O'quv markazlari", path: "/superadmin/tenants" },
	{ icon: Users, label: "Foydalanuvchilar", path: "/superadmin/users" },
	{ icon: Settings, label: "Tizim sozlamalari", path: "/superadmin/settings" },
];

export default function SuperadminLayout() {
	const location = useLocation();

	return (
		<div className="flex h-screen bg-background font-sans">
			{/* Sidebar */}
			<aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
				<div className="p-6 flex items-center gap-3">
					<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
						<span className="text-primary-foreground font-bold">DS</span>
					</div>
					<span className="text-xl font-bold tracking-tight text-sidebar-foreground">
						Data Space
					</span>
				</div>

				<nav className="flex-1 px-4 space-y-1">
					{menuItems.map(item => {
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
									isActive
										? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
										: "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
								}`}
							>
								<item.icon
									className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-primary"}`}
								/>
								<span className="font-medium">{item.label}</span>
							</Link>
						);
					})}
				</nav>

				<div className="p-4 border-t border-sidebar-border">
					<Button
						variant="ghost"
						className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
					>
						<LogOut className="w-5 h-5" />
						Logout
					</Button>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
					<div className="relative w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Qidiruv..."
							className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
						/>
					</div>

					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full relative"
						>
							<Bell className="w-5 h-5 text-muted-foreground" />
							<span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
						</Button>
						<div className="flex items-center gap-3 pl-4 border-l border-border">
							<div className="text-right hidden sm:block">
								<p className="text-sm font-semibold leading-none">
									Adminov Ali
								</p>
								<p className="text-xs text-muted-foreground mt-1">Superadmin</p>
							</div>
							<Avatar className="h-9 w-9 border-2 border-primary/20">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>AD</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				{/* Dynamic Page Content */}
				<main className="flex-1 overflow-y-auto p-8 bg-background/50">
					<div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
