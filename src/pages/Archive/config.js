import { GraduationCap, Receipt, Users } from "lucide-react";
import { FaBook, FaChalkboardTeacher } from "react-icons/fa";

export const CATEGORY_CONFIG = {
	students: {
		title: "Arxiv - O'quvchilar",
		icon: GraduationCap,
		color: "amber",
		iconClass: "text-amber-400",
		empty: "Arxivlangan o'quvchilar yo'q",
	},
	teachers: {
		title: "Arxiv - O'qituvchilar",
		icon: FaChalkboardTeacher,
		color: "emerald",
		iconClass: "text-emerald-400",
		empty: "Arxivlangan o'qituvchilar yo'q",
	},
	leads: {
		title: "Arxiv - Lidlar",
		icon: Users,
		color: "blue",
		iconClass: "text-sky-400",
		empty: "Arxivlangan lidlar yo'q",
	},
	payments: {
		title: "Arxiv - To'lovlar",
		icon: Receipt,
		color: "purple",
		iconClass: "text-purple-400",
		empty: "Arxivlangan to'lovlar yo'q",
	},
	groups: {
		title: "Arxiv - Guruhlar",
		icon: FaBook,
		color: "amber",
		iconClass: "text-orange-400",
		empty: "Arxivlangan guruhlar yo'q",
	},
};

export const COLORS = {
	amber:
		"from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
	blue: "from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400",
	emerald:
		"from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
	purple:
		"from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
	red: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400",
};

export const SOURCE_COLORS = {
	Instagram: "border-pink-500/30 text-pink-400 bg-pink-500/10",
	Telegram: "border-sky-500/30 text-sky-400 bg-sky-500/10",
	Website: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
	Phone: "border-amber-500/30 text-amber-400 bg-amber-500/10",
	Referral: "border-purple-500/30 text-purple-400 bg-purple-500/10",
};

export const fmtDate = (d) =>
	d
		? new Date(d).toLocaleDateString("uz-UZ", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			})
		: "-";
export const initials = (n) =>
	n
		? n
				.split(" ")
				.map((p) => p[0])
				.join("")
				.toUpperCase()
		: "?";
export const copyPhone = async (phone, setCopied) => {
	await navigator.clipboard.writeText(PhoneUtils.formatPhone(phone));
	setCopied(phone);
	toast.success("Raqam nusxalandi!");
	setTimeout(() => setCopied(null), 2000);
};
