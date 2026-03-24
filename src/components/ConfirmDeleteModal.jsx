import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfirmDeleteModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
}) {
	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="bg-[#1F1F1F] border-gray-700 text-white">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-xl">
						{title || "Haqiqatdan ham o'chirmoqchimisiz?"}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-gray-400">
						{description ||
							"Ushbu amalni ortga qaytarib bo'lmaydi. Ma'lumot bazadan butunlay o'chiriladi."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel
						onClick={onClose}
						className="bg-white text-black hover:bg-gray-200 border-none rounded-md"
					>
						Bekor qilish
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-red-600 text-white hover:bg-red-700 border-none rounded-md"
					>
						O'chirish
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
