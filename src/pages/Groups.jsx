import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ActionMenu from "../components/ActionMenu";
import { useGroups } from "../services/group/useGroups.js";
import { useStudent } from "../services/student/useStudent.js";
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
import {
	FaEllipsisV,
	FaPlus,
	FaUsers,
	FaDollarSign,
	FaClock,
	FaBook,
	FaChalkboardTeacher,
	FaCalendarAlt,
	FaSearch,
} from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";

export default function Groups() {
	const confirm = useConfirm();
	const navigate = useNavigate();
	const { tenant } = useParams();
	const { groups, loading, createGroup, deleteGroup, updateGroup } =
		useGroups();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
	const [actionMenuPosition, setActionMenuPosition] = useState({
		top: 0,
		left: 0,
	});
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const { students } = useStudent();

	const studentCountMap = students.reduce((acc, student) => {
		if (!student.groups) return acc;

		const groupsArray = Array.isArray(student.groups) ? student.groups : [student.groups];

		groupsArray.forEach((g) => {
			const groupId = g?.id ?? g;
			if (groupId != null) {
				acc[groupId] = (acc[groupId] || 0) + 1;
			}
		});

		return acc;
	}, {});

	const groupsWithCount = groups.map((group) => ({
		...group,
		studentCount: studentCountMap[group.id] || 0,
	}));

	console.log(groupsWithCount);




	const handleCreate = () => {
		setIsEditMode(false);
		setSelectedGroup(null);
		setIsModalOpen(true);
	};

	const handleEdit = () => {
		setIsEditMode(true);
		setIsActionMenuOpen(false);
		setIsModalOpen(true);
	};

	const handleDeleteGroup = (group) => {
		if (!group) return;
		withConfirm(
			confirm,
			`Are you sure you want to delete ${group.name}?`,
			async () => {
				await deleteGroup(group.id);
				setIsActionMenuOpen(false);
			}
		)();
	};

	const handleActionMenu = (e, group) => {
		e.stopPropagation();
		setSelectedGroup(group);

		const rect = e.currentTarget.getBoundingClientRect();
		const menuHeight = 80;
		const menuWidth = 150;

		const scrollY = window.scrollY;
		const scrollX = window.scrollX;

		const absoluteTop = rect.top + scrollY;
		const absoluteBottom = rect.bottom + scrollY;

		const viewportBottom = scrollY + window.innerHeight;
		const viewportRight = scrollX + window.innerWidth;

		let top =
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

		setActionMenuPosition({ top: top + "px", left: left + "px" });
		setIsActionMenuOpen(true);
	};

	const handleRowClick = (groupId) => {
		navigate(`/${tenant}/groups/${groupId}`);
	};

	const handleSubmit = (formData) => {
		if (isEditMode && selectedGroup) {
			updateGroup(selectedGroup.id, formData);
		} else {
			createGroup(formData);
		}
		setIsModalOpen(false);
		setSelectedGroup(null);
		setIsEditMode(false);
	};

	if (loading) {
		return <Loader />;
	}


	return (
		<div className="table-container">
			<Button className="btn-default" onClick={goBack}>
				← Ortga
			</Button>
			<h2>
				<FaUsers /> Guruhlar
			</h2>
			<div className="table-actions mb-7.5">
				<InputGroup>
					<InputGroupInput value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)} placeholder="Guruh nomi bo'yicha qidirish" />
					<InputGroupAddon>
						<FaSearch />
					</InputGroupAddon>
				</InputGroup>
				<Button className={"btn-default"} onClick={handleCreate}>
					<FaPlus /> Guruh yaratish
				</Button>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedGroup(null);
					setIsEditMode(false);
				}}
				onSubmit={handleSubmit}
				title={isEditMode ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
				initialData={selectedGroup}
			/>

			<ActionMenu
				isOpen={isActionMenuOpen}
				position={actionMenuPosition}
				onEdit={handleEdit}
				onDelete={() => handleDeleteGroup(selectedGroup)}
				onClose={() => setIsActionMenuOpen(false)}
			/>





			<Table>

				<TableHeader>
					<TableRow>
						<TableHead>
							<div>
								<HiOutlinePencilAlt /> Nomi
							</div>
						</TableHead>

						<TableHead>
							<div>
								<FaDollarSign /> Narx
							</div>
						</TableHead>

						<TableHead>
							<div>
								<FaClock /> Dars vaqti
							</div>
						</TableHead>

						<TableHead>
							<div>
								<FaBook /> Kurs turi
							</div>
						</TableHead>

						<TableHead>
							<div>
								<FaChalkboardTeacher /> O'qituvchi
							</div>
						</TableHead>

						<TableHead>
							<div>
								<FaCalendarAlt /> Dars kunlari
							</div>
						</TableHead >

						<TableHead />
					</TableRow>
				</TableHeader>

				<TableBody>
					{groupsWithCount.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7}>
								Guruhlar topilmadi.
							</TableCell>
						</TableRow>
					) : (
						groupsWithCount
							.filter(
								(g) =>
									g.name &&
									g.name.toLowerCase().includes(searchTerm.toLowerCase())
							)
							.map((g) => (
								<TableRow
									key={g.id}
									onClick={() => handleRowClick(g.id)}
									className="cursor-pointer"
								>
									<TableCell>
										{g.name}{" "}
										<span id="studentCounter">[{g.studentCount}]</span>
									</TableCell>

									<TableCell>
										{g.price} ming so'm
									</TableCell>

									<TableCell>
										{g.lesson_time}
									</TableCell>

									<TableCell>
										{g.course_type}
									</TableCell>

									<TableCell className="teacher">
										{g.teachers.full_name}
									</TableCell>

									<TableCell>
										{Array.isArray(g.lesson_days) ? (
											g.lesson_days.map((day) => (
												<span
													key={day}
													className="day-pill px-2.5 py-0.75 rounded-[10px]"
												>
													{day}
												</span>
											))
										) : (
											<span className="day-pill">
												{g.lesson_days}
											</span>
										)}
									</TableCell>

									<TableCell
										className="w-2.5"
										onClick={(e) => e.stopPropagation()}
									>
										<button
											className="icon-button"
											onClick={(e) => handleActionMenu(e, g)}
										>
											<FaEllipsisV />
										</button>
									</TableCell>
								</TableRow>
							)))}
				</TableBody>

			</Table>

		</div>
	);
}
