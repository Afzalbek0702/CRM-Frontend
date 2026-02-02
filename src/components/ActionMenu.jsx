import { useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ActionMenu({ isOpen, position, onEdit, onDelete, onAddToGroup, entityLabel = "Group", onClose }) {
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			ref={menuRef}
			className="action-menu"
			style={{
				top: position.top,
				left: position.left,
			}}
		>
			<button className="action-item" onClick={onEdit}>
				<FaEdit /> Tahrirlash
			</button>
			<button className="action-item delete" onClick={onDelete}>
				<FaTrash /> O'chirish
			</button>
			{onAddToGroup && (
				<button className="action-item" onClick={onAddToGroup}>
					Add to Group
				</button>
			)}
		</div>
	);
}
