import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";

export default function ConfirmDeleteModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
}) {
	return (
		// <AlertDialog open={isOpen} onOpenChange={onClose}>
		// 	<AlertDialogContent>
		// 		<AlertDialogHeader>
		// 			<AlertDialogTitle className="text-xl">
		// 				{title || "Haqiqatdan ham o'chirmoqchimisiz?"}
		// 			</AlertDialogTitle>
		// 			<AlertDialogDescription className="text-gray-400">
		// 				{description ||
		// 					"Ushbu amalni ortga qaytarib bo'lmaydi. Ma'lumot bazadan butunlay o'chiriladi."}
		// 			</AlertDialogDescription>
		// 		</AlertDialogHeader>
		// 		<AlertDialogFooter className="gap-2 bg-card">
		// 			<AlertDialogCancel
		// 				onClick={onClose}
		// 				className=" text-black hover:bg-gray-200 border-none rounded-md"
		// 			>
		// 				Bekor qilish
		// 			</AlertDialogCancel>
		// 			<AlertDialogAction
		// 				onClick={onConfirm}
		// 				className="bg-red-600 text-white hover:bg-red-700 border-none rounded-md"
		// 			>
		// 				O'chirish
		// 			</AlertDialogAction>
		// 		</AlertDialogFooter>
		// 	</AlertDialogContent>
		// </AlertDialog>
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
						<Trash2Icon />
					</AlertDialogMedia>
					<AlertDialogTitle>
						{title || "Haqiqatdan ham o'chirmoqchimisiz?"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{description ||
							"Ushbu amalni ortga qaytarib bo'lmaydi. Ma'lumot bazadan butunlay o'chiriladi."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className={'bg-card'}>
					<AlertDialogCancel variant="outline" onClick={onClose}>
						Bekor qilish
					</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={onConfirm}>
						O'chirish
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
