import { useState, useEffect } from "react";
import { FaUsers, FaTimes, FaCheck } from "react-icons/fa";
import { useGroups } from "../services/group/useGroups";

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
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
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Guruhga qo'shish</DialogTitle>
					<DialogDescription>
						Talabani qo'shish uchun guruhni tanlang
					</DialogDescription>
				</DialogHeader>

				<div className="modal-inputs">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" role="combobox" aria-expanded={open}>
								{selected
									? groups.find((g) => g.id === selected)?.name
									: "Guruhni tanlang"}
								<ChevronsUpDown />
							</Button>
						</PopoverTrigger>

						<PopoverContent>
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
												{selected === g.id && <Check />}
												{g.name}
											</CommandItem>
										))
									)}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Bekor qilish
					</Button>

					<Button onClick={handleConfirm}>
						<FaCheck /> Qo'shish
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
