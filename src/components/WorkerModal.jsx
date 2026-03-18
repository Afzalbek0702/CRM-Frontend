import { useState, useEffect } from "react";
import {
	FaUser,
	FaPhone,
	FaSave,
	FaDollarSign,
	FaBriefcase,
	FaBirthdayCake,
	FaLock,
} from "react-icons/fa";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function WorkerModal({ isOpen, onClose, onSubmit, initialData }) {
	const [formData, setFormData] = useState({
		full_name: "",
		phone: "",
		password: "",
		salary: "",
		birthday: "",
		position: "",
		role: "",
		salary_type: "CASH",
		img: null,
	});

	const [date, setDate] = useState();

	useEffect(() => {
		if (initialData) {
			const birthday = initialData.birthday
				? String(initialData.birthday).split("T")[0]
				: "";
			setFormData({
				full_name: initialData.full_name || "",
				phone: initialData.phone || "",
				password: "",
				salary: initialData.salary || "",
				birthday,
				position: initialData.position || "",
				role: initialData.role || "",
				salary_type: initialData.salary_type || "CASH",
				img: null,
			});
			setDate(birthday ? new Date(birthday) : undefined);
		} else {
			setFormData({
				full_name: "",
				phone: "",
				password: "",
				salary: "",
				birthday: "",
				position: "",
				role: "",
				salary_type: "CASH",
				img: null,
			});
			setDate(undefined);
		}
	}, [initialData, isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelect = (selectedDate) => {
		setDate(selectedDate);
		setFormData((prev) => ({
			...prev,
			birthday: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const payload = {
			...formData,
			role: formData.role.toUpperCase(),
			salary_type: formData.salary_type.toUpperCase(),
		};
		await onSubmit(payload);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{initialData ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="modal-inputs flex flex-col gap-4">
						<div>
							<Label>
								<FaUser /> Ism
							</Label>
							<Input
								name="full_name"
								value={formData.full_name}
								onChange={handleChange}
								required
							/>
						</div>

						<div>
							<Label>
								<FaPhone /> Telefon
							</Label>
							<Input
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								required
							/>
						</div>

						{!initialData && (
							<div>
								<Label>
									<FaLock /> Parol
								</Label>
								<Input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>
						)}

						<div>
							<Label>
								<FaDollarSign /> Maosh
							</Label>
							<Input
								type="number"
								name="salary"
								value={formData.salary}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label className="flex items-center gap-2">
								<FaBirthdayCake /> Tug'ilgan sana
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
								<FaBriefcase /> Lavozim
							</Label>
							<Select
								value={formData.position}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, position: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Tanlang" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Teacher">Teacher</SelectItem>
									<SelectItem value="Manager">Manager</SelectItem>
									<SelectItem value="Administrator">Administrator</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Role</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, role: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Tanlang" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ADMIN">Admin</SelectItem>
									<SelectItem value="MANAGER">Manager</SelectItem>
									<SelectItem value="TEACHER">Teacher</SelectItem>
									<SelectItem value="CEO">CEO</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Maosh turi</Label>
							<Select
								value={formData.salary_type}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, salary_type: value }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="CASH">Naqd</SelectItem>
									<SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
									<SelectItem value="OTHER">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose} className="btn-cancel">
							Bekor qilish
						</Button>

						<Button type="submit" className="btn-default">
							<FaSave /> Saqlash
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}