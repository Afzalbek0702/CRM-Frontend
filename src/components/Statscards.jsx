import { useCountUp } from "../hooks/useCountUp";
import { NavLink } from "react-router-dom";
import "../index.css"

export default function StatsCards({ data, type }) {
	const numericData = typeof data === 'number' ? data : (data ? parseInt(data.toString().replace(/[^0-9]/g, '')) : 0);
	const count = useCountUp(numericData, 2000, 0);

	return (
			<div className="card">
				<h2>Jami {type}</h2>
				<p>{type === "Oylik Tushum" ? count.toLocaleString() : count}</p>
			</div>
	);
}
