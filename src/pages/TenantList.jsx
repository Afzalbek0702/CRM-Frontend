import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users2, Activity, CreditCard, ArrowUpRight, Building2, Bell, Search } from "lucide-react";
import CreateAdminModal from "@/components/CreateAdminModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
export default function TenantList() {
	return (
		<div className="space-y-8 p-10">
			<header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
				<div className="relative w-96">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Qidiruv..."
						className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
					/>
				</div>

				<div className="flex items-center gap-4">
					{/* <Button variant="ghost" size="icon" className="rounded-full relative">
						<Bell className="w-5 h-5 text-muted-foreground" />
						<span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
					</Button> */}
					<div className="flex items-center gap-3 pl-4 border-l border-border">
						<div className="text-right hidden sm:block">
							<p className="text-sm font-semibold leading-none"></p>
							<p className="text-xs text-muted-foreground mt-1">Superadmin</p>
						</div>
						<Avatar className="h-9 w-9 border-2 border-primary/20">
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>AD</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</header>
			{/* Statistika Kartalari */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Jami Markazlar"
					value="0"
					icon={Building2}
					trend="+12%"
					color="text-blue-500"
				/>
				<StatsCard
					title="Faol Talabalar"
					value="0"
					icon={Users2}
					trend="+5.2%"
					color="text-green-500"
				/>
				<StatsCard
					title="Oylik Tushum"
					value="0"
					icon={CreditCard}
					trend="+18%"
					color="text-orange-500"
				/>
				<StatsCard
					title="Tizim Yuklamasi"
					value="0"
					icon={Activity}
					trend="Stabil"
					color="text-purple-500"
				/>
			</div>

			{/* Ro'yxat Jadvali */}
			<Card className="border-none shadow-xl shadow-primary/5 bg-card/60 backdrop-blur-sm">
				<CardHeader className="flex flex-row items-center justify-between pb-7">
					<div>
						<CardTitle className="text-2xl font-bold">
							O'quv markazlari
						</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							Barcha tenantlar holatini boshqarish
						</p>
					</div>
					<Button className="rounded-xl shadow-lg shadow-primary/25 px-6">
						<CreateAdminModal />
					</Button>
				</CardHeader>
				<CardContent>
					<div className="relative overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-border text-muted-foreground text-sm uppercase tracking-wider">
									<th className="pb-4 font-semibold px-2">Markaz nomi</th>
									<th className="pb-4 font-semibold">Subdomain</th>
									<th className="pb-4 font-semibold">Admin Tel</th>
									<th className="pb-4 font-semibold">Sana</th>
									<th className="pb-4 font-semibold">Holati</th>
									<th className="pb-4 font-semibold text-right">Amallar</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{/* {[1, 2, 3, 4, 5].map(i => (
									<tr
										key={i}
										className="group hover:bg-muted/30 transition-colors"
									>
										<td className="py-4 px-2">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
													A
												</div>
												<span className="font-semibold">Alpha Education</span>
											</div>
										</td>
										<td className="py-4 font-mono text-sm">
											alpha.dataspace.uz
										</td>
										<td className="py-4 text-muted-foreground">
											+998 90 123 45 67
										</td>
										<td className="py-4 text-muted-foreground">12.04.2024</td>
										<td className="py-4">
											<Badge className="bg-emerald-500/10 text-emerald-600 border-none hover:bg-emerald-500/20">
												Active
											</Badge>
										</td>
										<td className="py-4 text-right">
											<Button
												variant="ghost"
												size="sm"
												className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
											>
												Batafsil <ArrowUpRight className="ml-2 w-4 h-4" />
											</Button>
										</td>
									</tr>
								))} */}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StatsCard({ title, value, icon: Icon, trend, color }) {
	return (
		<Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 group">
			<CardContent className="p-6">
				<div className="flex justify-between items-start">
					<div
						className={`p-3 rounded-2xl bg-muted group-hover:scale-110 transition-transform duration-300`}
					>
						<Icon className={`w-6 h-6 ${color}`} />
					</div>
					<Badge
						variant="outline"
						className="text-xs font-medium border-primary/20 text-primary"
					>
						{trend}
					</Badge>
				</div>
				<div className="mt-4">
					<h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
					<p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
				</div>
			</CardContent>
		</Card>
	);
}
