import Loader from "../components/Loader";
import { useWorker } from "../services/worker/useWorker";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "../components/ConfirmProvider";
import { withConfirm } from "../helpers/withConfirm";

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
            <h2>
                <FaUsers /> Xodimlar
            </h2>

            <div className="table-actions">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Xodimlarni qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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

                <button
                    className="btn1"
                    onClick={() => {
                        setEditingWorker(null);
                        setIsModalOpen(true);
                    }}
                >
                    <FaPlus /> Xodim qo'shish
                </button>
            </div>

            {filteredWorkers.length < 1 ? (
                <p>Xodimlar yo'q</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>
                                <FaUsers /> Ism
                            </th>
                            <th>
                                <FaPhone /> Telefon
                            </th>
                            <th>Lavozim</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredWorkers.map((w) => (
                            <tr
                                key={w.id}
                                onClick={() => handleRowClick(w.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{w.full_name}</td>

                                <td>
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
                                </td>

                                <td>{w.position || "-"}</td>

                                <td>{w.role || "-"}</td>

                                <td
                                    style={{ width: "10px" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
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
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ActionMenu
                isOpen={actionMenu.isOpen}
                position={actionMenu.position}
                onClose={() => setActionMenu((s) => ({ ...s, isOpen: false }))}
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
