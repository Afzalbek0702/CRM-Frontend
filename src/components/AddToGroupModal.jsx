import { useState, useEffect } from "react";
import { FaUsers, FaTimes, FaCheck } from "react-icons/fa";
import { useGroups } from "../services/group/useGroups";

import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AddToGroupModal({ isOpen, onClose, onConfirm, initialGroupId = null }) {
	const { groups, loading } = useGroups();
	const [selected, setSelected] = useState(initialGroupId);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setSelected(initialGroupId ?? "");
	}, [initialGroupId, isOpen]);

	if (!isOpen) return null;

	const handleConfirm = () => {
		if (!selected) return;
		onConfirm(selected);
	};

	return (
		<>
			<div className="side-panel-backdrop" onClick={onClose}></div>
			<div className="side-panel" onClick={(e) => e.stopPropagation()}>
				<div className="panel-header">
					<div className="panel-title-section">
						<div className="panel-icon">
							<FaUsers />
						</div>
						<div>
							<h2>Guruhga qo'shish</h2>
							<p className="panel-subtitle">
								Talabani qo'shish uchun guruhni tanlang
							</p>
						</div>
					</div>
					<button className="close-button" onClick={onClose}>
						<FaTimes />
					</button>
				</div>

				<div className="modal-form">
					<div className="form-grid">
						<div className="form-group full-width">
							<label className="form-label">Guruhni tanlang</label>
							{/* <select
								className="form-input"
								value={selected || ""}
								onChange={(e) => setSelected(e.target.value)}
							>
								<option value="">-- Gruhni tanlang --</option>
								{loading ? (
									<option value="">Yuklanmoqda...</option>
								) : (
									groups.map((g) => (
										<option key={g.id} value={g.id}>
											{g.name}
										</option>
									))
								)}
							</select> */}

							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-full justify-between"
									>
										{selected
											? groups.find((g) => g.id === selected)?.name
											: "Guruhni tanlang"}
										<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
									</Button>
								</PopoverTrigger>

								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Guruh qidirish..." />

										<CommandEmpty>Guruh topilmadi.</CommandEmpty>

										<CommandGroup>
											{loading ? (
												<CommandItem disabled>Yuklanmoqda...</CommandItem>
											) : (
												groups.map((g) => (
													<CommandItem
														key={g.id}
														value={g.name}
														onSelect={() => {
															setSelected(g.id);
															setOpen(false);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selected === g.id ? "opacity-100" : "opacity-0"
															)}
														/>
														{g.name}
													</CommandItem>
												))
											)}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div className="panel-buttons">
						<button type="button" className="btn btn-cancel" onClick={onClose}>
							<FaTimes /> Bekor qilish
						</button>
						<button
							type="button"
							className="btn btn-default flex justify-center"
							onClick={handleConfirm}
						>
							<FaCheck /> Qo'shish
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
