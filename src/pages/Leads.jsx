import Loader from "../components/Loader";
import { useLeads } from "../services/lead/useLeads";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaThList, FaPlus, FaSearch, FaPhone } from "react-icons/fa";
import { useState } from "react";
import ActionMenu from "../components/ActionMenu";

export default function Leads() {
	const navigate = useNavigate();
	const { leads, isLoading, createLead, deleteLead, convertLeadToGroup } = useLeads();
	const [searchTerm, setSearchTerm] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		lead: null,
	});
	const [addToGroupLead, setAddToGroupLead] = useState(null);
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);

	const handleActionMenu = (e, lead) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		setActionMenu({
			isOpen: true,
			position: {
				top: rect.bottom + window.scrollY + 8 + "px",
				left: rect.right + window.scrollX - 150 + "px",
			},
			lead: lead,
		});
	};

	if (isLoading) return <Loader />;

	return (
		<div className="table-container">
			<h2>
				<FaThList /> Lidlar
			</h2>
			<div className="table-actions">
				<div className="search-box">
					<FaSearch />
					<input
						type="text"
						placeholder="Lidlarni ismi bo'yicha qidirsh ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<button
					className="btn1"
					onClick={() => {
						createLead({
							full_name: "New Lead",
							phone: "",
							source: "Manual",
							interested_course: "",
							comment: "",
						});
					}}
				>
					<FaPlus /> Lid qo'shish
				</button>
			</div>

			<table>
				<thead>
					<tr>
						<th>
							<FaThList /> Ism
						</th>
						<th>
							<FaPhone /> Telefon
						</th>
						<th>Manba</th>
						<th>Qiziqadigan Kurs</th>
						<th>Izoh</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{(leads || [])
						.filter(
							(l) =>
								l.full_name &&
								l.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
						)
						.map((l) => (
							<tr key={l.id}>
								<td>{l.full_name}</td>
								<td
									onClick={(e) => {
										e.stopPropagation();
										navigator.clipboard.writeText(l.phone);

										const el = e.currentTarget;
										el.dataset.copied = "true";

										setTimeout(() => {
											el.dataset.copied = "false";
										}, 2000);
									}}
									data-copied="false"
									className="copy-phone"
								>
									{l.phone}
								</td>
								<td>{l.source}</td>
								<td>{l.interested_course}</td>
								<td>{l.comment}</td>
								<td
									style={{ width: "10px" }}
									onClick={(e) => e.stopPropagation()}
								>
									<button
										className="icon-button"
										onClick={(e) => handleActionMenu(e, l)}
									>
										<FaEllipsisV />
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>

			<ActionMenu
				isOpen={actionMenu.isOpen}
				position={actionMenu.position}
				onClose={() => setActionMenu((s) => ({ ...s, isOpen: false }))}
				entityLabel="Lead"
				onEdit={() => {
					const l = actionMenu.lead;
					if (!l) return;
					// TODO: Implement edit lead functionality
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onDelete={async () => {
					const l = actionMenu.lead;
					if (!l) return;
					deleteLead(l.id);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onAddToGroup={() => {
					const l = actionMenu.lead;
					if (!l) return;
					setAddToGroupLead(l);
					setAddToGroupOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
			/>
		</div>
	);
}
