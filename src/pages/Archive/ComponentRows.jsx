import { fmtDate, initials } from "./config";

export const StudentRow = ({ s, onCopy, copied }) => (
	<TableRow
		key={s.id}
		className="border-white/5 hover:bg-amber-400/5 transition-all group/row"
	>
		<TableCell className="py-4">
			<Avatar className="w-10 h-10 border border-white/10 bg-amber-400/20">
				<AvatarFallback className="text-amber-400 text-sm">
					{initials(s.full_name)}
				</AvatarFallback>
			</Avatar>
		</TableCell>
		<TableCell className="font-medium text-white truncate max-w-32">
			{s.full_name}
		</TableCell>
		<TableCell>
			{s.groups?.[0] ? (
				<Badge
					variant="outline"
					className="border-amber-400/30 text-amber-400 bg-amber-400/10"
				>
					{s.groups[0]}
				</Badge>
			) : (
				<span className="text-gray-500 text-sm">—</span>
			)}
		</TableCell>
		<TableCell>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onCopy(s.phone);
						}}
						className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400"
					>
						<span className="truncate max-w-24 font-mono text-sm">
							{PhoneUtils.formatPhone(s.phone)}
						</span>
						{copied === s.phone ? (
							<Check className="w-4 h-4 text-emerald-400" />
						) : (
							<Copy className="w-4 h-4" />
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent className="bg-[#1f1f1f] border-white/10 text-white">
					<p>Nusxa olish</p>
				</TooltipContent>
			</Tooltip>
		</TableCell>
		<TableCell className="text-gray-400 text-sm">
			{s.birthday?.split("T")[0] || "—"}
		</TableCell>
		<TableCell className="text-sm">
			{s.parents_name && <p className="text-gray-300">{s.parents_name}</p>}
			{s.parents_phone && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onCopy(s.parents_phone);
					}}
					className="flex items-center gap-1 text-gray-400 hover:text-amber-400"
				>
					<span className="font-mono">
						{PhoneUtils.formatPhone(s.parents_phone)}
					</span>
					{copied === s.parents_phone && (
						<Check className="w-3 h-3 text-emerald-400" />
					)}
				</button>
			)}
		</TableCell>
		<TableCell className="text-right">
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-gray-500 hover:text-amber-400 opacity-0 group-hover/row:opacity-100"
			>
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</TableCell>
	</TableRow>
);

export const TeacherRow = ({ t, onCopy, copied }) => (
	<TableRow
		key={t.id}
		className="border-white/5 hover:bg-emerald-400/5 transition-all group/row"
	>
		<TableCell className="py-4">
			<Avatar className="w-10 h-10 border border-white/10 bg-emerald-400/20">
				<AvatarFallback className="text-emerald-400 text-sm">
					{initials(t.full_name)}
				</AvatarFallback>
			</Avatar>
		</TableCell>
		<TableCell className="font-medium text-white">{t.full_name}</TableCell>
		<TableCell>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onCopy(t.phone);
						}}
						className="flex items-center gap-1.5 text-gray-300 hover:text-emerald-400"
					>
						<span className="truncate max-w-24 font-mono text-sm">
							{PhoneUtils.formatPhone(t.phone)}
						</span>
						{copied === t.phone && (
							<Check className="w-4 h-4 text-emerald-400" />
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent className="bg-[#1f1f1f] border-white/10 text-white">
					<p>Nusxa olish</p>
				</TooltipContent>
			</Tooltip>
		</TableCell>
		<TableCell>
			<SourceBadge source={t.source} />
		</TableCell>
		<TableCell className="text-right">
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-gray-500 hover:text-emerald-400 opacity-0 group-hover/row:opacity-100"
			>
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</TableCell>
	</TableRow>
);

export const LeadRow = ({ l, courseData, onCopy, copied }) => (
	<TableRow
		key={l.id}
		className="border-white/5 hover:bg-sky-400/5 transition-all group/row"
	>
		<TableCell className="py-4">
			<Avatar className="w-10 h-10 border border-white/10 bg-sky-400/20">
				<AvatarFallback className="text-sky-400 text-sm">
					{initials(l.full_name)}
				</AvatarFallback>
			</Avatar>
		</TableCell>
		<TableCell className="font-medium text-white">{l.full_name}</TableCell>
		<TableCell>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onCopy(l.phone);
						}}
						className="flex items-center gap-1.5 text-gray-300 hover:text-sky-400"
					>
						<span className="truncate max-w-24 font-mono text-sm">
							{PhoneUtils.formatPhone(l.phone)}
						</span>
						{copied === l.phone && (
							<Check className="w-4 h-4 text-emerald-400" />
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent className="bg-[#1f1f1f] border-white/10 text-white">
					<p>Nusxa olish</p>
				</TooltipContent>
			</Tooltip>
		</TableCell>
		<TableCell>
			<SourceBadge source={l.source} />
		</TableCell>
		<TableCell className="text-gray-300">
			{courseData?.find((c) => c.name === l.interested_course)?.name || "—"}
		</TableCell>
		<TableCell className="max-w-32 text-gray-400 text-sm truncate">
			{l.comment || "—"}
		</TableCell>
		<TableCell className="text-right">
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-gray-500 hover:text-sky-400 opacity-0 group-hover/row:opacity-100"
			>
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</TableCell>
	</TableRow>
);

export const PaymentRow = ({ p }) => (
	<TableRow
		key={p.id}
		className="border-white/5 hover:bg-purple-400/5 transition-all group/row"
	>
		<TableCell className="text-gray-400 text-sm flex items-center gap-2">
			<Calendar className="w-4 h-4 text-purple-400/70" />
			{fmtDate(p.paid_at)}
		</TableCell>
		<TableCell className="font-medium text-white">{p.student_name}</TableCell>
		<TableCell>
			<Badge
				variant="outline"
				className="border-amber-400/30 text-amber-400 bg-amber-400/10"
			>
				{p.group_name}
			</Badge>
		</TableCell>
		<TableCell className="text-right font-semibold text-emerald-400">
			{(p.amount || 0).toLocaleString()} so'm
		</TableCell>
		<TableCell>
			<Badge variant="outline" className="border-white/20 text-gray-300">
				{p.method}
			</Badge>
		</TableCell>
		<TableCell className="text-right">
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-gray-500 hover:text-purple-400 opacity-0 group-hover/row:opacity-100"
			>
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</TableCell>
	</TableRow>
);

export const GroupRow = ({ g, navigate }) => {
	const today = getUzDays(
		new Date().toLocaleDateString("uz-UZ", { weekday: "short" }),
	);
	return (
		<TableRow
			key={g.id}
			className="border-white/5 hover:bg-amber-400/5 transition-all group/row cursor-pointer"
			onClick={() => navigate(`/groups/${g.id}`)}
		>
			<TableCell className="py-4">
				<Avatar className="w-10 h-10 border border-white/10 bg-amber-400/20">
					<AvatarFallback className="text-amber-400 text-sm">
						{g.name?.[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</TableCell>
			<TableCell className="font-medium text-white">
				<p className="truncate max-w-32">{g.name}</p>
				<Badge
					variant="outline"
					className="mt-1 text-[10px] border-amber-400/30 text-amber-400 bg-amber-400/10"
				>
					<FaUsers className="w-3 h-3 mr-1" />
					{g.studentCount}
				</Badge>
			</TableCell>
			<TableCell className="font-semibold text-amber-400">
				{g.price} ming so'm
			</TableCell>
			<TableCell className="text-gray-300 flex items-center gap-1.5">
				<FaClock className="w-4 h-4 text-gray-500" />
				{g.lesson_time}
			</TableCell>
			<TableCell>
				<Badge
					variant="outline"
					className="border-amber-400/30 text-amber-400 bg-amber-400/10"
				>
					{g.course_type}
				</Badge>
			</TableCell>
			<TableCell className="text-gray-300 text-sm">
				{g.teachers?.full_name || "—"}
			</TableCell>
			<TableCell>
				<div className="flex flex-wrap gap-1">
					{getUzDays(g.lesson_days).map((day, idx) => (
						<DayPill key={idx} day={day} active={day === today} />
					))}{" "}
				</div>
			</TableCell>
			<TableCell className="text-right">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-gray-500 hover:text-amber-400 opacity-0 group-hover/row:opacity-100"
					onClick={(e) => e.stopPropagation()}
				>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
};
