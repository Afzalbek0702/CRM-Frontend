import { useCountUp } from "../hooks/useCountUp";
import { NavLink } from "react-router-dom";
import "../index.css";

export default function StatsCards({ data, type }) {
	const numericData =
		typeof data === "number"
			? data
			: data
				? parseInt(data.toString().replace(/[^0-9]/g, ""))
				: 0;
	const count = useCountUp(numericData, 2000, 0);

	return (
		<div className="group relative w-60 h-37.5 p-6 uppercase bg-card border border-primary-foreground transition-all duration-300 hover:shadow-[inset_0_0_12px_rgba(252,211,77,0.4)] rounded-2xl">
			<span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-65 rounded-tl-xl"></span>
			<span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary opacity-65 rounded-tr-xl"></span>
			<span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary opacity-65 rounded-bl-xl"></span>
			<span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-65 rounded-br-xl"></span>

			<div className="absolute inset-0 rounded-xl border border-primary/10 pointer-events-none "></div>

			<h2 className="text-sm text-primaryF mb-4">{`Jami ${type}`}</h2>

			<p className="text-4xl font-bold">
				{type === "Oylik Tushum" ? count.toLocaleString() : count}
			</p>
		</div>
	);
}
