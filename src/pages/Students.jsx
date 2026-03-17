import Loader from "../components/Loader.jsx";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../services/student/useStudent.js";
import { useGroups } from "../services/group/useGroups.js";
import { useTeachers } from "../services/teacher/useTeachers.js";
import { useConfirm } from "../components/ConfirmProvider.jsx";
import { withConfirm } from "../helpers/withConfirm.js";
import { goBack } from "../utils/navigate.js";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	FaEllipsisV,
	FaUserGraduate,
	FaPhone,
	FaBirthdayCake,
	FaUsers,
	FaWallet,
	FaPlus,
} from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import StudentModal from "../components/StudentModal.jsx";
import ActionMenu from "../components/ActionMenu.jsx";
import AddToGroupModal from "../components/AddToGroupModal.jsx";

export default function Students() {
	const navigate = useNavigate();
	const {
		students,
		loading,
		error,
		createStudent,
		updateStudent,
		deleteStudent,
		addToGroup,
	} = useStudent();
	const { groups } = useGroups();
	const { teachers } = useTeachers();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingStudent, setEditingStudent] = useState(null);
	const confirm = useConfirm();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [actionMenu, setActionMenu] = useState({
		isOpen: false,
		position: { top: 0, left: 0 },
		student: null,
	});
	const [openGroup, setOpenGroup] = useState(false)
	const [openTeacher, setOpenTeacher] = useState(false)
	const [addToGroupOpen, setAddToGroupOpen] = useState(false);
	const [addToGroupStudent, setAddToGroupStudent] = useState(null);
	const { tenant } = useParams();
	const handleRowClick = (studentId) => {
		navigate(`/${tenant}/students/${studentId}`);
	};
	const handleDeleteStudent = withConfirm(
		confirm,
		"Are you sure you want to delete with student?",
		async (student) => {
			await deleteStudent(student.id);
			setActionMenu((m) => ({ ...m, isOpen: false }));
		}
	)

	if (loading) return <Loader />;
	if (error) return <div>Error</div>;

	return (
		<div className="table-container">
			<Button className="btn btn-default bg-primary " onClick={goBack}>
				← Ortga
			</Button>

			<h2>
				<FaUserGraduate /> O'quvchilar
			</h2>

			<div className="table-actions mb-7.5">


				<InputGroup className={"max-w-[500px]"}>
					<InputGroupInput
						
						type="text"
						placeholder="O'quvchilarni ismi bo'yicha qidirsh ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<InputGroupAddon>
						<FaSearch />
					</InputGroupAddon>
				</InputGroup>

				<Button
					className="btn btn-default bg-primary  text-nowrap"
					onClick={() => {
						setEditingStudent(null);
						setIsModalOpen(true);
					}}
				>
					<FaPlus /> O'quvchi qo'shish
				</Button>


			</div>

			<div className="filters mb-7.5">

				<Popover open={openTeacher} onOpenChange={setOpenTeacher}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openTeacher}
							className="w-[250px] justify-between btn-default"
						>
							{selectedTeacher
								? teachers.find((t) => t.id === selectedTeacher)?.full_name
								: "Hamma o'qituvchilar"}
							<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-[250px] p-0">
						<Command>
							<CommandInput placeholder="Qidirish..." />
							<CommandEmpty>Topilmadi.</CommandEmpty>

							<CommandGroup>
								<CommandItem
									value="all"
									onSelect={() => {
										setSelectedTeacher("")
										setOpenTeacher(false)
									}}
								>
									Hamma o'qituvchilar
								</CommandItem>

								{teachers.map((t) => (
									<CommandItem
										key={t.id}
										value={t.full_name}
										onSelect={() => {
											setSelectedTeacher(t.id)
											setOpenTeacher(false)
										}}
									>
										{t.full_name}
										<Check
											className={`ml-auto h-4 w-4 ${selectedTeacher === t.id ? "opacity-100" : "opacity-0"
												}`}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>

				<Popover open={openGroup} onOpenChange={setOpenGroup} className={"btn-default"}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openGroup}
							className="w-[250px] justify-between btn-default"
						>
							{selectedGroup
								? groups.find((g) => g.id === selectedGroup)?.name
								: "Hamma guruhlar"}
							<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-[250px] p-0">
						<Command>
							<CommandInput placeholder="Qidirish..." />
							<CommandEmpty>Topilmadi.</CommandEmpty>

							<CommandGroup>
								<CommandItem
									value="all"
									onSelect={() => {
										setSelectedGroup("")
										setOpenGroup(false)
									}}
								>
									Hamma guruhlar
								</CommandItem>

								{groups.map((g) => (
									<CommandItem
										key={g.id}
										value={g.name}
										onSelect={() => {
											setSelectedGroup(g.id)
											setOpenGroup(false)
										}}
									>
										{g.name}
										<Check
											className={`ml-auto h-4 w-4 ${selectedGroup === g.id ? "opacity-100" : "opacity-0"
												}`}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>




			</div>


			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<div><FaUserGraduate /> Ism</div>
						</TableHead>

						<TableHead>
							<div><FaUsers /> Guruh nomi</div>
						</TableHead>

						<TableHead>
							<div><FaPhone /> Telefon</div>
						</TableHead>

						<TableHead>
							<div><FaBirthdayCake /> Tug'ilgan kun</div>
						</TableHead>

						<TableHead>
							<div><FaUsers /> Ota-onasi</div>
						</TableHead>

						<TableHead>
							<div><FaPhone /> Ota-onasi telefon</div>
						</TableHead>

						<TableHead>
							<div><FaWallet /> Balance</div>
						</TableHead>

						<TableHead></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{students.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8}>
								O'quvchilar topilmadi.
							</TableCell>
						</TableRow>
					) : (
						(students || [])
							.filter((s) =>
								s.full_name
									.toLowerCase()
									.includes(searchTerm.toLowerCase())
							)
							.filter((s) => {
								if (!selectedTeacher) return true;
								if (!s.groups) return false;

								const groupObj = groups.find(
									(g) => g.id === s.groups.id
								);
								return groupObj?.teacher_id === selectedTeacher;
							})
							.filter((s) => {
								if (!selectedGroup) return true;
								if (!s.groups) return false;

								return s.groups.id === selectedGroup;
							})
							.map((s) => {
								const formatDate = (d) => {
									if (!d) return "";
									return String(d).split("T")[0];
								};

								return (
									<TableRow
										key={s.id}
										onClick={() => handleRowClick(s.id)}
										className="cursor-pointer"
									>
										<TableCell>{s.full_name}</TableCell>

										<TableCell>
											{Array.isArray(s.groups) &&
												s.groups.length > 0
												? s.groups
													.map((g) => g.name)
													.join(", ")
												: s.groups && s.groups.name
													? s.groups.name
													: "No Group"}
										</TableCell>

										<TableCell>
											<p
												onClick={(e) => {
													e.stopPropagation();
													navigator.clipboard.writeText(
														s.phone
													);

													const el = e.currentTarget;
													el.dataset.copied = "true";

													setTimeout(() => {
														el.dataset.copied = "false";
													}, 2000);
												}}
												data-copied="false"
												className="copy-phone"
											>
												{s.phone}
											</p>
										</TableCell>

										<TableCell>
											{formatDate(s.birthday)}
										</TableCell>

										<TableCell>{s.parents_name}</TableCell>

										<TableCell>
											<p
												onClick={(e) => {
													e.stopPropagation();
													navigator.clipboard.writeText(
														s.parents_phone
													);

													const el = e.currentTarget;
													el.dataset.copied = "true";

													setTimeout(() => {
														el.dataset.copied = "false";
													}, 2000);
												}}
												data-copied="false"
												className="copy-phone"
											>
												{s.parents_phone}
											</p>
										</TableCell>

										<TableCell>
											{s.monthly_paid?.toLocaleString() ??
												0}{" "}
											so&apos;m
										</TableCell>

										<TableCell
											style={{ width: "10px" }}
											onClick={(e) =>
												e.stopPropagation()
											}
										>
											<Button
												className="icon-button"
												onClick={(e) => {
													const rect =
														e.currentTarget.getBoundingClientRect();

													const menuHeight = 110;
													const menuWidth = 150;

													const scrollY =
														window.scrollY;
													const scrollX =
														window.scrollX;

													const absoluteTop =
														rect.top + scrollY;
													const absoluteBottom =
														rect.bottom + scrollY;

													const viewportBottom =
														scrollY +
														window.innerHeight;
													const viewportRight =
														scrollX +
														window.innerWidth;

													const top =
														absoluteBottom +
															menuHeight >
															viewportBottom
															? absoluteTop -
															menuHeight -
															8
															: absoluteBottom +
															8;

													let left =
														rect.right +
														scrollX -
														menuWidth;
													if (
														left +
														menuWidth >
														viewportRight
													) {
														left =
															viewportRight -
															menuWidth -
															10;
													}
													if (left < scrollX) {
														left = scrollX + 10;
													}

													setActionMenu({
														isOpen: true,
														position: {
															top: top + "px",
															left:
																left +
																"px",
														},
														student: s,
													});
												}}
											>
												<FaEllipsisV />
											</Button>
										</TableCell>
									</TableRow>
								);
							}))}
				</TableBody>
			</Table>


			<ActionMenu
				isOpen={actionMenu.isOpen}
				position={actionMenu.position}
				onClose={() =>
					setActionMenu((s) => ({ ...s, isOpen: false }))
				}
				entityLabel="Student"
				onEdit={() => {
					const s = actionMenu.student;
					setEditingStudent(s);
					setIsModalOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
				onDelete={() => handleDeleteStudent(actionMenu.student)}
				onAddToGroup={() => {
					const s = actionMenu.student;
					if (!s) return;
					setAddToGroupStudent(s);
					setAddToGroupOpen(true);
					setActionMenu((m) => ({ ...m, isOpen: false }));
				}}
			/>

			<StudentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingStudent}
				onSubmit={async (formData) => {
					if (editingStudent) {
						console.log(
							"Updating student:",
							editingStudent?.id,
							formData
						);
						await updateStudent(editingStudent.id, formData);
					} else {
						await createStudent(formData);
					}
					setIsModalOpen(false);
					setEditingStudent(null);
				}}
			/>

			<AddToGroupModal
				isOpen={addToGroupOpen}
				onClose={() => {
					setAddToGroupOpen(false);
					setAddToGroupStudent(null);
				}}
				initialGroupId={addToGroupStudent?.group_id}
				onConfirm={async (groupId) => {
					if (!addToGroupStudent) return;
					await addToGroup(
						addToGroupStudent.id,
						Number(groupId)
					);
					setAddToGroupOpen(false);
					setAddToGroupStudent(null);
				}}
			/>
		</div>
	);
}
