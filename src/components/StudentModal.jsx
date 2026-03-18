import { useState, useEffect } from "react";
import {
	FaUser,
	FaPhone,
	FaBirthdayCake,
	FaUsers,
	FaSave,
	FaPlus,
} from "react-icons/fa";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function StudentModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		full_name: "",
		phone: "",
		birthday: "",
		parents_name: "",
		parents_phone: "",
		balance: "",
	});

	// Date object for Calendar
	const [date, setDate] = useState();

	useEffect(() => {
		if (initialData) {
			const rawBirthday = initialData.birthday;
			const birthday = rawBirthday ? String(rawBirthday).split("T")[0] : "";

			setFormData({
				full_name: initialData.full_name || "",
				phone: initialData.phone || "",
				birthday,
				parents_name: initialData.parents_name || "",
				parents_phone: initialData.parents_phone || "",
				balance: initialData.balance ?? "",
			});

			setDate(birthday ? new Date(birthday) : undefined);
		} else {
			setFormData({
				full_name: "",
				phone: "",
				birthday: "",
				parents_name: "",
				parents_phone: "",
				balance: "",
			});
			setDate(undefined);
		}
	}, [initialData, isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
	};

	const handleSelect = (selectedDate) => {
		setDate(selectedDate);
		setFormData((prev) => ({
			...prev,
			birthday: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			...formData,
			birthday: formData.birthday || null,
			balance: Number(formData.balance || 0),
		};

		onSubmit(payload);

		setFormData({
			full_name: "",
			phone: "",
			birthday: "",
			parents_name: "",
			parents_phone: "",
			balance: "",
		});
		setDate(undefined);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? "Edit Student" : "New Student"}</DialogTitle>
					<DialogDescription>
						{initialData ? "Update student details" : "Add a new student"}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="modal-inputs flex flex-col gap-4">
						<div>
							<Label>
								<FaUser /> Ism familiya
							</Label>
							<Input
								name="full_name"
								required
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label>
								<FaPhone /> Telefon raqam
							</Label>
							<Input
								name="phone"
								required
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label>
								<FaBirthdayCake /> Tug'ilgan kun
							</Label>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										data-empty={!date}
										className={cn(
											"w-full justify-start text-left font-normal",
											!date && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date ? format(date, "PPP") : "Pick a date"}
									</Button>
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={handleSelect}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div>
							<Label>
								<FaUsers /> Ota-ona ismi
							</Label>
							<Input
								name="parents_name"
								value={formData.parents_name}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label>
								<FaPhone /> Ota-ona raqami
							</Label>
							<Input
								name="parents_phone"
								value={formData.parents_phone}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label>
								<FaPlus /> Balance
							</Label>
							<Input
								name="balance"
								type="number"
								value={formData.balance}
								onChange={handleChange}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose} className="btn-cancel">
							Bekor qilish
						</Button>

						<Button type="submit" className="btn-default">
							{initialData ? (
								<>
									<FaSave /> Saqlash
								</>
							) : (
								<>
									<FaPlus /> Yaratish
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}