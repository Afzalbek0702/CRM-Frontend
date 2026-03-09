import Loader from "../components/Loader";
import { useLeads } from "../services/lead/useLeads";
import { useNavigate } from "react-router-dom";
import { useCourse } from "../services/course/useCourse";
import { FaEllipsisV, FaThList, FaPlus, FaSearch, FaPhone } from "react-icons/fa";
import { useState } from "react";
import ActionMenu from "../components/ActionMenu";
import LeadModal from "../components/LeadModal";
import { useConfirm } from "../components/ConfirmProvider";
import { withConfirm } from "../helpers/withConfirm";
import { goBack } from "../utils/navigate.js";

export default function Leads() {
	const confirm = useConfirm();
	const navigate = useNavigate();
	const { leads, isLoading, createLead, updateLead, deleteLead, convertLeadToGroup } = useLeads();
	const [searchTerm, setSearchTerm] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		lead: null,
	});
	const { courseData } = useCourse();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingLead, setEditingLead] = useState(null);
	const [addToGroupLead, setAddToGroupLead] = useState(null);
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);

	const handleCreateLead = () => {
		setEditingLead(null);
		setIsModalOpen(true);
	};

	const handleActionMenu = (e, lead) => {
		const rect = e.currentTarget.getBoundingClientRect();

		const menuHeight = 100;
		const menuWidth = 150;

		const scrollY = window.scrollY;
		const scrollX = window.scrollX;

		const absoluteTop = rect.top + scrollY;
		const absoluteBottom = rect.bottom + scrollY;

		const viewportBottom = scrollY + window.innerHeight;
		const viewportRight = scrollX + window.innerWidth;

		const top =
			absoluteBottom + menuHeight > viewportBottom
				? absoluteTop - menuHeight - 8
				: absoluteBottom + 8;

		let left = rect.right + scrollX - menuWidth;
		if (left + menuWidth > viewportRight) {
			left = viewportRight - menuWidth - 10;
		}
		if (left < scrollX) {
			left = scrollX + 10;
		}

		setActionMenu({
			isOpen: true,
			position: {
				top: top + "px",
				left: left + "px",
			},
			lead: lead,
		});
	};

	if (isLoading) return <Loader />;

	const handleDeleteLead = withConfirm(
		confirm,
		"Are you sure you want to delete this lead?",
		async (lead) => {
			await deleteLead(lead.id);
			setActionMenu((m) => ({ ...m, isOpen: false }));
		}

	)

	return (
		<div className="table-container">
			<button className="btn1" onClick={goBack}>
				← Ortga
			</button>
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
				<button className="btn1 text-nowrap" onClick={handleCreateLead}>
					<FaPlus /> Lid qo'shish
				</button>
			</div>

			{leads && leads.length < 1 ? (
				<p>Lidlar yo'q</p>
			) : (
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
									<td><p
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
										className="copy-phone">{l.phone}</p></td>
									<td>{l.source}</td>

									<td>
										{courseData.find(c => c.name === l.interested_course)?.name || "-"}
									</td>

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
			)}

			<ActionMenu
				isOpen={actionMenu.isOpen}
				position={actionMenu.position}
				onClose={() => setActionMenu((s) => ({ ...s, isOpen: false }))}
				entityLabel="Lead"
				onEdit={() => {
					const l = actionMenu.lead;
					if (!l) return;
					setEditingLead(l);
					setIsModalOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onDelete={() => handleDeleteLead(actionMenu.lead)}
			/>

			<LeadModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingLead}
				onSubmit={async (data) => {
					if (editingLead) {
						await updateLead({ id: editingLead.id, data });
					} else {
						await createLead(data);
					}
					setIsModalOpen(false);
					setEditingLead(null);
				}}
			/>
		</div>
	);
}