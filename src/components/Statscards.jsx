import { useCountUp } from "../hooks/useCountUp";
import { NavLink } from "react-router-dom";
import "../index.css"

export default function StatsCards({ data, type }) {
	const numericData = typeof data === 'number' ? data : (data ? parseInt(data.toString().replace(/[^0-9]/g, '')) : 0);
	const count = useCountUp(numericData, 2000, 0);

	return (
		<div className="w-73 h-37.5 p-6 uppercase border-l-5 border-primaryF bg-BgColorSecondary">
			<h2 className="text-sm text-primaryF mb-4">
				{type === "Dars sifati" ? "Dars sifati" : `Jami ${type}`}
			</h2>
			<p className="text-4xl font-bold">
				{type === "Oylik Tushum" ? count.toLocaleString() : count}
			</p>
		</div>
	);
}
