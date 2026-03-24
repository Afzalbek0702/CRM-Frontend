import { useState, useEffect, useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useGroups } from "../services/group/useGroups";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils"; // Shadcn ning standart helperi

export default function AddToGroupModal({
	isOpen,
	onClose,
	onConfirm,
	initialGroupId = null,
}) {
	const { groups = [], loading } = useGroups();
	const [selectedId, setSelectedId] = useState(initialGroupId);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	// Modal ochilganda tanlangan qiymatni reset qilish
	useEffect(() => {
		if (isOpen) {
			setSelectedId(initialGroupId ?? "");
		}
	}, [initialGroupId, isOpen]);

	// Tanlangan guruh nomini topish (Memoize qilingan)
	const selectedGroupName = useMemo(() => {
		return groups.find((g) => g.id === selectedId)?.name || "Guruhni tanlang";
	}, [groups, selectedId]);

	const handleConfirm = () => {
		if (!selectedId) return;
		onConfirm(selectedId);
		onClose(); // Tasdiqlangach modalni yopish
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-106.25 bg-zinc-950 border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Guruhga qo'shish
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Talabani o'qitishni boshlash uchun kerakli guruhni tanlang.
					</DialogDescription>
				</DialogHeader>

				<div className="py-6">
					<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={isPopoverOpen}
								className="w-full justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200"
							>
								<span className="truncate">{selectedGroupName}</span>
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>

						<PopoverContent
							className="w-full p-0 bg-zinc-900 border-zinc-800"
							align="start"
						>
							<Command className="bg-zinc-900">
								<CommandInput
									placeholder="Guruh nomini yozing..."
									className="text-white border-none focus:ring-0"
								/>
								<CommandEmpty className="py-6 text-center text-sm text-zinc-500">
									Guruh topilmadi.
								</CommandEmpty>
								<CommandGroup className="max-h-60 overflow-y-auto custom-scrollbar">
									{loading ? (
										<div className="flex items-center justify-center py-6">
											<Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
										</div>
									) : (
										groups.map((group) => (
											<CommandItem
												key={group.id}
												value={group.name}
												onSelect={() => {
													setSelectedId(group.id);
													setIsPopoverOpen(false);
												}}
												className="text-zinc-300 aria-selected:bg-zinc-800 aria-selected:text-white cursor-pointer"
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4 text-primary",
														selectedId === group.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												{group.name}
											</CommandItem>
										))
									)}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="ghost"
						onClick={onClose}
						className="text-zinc-400 hover:text-white hover:bg-zinc-900"
					>
						Bekor qilish
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={!selectedId || loading}
						className="bg-primary hover:bg-primary/90 text-black font-medium"
					>
						<FaCheck className="mr-2" /> Qo'shish
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
