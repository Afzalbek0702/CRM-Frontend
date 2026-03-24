import { useState } from "react";
import { useCourse } from "../services/course/useCourse";
import { useRoom } from "../services/room/useRoom";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

// Shadcn UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Ikonkalar
import {
	Plus,
	Edit2,
	Trash2,
	ArrowLeft,
	BookOpen,
	DoorOpen,
	Users,
	Wallet,
	Layers,
	Settings as SettingsIcon,
   Clock,
   CalendarRange,
   UsersRound,
} from "lucide-react";
import { FaEllipsisV } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { id } from "date-fns/locale";

export default function Settings() {
	const { courseData, isLoading, createCourse, updateCourse, removeCourse } =
		useCourse();
	const {
		roomData,
		isLoading: roomLoading,
		createRoom,
		updateRoom,
		removeRoom,
	} = useRoom();
	const navigate = useNavigate();
	// Modallar uchun holat
	const [courseModal, setCourseModal] = useState({ open: false, data: null });
	const [roomModal, setRoomModal] = useState({ open: false, data: null });
	const [deleteId, setDeleteId] = useState({ id: null, type: null });
	if (isLoading || roomLoading) return <Loader />;

   const handleConfirmDelete = () => {
      if (deleteId.type === "course") {
         removeCourse(deleteId.id);
         setDeleteId({ id: null, type: null });
      } else if (deleteId.type === "room") {
         removeRoom(deleteId.id);
         setDeleteId({ id: null, type: null });
      }
   }
		// --- Kurslar bilan ishlash ---
		const handleCourseSubmit = (e) => {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData);

			if (courseModal.data) {
				updateCourse({ id: courseModal.data.id, data });
			} else {
				createCourse(data);
			}
			setCourseModal({ open: false, data: null });
		};

		// --- Xonalar bilan ishlash ---
		const handleRoomSubmit = (e) => {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = {
				name: formData.get("name"),
				capacity: formData.get("capacity"),
			};

			if (roomModal.data) {
				updateRoom({ id: roomModal.data.room_id, data });
			} else {
				createRoom(data);
			}
			setRoomModal({ open: false, data: null });
		};

		return (
			<div className="space-y-6 bg-background min-h-screen animate-in fade-in duration-500">
				<div className="flex items-center justify-between">
					<div className="fex items-center gap-4">
						<Button onClick={() => navigate(-1)} className="btn-default">
							<ArrowLeft className="h-4 w-4" /> Ortga qaytish
						</Button>
						<h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 mt-3">
							<SettingsIcon className="h-8 w-8 text-primary" /> Sozlamalar
						</h2>
					</div>
				</div>

				<Tabs defaultValue="courses" className="w-full">
					<TabsList className="grid w-full max-w-100 grid-cols-2 bg-card!">
						<TabsTrigger value="courses" className="gap-2">
							<BookOpen className="h-4 w-4" /> Kurslar
						</TabsTrigger>
						<TabsTrigger value="rooms" className="gap-2">
							<DoorOpen className="h-4 w-4" /> Xonalar
						</TabsTrigger>
					</TabsList>

					{/* --- KURSLAR PANEL --- */}
					<TabsContent value="courses" className="pt-4 space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-medium">Barcha kurslar</h3>
							<Button
								onClick={() => setCourseModal({ open: true, data: null })}
								className="gap-2"
							>
								<Plus className="h-4 w-4" /> Kurs qo'shish
							</Button>
						</div>

						<div className="rounded-md border shadow-sm overflow-hidden">
							<Table>
								<TableHeader className="bg-primary">
									<TableRow className="hover:bg-primary/95 transition-colors">
										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<BookOpen className="h-4 w-4" /> Kurs nomi
											</div>
										</TableHead>

										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<Wallet className="h-4 w-4" /> Narxi (so'm)
											</div>
										</TableHead>

										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<Layers className="h-4 w-4" /> Darslar soni
											</div>
										</TableHead>

										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{courseData.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-10 text-gray-500"
											>
												Kurslar topilmadi.
											</TableCell>
										</TableRow>
									) : (
										courseData.map((course) => (
											<TableRow key={course.id} className={"bg-card"}>
												<TableCell className="font-medium">
													{course.name}
												</TableCell>
												<TableCell>
													{Number(course.price).toLocaleString()}
												</TableCell>
												<TableCell>{course.lesson_count} ta</TableCell>
												<TableCell className={"flex justify-end"}>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 hover:bg-gray-700 text-white"
															>
																<FaEllipsisV />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-32 bg-card border-gray-700 text-white"
														>
															<DropdownMenuItem
																className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
																onClick={() =>
																	setModal({ isOpen: true, data: course })
																}
															>
																<Edit2 className="mr-2 text-blue-400" />{" "}
																Tahrirlash
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
																onClick={() =>
																	setDeleteId({ id: course.id, type: "course" })
																}
															>
																<Trash2 className="mr-2 text-red-500" />{" "}
																O'chirish
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</TabsContent>

					{/* --- XONALAR PANEL --- */}
					<TabsContent value="rooms" className="pt-4 space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-medium">O'quv xonalari</h3>
							<Button
								onClick={() => setRoomModal({ open: true, data: null })}
								className="gap-2"
							>
								<Plus className="h-4 w-4" /> Xona qo'shish
							</Button>
						</div>

						<div className="rounded-md border shadow-sm overflow-hidden">
							<Table>
								<TableHeader className="bg-primary">
									<TableRow className="hover:bg-primary/95 transition-colors">
										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<DoorOpen className="h-4 w-4" /> Xona nomi
											</div>
										</TableHead>

										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4" /> Sig'imi (kishi)
											</div>
										</TableHead>

										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<UsersRound className="h-4 w-4" /> Guruh
											</div>
										</TableHead>
										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4" /> Dars vaqti
											</div>
										</TableHead>
										<TableHead className="text-black font-bold whitespace-nowrap">
											<div className="flex items-center gap-2">
												<CalendarRange className="h-4 w-4" /> Dars kunlari
											</div>
										</TableHead>

										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{roomData.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-10 text-gray-500"
											>
												Xonalar topilmadi.
											</TableCell>
										</TableRow>
									) : (
										roomData.map((room) => (
											<TableRow key={room.room_id} className="bg-card">
												<TableCell className="font-medium">
													{room.room_name}
												</TableCell>
												<TableCell>{room.capacity} ta joy</TableCell>
												<TableCell>{room.group_name ? room.group_name : "-"}</TableCell>
												<TableCell>{room.group_lesson_time ? room.group_lesson_time : "-"}</TableCell>
												<TableCell>
													<div className="flex gap-1">
														{Array.isArray(room.group_lesson_days) ? (
															room.group_lesson_days.map((day) => (
																<span
																	key={day}
																	className="day-pill px-2.5 py-0.75 rounded-[10px]"
																>
																	{day}
																</span>
															))
														) : (
															<span className="day-pill">
																{room.group_lesson_days ? room.group_lesson_days : "-"}
															</span>
														)}
													</div>
												</TableCell>
												<TableCell className={"flex justify-end"}>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 hover:bg-gray-700 text-white"
															>
																<FaEllipsisV />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-32 bg-card border-gray-700 text-white"
														>
															<DropdownMenuItem
																className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
																onClick={() =>
																	setModal({ isOpen: true, data: room })
																}
															>
																<Edit2 className="mr-2 text-blue-400" />{" "}
																Tahrirlash
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 "
																onClick={() =>
																	setDeleteId({
																		id: room.room_id,
																		type: "room",
																	})
																}
															>
																<Trash2 className="mr-2 text-red-500" />{" "}
																O'chirish
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</TabsContent>
				</Tabs>

				{/* Kurs Modali */}
				<Dialog
					open={courseModal.open}
					onOpenChange={(val) => setCourseModal({ ...courseModal, open: val })}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{courseModal.data ? "Kursni tahrirlash" : "Yangi kurs yaratish"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleCourseSubmit} className="space-y-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Kurs nomi</Label>
								<Input
									id="name"
									name="name"
									defaultValue={courseModal.data?.name}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="price">Narxi</Label>
									<Input
										id="price"
										name="price"
										type="number"
										defaultValue={courseModal.data?.price}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="lesson_count">Darslar soni</Label>
									<Input
										id="lesson_count"
										name="lesson_count"
										type="number"
										defaultValue={courseModal.data?.lesson_count}
										required
									/>
								</div>
							</div>
							<DialogFooter className="pt-4">
								<Button type="submit">
									{courseModal.data ? "Saqlash" : "Yaratish"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Xona Modali */}
				<Dialog
					open={roomModal.open}
					onOpenChange={(val) => setRoomModal({ ...roomModal, open: val })}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{roomModal.data ? "Xonani tahrirlash" : "Yangi xona qo'shish"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleRoomSubmit} className="space-y-4">
							<div className="grid gap-2">
								<Label htmlFor="rname">Xona nomi</Label>
								<Input
									id="rname"
									name="name"
									defaultValue={roomModal.data?.room_name}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="rcapacity">Sig'imi</Label>
								<Input
									id="rcapacity"
									name="capacity"
									type="number"
									defaultValue={roomModal.data?.capacity}
									required
								/>
							</div>
							<DialogFooter className="pt-4">
								<Button type="submit">
									{roomModal.data ? "Saqlash" : "Yaratish"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				<ConfirmDeleteModal
					isOpen={!!deleteId.id}
					onClose={() => setDeleteId({ id: null, type: null })}
					onConfirm={handleConfirmDelete}
				/>
			</div>
		);
	};
