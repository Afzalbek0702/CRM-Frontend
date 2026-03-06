import { useState, useEffect } from "react";
import { FaUsers, FaTimes, FaCheck } from "react-icons/fa";
import { useGroups } from "../services/group/useGroups";

export default function AddToGroupModal({ isOpen, onClose, onConfirm, initialGroupId = null }) {
  const { groups, loading } = useGroups();
  const [selected, setSelected] = useState(initialGroupId);

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
							<select
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
							</select>
						</div>
					</div>

					<div className="panel-buttons">
						<button type="button" className="btn-cancel" onClick={onClose}>
							<FaTimes /> Bekor qilish
						</button>
						<button
							type="button"
							className="btn-submit"
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
