import { Card, CardContent } from "@/components/ui/card.jsx";
import { COLORS, SOURCE_COLORS } from "./config.js";
import { ArchiveIcon, TrendingUp } from "lucide-react";
import { Button } from "@base-ui/react";
import { Badge } from "@/components/ui/badge.jsx";
import { FaSearch } from "react-icons/fa";

export const StatsCard = ({ icon, label, value, trend, color }) => (
	<Card
		className={`bg-linear-to-br ${COLORS[color]} border backdrop-blur-xl hover:scale-[1.02] transition-all`}
	>
		<CardContent className="p-4 flex items-center gap-4">
			<div
				className={`p-3 rounded-xl bg-white/10 border border-white/20 ${COLORS[color].split(" ").pop()}`}
			>
				{icon}
			</div>
			<div>
				<p className="text-xs text-gray-400 uppercase">{label}</p>
				<p className="text-2xl font-bold text-white">{value}</p>
				{trend !== undefined && (
					<p
						className={`text-xs flex items-center gap-1 ${trend > 0 ? "text-emerald-400" : "text-red-400"}`}
					>
						<TrendingUp
							className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`}
						/>
						{Math.abs(trend)}%
					</p>
				)}
			</div>
		</CardContent>
	</Card>
);

export const DayPill = ({ day, active }) => (
	<span
		className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${active ? "bg-linear-to-r from-amber-400 to-orange-400 text-black shadow-lg" : "bg-white/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20"}`}
	>
		{day}
	</span>
);

export const EmptyState = ({ config, hasSearch }) => {
	const IconComponent = config.icon;
	return (
		<div className="flex flex-col items-center justify-center text-center py-8 px-4">
			<div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
				{hasSearch ? (
					<FaSearch className="w-8 h-8" />
				) : (
					<IconComponent className={`h-8 w-8 ${config.iconClass}`} />
				)}
			</div>
			<h3 className="text-lg font-semibold text-white mb-2">
				{hasSearch ? "Natija topilmadi" : config.empty}
			</h3>
			<p className="text-gray-500 text-sm max-w-sm mb-6">
				{hasSearch
					? "Qidiruv so'zingizni o'zgartirib ko'ring yoki filtrlarni tozalang."
					: "Ushbu kategoriyada hozircha hech qanday ma'lumot mavjud emas."}
			</p>
			{!hasSearch && (
				<Button
					variant="outline"
					className="border-white/20 text-gray-400 flex"
				>
					<ArchiveIcon className="mr-2 w-4 h-4" />
					Boshqa arxivlarni ko'rish
				</Button>
			)}
		</div>
	);
};

export const SourceBadge = ({ source }) => (
	<Badge
		variant="outline"
		className={`border ${SOURCE_COLORS[source] || "border-gray-500/30 text-gray-400 bg-gray-500/10"}`}
	>
		{source || "—"}
	</Badge>
);
