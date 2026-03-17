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
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"

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
			<Button className="btn-default rounded text-black" onClick={goBack}>
				← Ortga
			</Button>

			<h2 className="page-title">
				<FaThList /> Lidlar
			</h2>

			<div className="table-actions mb-7.5">
				<InputGroup>
					<InputGroupInput
						type="text"
						placeholder="Lidlarni ismi bo'yicha qidirsh ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<InputGroupAddon>
						<FaSearch />
					</InputGroupAddon>
				</InputGroup>

				<Button
					onClick={handleCreateLead}
					className="btn-default"
				>
					<FaPlus /> Lid qo'shish
				</Button>
			</div>


			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<div><FaThList /> Ism</div>
						</TableHead>

						<TableHead>
							<div><FaPhone /> Telefon</div>
						</TableHead>

						<TableHead><div>Manba</div></TableHead>

						<TableHead><div>Qiziqadigan Kurs</div></TableHead>

						<TableHead><div>Izoh</div></TableHead>

						<TableHead></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>

					{leads.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6}>
								Lidlar topilmadi.
							</TableCell>
						</TableRow>
					) : (
						(leads || [])
							.filter(
								(l) =>
									l.full_name &&
									l.full_name
										.toLowerCase()
										.includes(searchTerm.toLowerCase()),
							)
							.map((l) => (
								<TableRow key={l.id}>
									<TableCell>{l.full_name}</TableCell>

									<TableCell>
										<p
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
										</p>
									</TableCell>

									<TableCell>{l.source}</TableCell>

									<TableCell>
										{
											courseData.find(
												(c) => c.name === l.interested_course,
											)?.name || "-"
										}
									</TableCell>

									<TableCell>{l.comment}</TableCell>

									<TableCell
										style={{ width: "10px" }}
										onClick={(e) => e.stopPropagation()}
									>
										<Button
											className="icon-button"
											onClick={(e) => handleActionMenu(e, l)}
										>
											<FaEllipsisV />
										</Button>
									</TableCell>
								</TableRow>
							)))}
				</TableBody>
			</Table>


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