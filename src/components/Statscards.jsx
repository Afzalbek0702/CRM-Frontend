// import { useCountUp } from "../hooks/useCountUp";
// import {
// 	TrendingUp,
// 	TrendingDown,
// 	Users,
// 	Wallet,
// 	UserMinus,
// 	Layers,
// } from "lucide-react";

// export default function StatsCards({ data, type, percentage, trend }) {
// 	const numericData = typeof data === "number" ? data : 0;
// 	const count = useCountUp(numericData, 2000, 0);

// 	// Ikonkalarni turiga qarab tanlash
// 	const getIcon = () => {
// 		switch (type) {
// 			case "Oylik Tushum":
// 				return <Wallet className="text-amber-500" />;
// 			case "O'quvchilar":
// 				return <Users className="text-blue-500" />;
// 			case "Qarzdorlar":
// 				return <UserMinus className="text-red-500" />;
// 			case "Guruhlar":
// 				return <Layers className="text-purple-500" />;
// 			default:
// 				return null;
// 		}
// 	};

// 	return (
// 		<div className="group relative overflow-hidden p-5 bg-card/50 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(252,211,77,0.1)]">
// 			{/* Dekorativ burchaklar */}
// 			<span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/50"></span>
// 			<span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/50"></span>

// 			<div className="flex justify-between items-start mb-4">
// 				<div className="p-2 bg-white/5 rounded-lg border border-white/10">
// 					{getIcon()}
// 				</div>

// 				{/* Foiz ko'rsatkichi (Faqat tushum uchun) */}
// 				{percentage !== undefined && (
// 					<div
// 						className={`flex items-center text-xs font-medium ${trend === "increase" ? "text-green-500" : "text-red-500"}`}
// 					>
// 						{trend === "increase" ? (
// 							<TrendingUp size={14} className="mr-1" />
// 						) : (
// 							<TrendingDown size={14} className="mr-1" />
// 						)}
// 						{Math.abs(percentage)}%
// 					</div>
// 				)}
// 			</div>

// 			<div>
// 				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
// 					{type}
// 				</p>
// 				<h3 className="text-2xl font-bold tracking-tight">
// 					{type === "Oylik Tushum" ? `${count.toLocaleString()} so'm` : count}
// 				</h3>
// 			</div>

// 			{/* Pastki qismdagi dekorativ chiziq */}
// 			<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary/50 to-transparent transition-all duration-500 group-hover:w-full"></div>
// 		</div>
// 	);
// }

import { useCountUp } from "../hooks/useCountUp";
import { Wallet, Users, AlertCircle, LayoutGrid, Target, UserPlus } from "lucide-react";

export default function StatsCards({ data, type, percentage, trend, color = "blue", description }) {
  const count = useCountUp(data, 1500, 0);

  // Ranglar sxemasi
  const colorMap = {
    amber: "text-amber-500 border-amber-500/20 bg-amber-500/10",
    red: "text-red-500 border-red-500/20 bg-red-500/10",
    blue: "text-blue-500 border-blue-500/20 bg-blue-500/10",
    purple: "text-purple-500 border-purple-500/20 bg-purple-500/10",
    emerald: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
    orange: "text-orange-500 border-orange-500/20 bg-orange-500/10",
    cyan: "text-cyan-500 border-cyan-500/20 bg-cyan-500/10",
  };

  const getIcon = () => {
    const iconSize = 20;
    if (type.includes("Tushum")) return <Wallet size={iconSize} />;
    if (type.includes("Qarzdorlar") || type.includes("kelmaganlar")) return <AlertCircle size={iconSize} />;
    if (type.includes("O'quvchilar") || type.includes("Lidlar")) return <Users size={iconSize} />;
    if (type.includes("Guruhlar")) return <LayoutGrid size={iconSize} />;
    return <Target size={iconSize} />;
  };

  return (
    <div className={`relative group p-6 rounded-2xl border ${colorMap[color]} transition-all duration-500 hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10`}>
          {getIcon()}
        </div>
        {percentage !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {trend === 'up' ? `${percentage==0 ? '':'+'}` : ''}{percentage}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold opacity-60 uppercase tracking-widest">{type}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black tracking-tight text-white">
            {type.includes("Tushum") ? count.toLocaleString() : count}
          </span>
          {type.includes("Tushum") && <span className="text-sm opacity-50">UZS</span>}
        </div>
        {description && <p className="text-[10px] mt-2 opacity-40 italic">{description}</p>}
      </div>

      {/* Background dekoratsiyasi */}
      <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        {getIcon()}
      </div>
    </div>
  );
}
