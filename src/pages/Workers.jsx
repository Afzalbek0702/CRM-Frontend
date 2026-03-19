import Loader from "../components/Loader";
import { useWorker } from "../services/worker/useWorker";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "../components/ConfirmProvider";
import { withConfirm } from "../helpers/withConfirm";
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
import { FaUsers, FaPhone, FaPlus, FaEllipsisV, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import WorkerModal from "../components/WorkerModal";
import ActionMenu from "../components/ActionMenu";

export default function Workers() {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const { tenant } = useParams();
    const { user } = useAuth();
    const { workerData, isLoading, createWorker, updateWorker, removeWorker } =
        useWorker();
    console.log(user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        position: { top: 0, left: 0 },
        worker: null,
    });

    const handleRowClick = (workerId) => {
        navigate(`/${tenant}/workers/${workerId}`);
    };

    const handleDeleteWorker = withConfirm(
        confirm,
        "Are you sure you want to delete this worker?",
        async (worker) => {
            await removeWorker(worker.id);
            setActionMenu((m) => ({ ...m, isOpen: false }));
        }
    );

    if (isLoading) return <Loader />;

    let filteredWorkers = workerData;

    if (filter === "teachers") {
        filteredWorkers = workerData.filter(
            (w) => w.position?.toLowerCase() === "teacher"
        );
    }

    if (filter === "admins") {
        filteredWorkers = workerData.filter((w) => w.role === "admin");
    }

    if (filter === "managers") {
        filteredWorkers = workerData.filter((w) => w.role === "manager");
    }

    filteredWorkers = filteredWorkers.filter(
        (w) =>
            w.full_name &&
            w.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(workerData);


    return (
        <div className="table-container">
            <Button className="btn-default" onClick={goBack}>
                ← Ortga
            </Button>

            <h2>
                <FaUsers /> Xodimlar
            </h2>

            <div className="table-actions mb-7.5">
                <InputGroup>
                    <InputGroupInput
                        type="text"
                        placeholder="Xodimlarni qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <InputGroupAddon>
                        <FaSearch />
                    </InputGroupAddon>
                </InputGroup>

                <Button
                    className="btn-default"
                    onClick={() => {
                        setEditingWorker(null);
                        setIsModalOpen(true);
                    }}
                >
                    <FaPlus /> Xodim qo'shish
                </Button>
            </div>

            {/* <div className="filters">
			<select
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
			>
				<option value="all">Barchasi</option>
				<option value="teachers">O'qituvchilar</option>
				<option value="admins">Adminlar</option>
				<option value="managers">Managerlar</option>
			</select>
		</div> */}

        {/* filterlar qo'shmoqchi edim bo'madi. shuni siz qoshib berin  */}


                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <div>
                                    <FaUsers /> Ism
                                </div>
                            </TableHead>

                            <TableHead>
                                <div>
                                    <FaPhone /> Telefon
                                </div>
                            </TableHead>

                            <TableHead><div>Lavozim</div></TableHead>

                            <TableHead><div>Role</div></TableHead>

                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredWorkers.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6}>
								O'quvchilar topilmadi.
							</TableCell>
						</TableRow>
					) : (
                        filteredWorkers.map((w) => (
                            <TableRow
                                key={w.id}
                                onClick={() => handleRowClick(w.id)}
                                className="cursor-pointer"
                            >
                                <TableCell>{w.full_name}</TableCell>

                                <TableCell>
                                    <p
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(w.phone);

                                            const el = e.currentTarget;
                                            el.dataset.copied = "true";

                                            setTimeout(() => {
                                                el.dataset.copied = "false";
                                            }, 2000);
                                        }}
                                        data-copied="false"
                                        className="copy-phone"
                                    >
                                        {w.phone}
                                    </p>
                                </TableCell>

                                <TableCell>{w.position || "-"}</TableCell>

                                <TableCell>{w.role || "-"}</TableCell>

                                <TableCell
                                    style={{ width: "10px" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        className="icon-button"
                                        onClick={(e) => {
                                            const rect =
                                                e.currentTarget.getBoundingClientRect();

                                            setActionMenu({
                                                isOpen: true,
                                                position: {
                                                    top:
                                                        rect.bottom +
                                                        window.scrollY +
                                                        8 +
                                                        "px",
                                                    left:
                                                        rect.right +
                                                        window.scrollX -
                                                        150 +
                                                        "px",
                                                },
                                                worker: w,
                                            });
                                        }}
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
                onClose={() =>
                    setActionMenu((s) => ({ ...s, isOpen: false }))
                }
                entityLabel="Worker"
                onEdit={() => {
                    const w = actionMenu.worker;
                    setEditingWorker(w);
                    setIsModalOpen(true);
                    setActionMenu((m) => ({ ...m, isOpen: false }));
                }}
                onDelete={() => handleDeleteWorker(actionMenu.worker)}
            />

            <WorkerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingWorker}
                onSubmit={async (formData) => {
                    if (editingWorker) {
                        await updateWorker({
                            id: editingWorker.id,
                            data: formData,
                        });
                    } else {
                        await createWorker(formData);
                    }

                    setIsModalOpen(false);
                    setEditingWorker(null);
                }}
            />
        </div>
    );
}
