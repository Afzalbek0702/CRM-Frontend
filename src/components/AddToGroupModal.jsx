import { useState, useEffect } from "react";
import { FaUsers, FaTimes, FaCheck } from "react-icons/fa";
import { useGroups } from "../hooks/useGroups.js";

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
            <div className="panel-icon"><FaUsers /></div>
            <div>
              <h2>Add to Group</h2>
              <p className="panel-subtitle">Select a group to add the student to</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Choose Group</label>
              <select className="form-input" value={selected || ""} onChange={(e) => setSelected(e.target.value)}>
                <option value="">-- Select group --</option>
                {loading ? (
                  <option value="">Loading...</option>
                ) : (
                  groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="panel-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}><FaTimes /> Cancel</button>
            <button type="button" className="btn-submit" onClick={handleConfirm}><FaCheck /> Add</button>
          </div>
        </div>
      </div>
    </>
  );
}
